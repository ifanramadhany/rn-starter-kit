import { getSurveyDatabase } from './surveyDatabase';
import { createCurrentMonthActivity, initialSurveyQuestions } from './surveySeed';
import type {
  ActivityPeriod,
  ParticipantBiodata,
  ParticipantAgeRange,
  ParticipantGender,
  QuestionFormValues,
  QuestionStatus,
  SurveyRespondentDetail,
  SurveyQuestion,
} from '../types';

type QuestionRow = {
  id: string;
  title: string;
  helper_text: string;
  type: SurveyQuestion['type'];
  status: QuestionStatus;
  display_order: number;
  updated_at: string;
};

type OptionRow = {
  id: string;
  question_id: string;
  label: string;
  display_order: number;
  response_count: number;
};

type DayCountRow = {
  day_label: string;
  completion_count: number;
};

type YearRow = {
  year_label: string;
};

type SessionRow = {
  id: string;
  gender: string | null;
  age_range: string | null;
};

type QuestionOrderRow = {
  id: string;
  display_order: number;
};

type SqlBatchStatement = string | [string, unknown[]];

const DEFAULT_QUESTION_CATALOG_VERSION = 3;
const LEGACY_DEFAULT_QUESTION_IDS = Array.from({ length: 25 }, (_, index) => `Q-${1042 + index}`);
const CURRENT_DEFAULT_QUESTION_IDS = initialSurveyQuestions.map((question) => question.id);
const REMOVABLE_DEFAULT_QUESTION_ID_SET = new Set([
  ...LEGACY_DEFAULT_QUESTION_IDS,
  ...CURRENT_DEFAULT_QUESTION_IDS,
]);

function padDatePart(value: number, length = 2) {
  return String(value).padStart(length, '0');
}

function createStorageTimestamp(date = new Date()) {
  return [
    `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`,
    `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}:${padDatePart(
      date.getSeconds(),
    )}.${padDatePart(date.getMilliseconds(), 3)}`,
  ].join('T');
}

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeOptionLabels(options: string[]) {
  const normalizedLabels = options.map((option) => option.trim()).filter(Boolean);

  return normalizedLabels.length > 0 ? normalizedLabels : ['Opsi 1', 'Opsi 2'];
}

function normalizeRespondentGender(gender: string | null): SurveyRespondentDetail['gender'] {
  if (gender === 'male' || gender === 'female' || gender === 'other') {
    return gender satisfies ParticipantGender;
  }

  return 'unknown';
}

function normalizeRespondentAgeRange(ageRange: string | null): SurveyRespondentDetail['ageRange'] {
  if (ageRange === '18-35' || ageRange === '36-55' || ageRange === '56+') {
    return ageRange satisfies ParticipantAgeRange;
  }

  return 'unknown';
}

function formatUpdatedAt(timestamp: string) {
  const updatedAtDate = new Date(timestamp);

  if (Number.isNaN(updatedAtDate.getTime())) {
    return 'Baru diperbarui';
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfUpdatedDay = new Date(
    updatedAtDate.getFullYear(),
    updatedAtDate.getMonth(),
    updatedAtDate.getDate(),
  );
  const diffInDays = Math.round(
    (startOfToday.getTime() - startOfUpdatedDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 0) {
    return 'Diperbarui hari ini';
  }

  if (diffInDays === 1) {
    return 'Diperbarui kemarin';
  }

  if (diffInDays < 7) {
    return `Diperbarui ${diffInDays} hari lalu`;
  }

  return `Diperbarui ${updatedAtDate.toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric',
  })}`;
}

function collectRows<Row>(resultRows: { length: number; item: (index: number) => unknown }) {
  const rows: Row[] = [];

  for (let rowIndex = 0; rowIndex < resultRows.length; rowIndex += 1) {
    rows.push(resultRows.item(rowIndex) as Row);
  }

  return rows;
}

async function executeBatch(statements: SqlBatchStatement[]) {
  if (statements.length === 0) {
    return;
  }

  const database = await getSurveyDatabase();

  await database.sqlBatch(statements);
}

async function executeQuery(statement: string, params?: unknown[]) {
  const database = await getSurveyDatabase();
  const [result] = await database.executeSql(statement, params);

  return result;
}

async function runMigrations() {
  await executeBatch([
    `
      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        helper_text TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS question_options (
        id TEXT PRIMARY KEY NOT NULL,
        question_id TEXT NOT NULL,
        label TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS survey_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        gender TEXT,
        age_range TEXT,
        completed_at TEXT NOT NULL
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS survey_answers (
        id TEXT PRIMARY KEY NOT NULL,
        session_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        option_id TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES survey_sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
        FOREIGN KEY (option_id) REFERENCES question_options(id) ON DELETE CASCADE
      );
    `,
    'CREATE INDEX IF NOT EXISTS idx_questions_display_order ON questions(display_order);',
    'CREATE INDEX IF NOT EXISTS idx_options_question_order ON question_options(question_id, display_order);',
    'CREATE INDEX IF NOT EXISTS idx_answers_option_id ON survey_answers(option_id);',
    'CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON survey_sessions(completed_at);',
  ]);
}

async function seedDefaultQuestionsIfNeeded() {
  const [catalogVersionResult, existingQuestionsResult] = await Promise.all([
    executeQuery('SELECT value FROM app_meta WHERE key = ? LIMIT 1;', [
      'default_question_catalog_version',
    ]),
    executeQuery(
      `
        SELECT id, display_order
        FROM questions
        ORDER BY display_order ASC;
      `,
    ),
  ]);
  const currentCatalogVersion =
    catalogVersionResult.rows.length > 0
      ? Number(
          (catalogVersionResult.rows.item(0) as { value?: number | string }).value ??
            DEFAULT_QUESTION_CATALOG_VERSION,
        )
      : 0;

  if (currentCatalogVersion >= DEFAULT_QUESTION_CATALOG_VERSION) {
    return;
  }

  const existingQuestions = collectRows<QuestionOrderRow>(existingQuestionsResult.rows);
  const removableQuestionIds = existingQuestions
    .filter((question) => REMOVABLE_DEFAULT_QUESTION_ID_SET.has(question.id))
    .map((question) => question.id);
  const remainingQuestionIds = existingQuestions
    .filter((question) => !REMOVABLE_DEFAULT_QUESTION_ID_SET.has(question.id))
    .map((question) => question.id);
  const seededAt = createStorageTimestamp();
  const statements: SqlBatchStatement[] = [];

  if (removableQuestionIds.length > 0) {
    const placeholders = removableQuestionIds.map(() => '?').join(', ');

    statements.push([
      `DELETE FROM survey_answers WHERE question_id IN (${placeholders});`,
      removableQuestionIds,
    ]);
    statements.push(
      'DELETE FROM survey_sessions WHERE id NOT IN (SELECT DISTINCT session_id FROM survey_answers);',
    );
    statements.push([
      `DELETE FROM question_options WHERE question_id IN (${placeholders});`,
      removableQuestionIds,
    ]);
    statements.push([`DELETE FROM questions WHERE id IN (${placeholders});`, removableQuestionIds]);
  }

  for (const [questionIndex, questionId] of remainingQuestionIds.entries()) {
    statements.push([
      'UPDATE questions SET display_order = ? WHERE id = ?;',
      [questionIndex + 1, questionId],
    ]);
  }

  for (const [questionIndex, question] of initialSurveyQuestions.entries()) {
    statements.push([
      `
        INSERT INTO questions (id, title, helper_text, type, status, display_order, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        question.id,
        question.title,
        question.helperText,
        question.type,
        question.status,
        remainingQuestionIds.length + questionIndex + 1,
        seededAt,
      ],
    ]);

    for (const [optionIndex, option] of question.options.entries()) {
      statements.push([
        `
          INSERT INTO question_options (id, question_id, label, display_order)
          VALUES (?, ?, ?, ?);
        `,
        [option.id, question.id, option.label, optionIndex + 1],
      ]);
    }
  }

  statements.push([
    'INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?);',
    ['default_question_catalog_version', String(DEFAULT_QUESTION_CATALOG_VERSION)],
  ]);

  await executeBatch(statements);
}

async function loadQuestions() {
  const questionResult = await executeQuery(
    `
      SELECT id, title, helper_text, type, status, display_order, updated_at
      FROM questions
      ORDER BY display_order ASC;
    `,
  );
  const optionResult = await executeQuery(
    `
      SELECT
        question_options.id,
        question_options.question_id,
        question_options.label,
        question_options.display_order,
        COUNT(survey_answers.id) AS response_count
      FROM question_options
      LEFT JOIN survey_answers
        ON survey_answers.option_id = question_options.id
      GROUP BY
        question_options.id,
        question_options.question_id,
        question_options.label,
        question_options.display_order
      ORDER BY question_options.question_id ASC, question_options.display_order ASC;
    `,
  );

  const questionRows = collectRows<QuestionRow>(questionResult.rows);
  const optionRows = collectRows<OptionRow>(optionResult.rows);

  return questionRows.map((question) => ({
    id: question.id,
    title: question.title,
    helperText: question.helper_text,
    type: question.type,
    status: question.status,
    order: question.display_order,
    updatedAt: formatUpdatedAt(question.updated_at),
    options: optionRows
      .filter((option) => option.question_id === question.id)
      .map((option) => ({
        id: option.id,
        label: option.label,
        responseCount: Number(option.response_count ?? 0),
      })),
  }));
}

async function loadActivity() {
  const referenceDate = new Date();
  return loadActivityForPeriod({
    month: referenceDate.getMonth(),
    year: referenceDate.getFullYear(),
  });
}

async function loadActivityForPeriod(period: ActivityPeriod) {
  const referenceDate = new Date(period.year, period.month, 1);
  const today = new Date();
  const highlightedDay =
    today.getFullYear() === period.year && today.getMonth() === period.month
      ? today.getDate()
      : null;
  const monthKey = `${period.year}-${String(period.month + 1).padStart(2, '0')}`;
  const skeletonActivity = createCurrentMonthActivity(referenceDate, highlightedDay);
  const activityResult = await executeQuery(
    `
      SELECT
        substr(completed_at, 9, 2) AS day_label,
        COUNT(*) AS completion_count
      FROM survey_sessions
      WHERE substr(completed_at, 1, 7) = ?
      GROUP BY substr(completed_at, 9, 2)
      ORDER BY day_label ASC;
    `,
    [monthKey],
  );

  const countsByDay = new Map(
    collectRows<DayCountRow>(activityResult.rows).map((row) => [
      row.day_label,
      Number(row.completion_count ?? 0),
    ]),
  );

  return skeletonActivity.map((activityPoint) => ({
    ...activityPoint,
    completions: countsByDay.get(activityPoint.label) ?? 0,
  }));
}

async function loadAvailableActivityYears() {
  const currentYear = new Date().getFullYear();
  const yearResult = await executeQuery(
    `
      SELECT DISTINCT substr(completed_at, 1, 4) AS year_label
      FROM survey_sessions
      ORDER BY year_label DESC;
    `,
  );
  const years = collectRows<YearRow>(yearResult.rows)
    .map((row) => Number(row.year_label))
    .filter((year) => !Number.isNaN(year));

  return Array.from(new Set([currentYear, ...years])).sort((left, right) => right - left);
}

async function loadActivityDayRespondents(period: ActivityPeriod, dayLabel: string) {
  const dateKey = `${period.year}-${padDatePart(period.month + 1)}-${dayLabel}`;
  const sessionResult = await executeQuery(
    `
      SELECT id, gender, age_range
      FROM survey_sessions
      WHERE substr(completed_at, 1, 10) = ?
      ORDER BY completed_at ASC;
    `,
    [dateKey],
  );

  return collectRows<SessionRow>(sessionResult.rows).map((session) => ({
    id: session.id,
    gender: normalizeRespondentGender(session.gender),
    ageRange: normalizeRespondentAgeRange(session.age_range),
  }));
}

async function getExistingQuestionOptions(questionId: string) {
  const existingOptionResult = await executeQuery(
    `
      SELECT id, display_order
      FROM question_options
      WHERE question_id = ?
      ORDER BY display_order ASC;
    `,
    [questionId],
  );

  return collectRows<{ id: string; display_order: number }>(existingOptionResult.rows);
}

function createOptionMutationStatements(
  questionId: string,
  optionLabels: string[],
  existingOptions: { id: string; display_order: number }[],
) {
  const statements: SqlBatchStatement[] = [];

  for (const [optionIndex, optionLabel] of optionLabels.entries()) {
    const existingOption = existingOptions[optionIndex];

    if (existingOption) {
      statements.push([
        `
          UPDATE question_options
          SET label = ?, display_order = ?
          WHERE id = ?;
        `,
        [optionLabel, optionIndex + 1, existingOption.id],
      ]);

      continue;
    }

    statements.push([
      `
        INSERT INTO question_options (id, question_id, label, display_order)
        VALUES (?, ?, ?, ?);
      `,
      [createLocalId(`${questionId}-opt`), questionId, optionLabel, optionIndex + 1],
    ]);
  }

  const removedOptions = existingOptions.slice(optionLabels.length);

  for (const removedOption of removedOptions) {
    statements.push(['DELETE FROM question_options WHERE id = ?;', [removedOption.id]]);
  }

  return statements;
}

async function persistQuestion(
  questionId: string,
  values: QuestionFormValues,
  fallbackOrder: number,
) {
  const existingQuestionResult = await executeQuery(
    'SELECT id, display_order FROM questions WHERE id = ? LIMIT 1;',
    [questionId],
  );
  const hasExistingQuestion = existingQuestionResult.rows.length > 0;
  const existingOrder = hasExistingQuestion
    ? Number(
        (
          existingQuestionResult.rows.item(0) as {
            display_order?: number | string;
          }
        ).display_order ?? fallbackOrder,
      )
    : fallbackOrder;
  const optionLabels = normalizeOptionLabels(values.options);
  const existingOptions = await getExistingQuestionOptions(questionId);
  const questionStatement: SqlBatchStatement = hasExistingQuestion
    ? [
        `
          UPDATE questions
          SET title = ?, helper_text = ?, type = ?, status = ?, updated_at = ?
          WHERE id = ?;
        `,
        [
          values.title.trim(),
          values.helperText.trim(),
          values.type,
          values.status,
          createStorageTimestamp(),
          questionId,
        ],
      ]
    : [
        `
          INSERT INTO questions (id, title, helper_text, type, status, display_order, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [
          questionId,
          values.title.trim(),
          values.helperText.trim(),
          values.type,
          values.status,
          existingOrder,
          createStorageTimestamp(),
        ],
      ];

  await executeBatch([
    questionStatement,
    ...createOptionMutationStatements(questionId, optionLabels, existingOptions),
  ]);

  return loadQuestions();
}

export const surveyRepository = {
  async initialize() {
    await runMigrations();
    await seedDefaultQuestionsIfNeeded();
  },

  async getQuestions() {
    return loadQuestions();
  },

  async getAvailableActivityYears() {
    return loadAvailableActivityYears();
  },

  async getActivity(period?: ActivityPeriod) {
    if (!period) {
      return loadActivity();
    }

    return loadActivityForPeriod(period);
  },

  async getActivityDayRespondents(period: ActivityPeriod, dayLabel: string) {
    return loadActivityDayRespondents(period, dayLabel);
  },

  async clearAllResponses() {
    await executeBatch(['DELETE FROM survey_answers;', 'DELETE FROM survey_sessions;']);
  },

  async setQuestionStatus(questionId: string, status: QuestionStatus) {
    const database = await getSurveyDatabase();

    await database.executeSql('UPDATE questions SET status = ?, updated_at = ? WHERE id = ?;', [
      status,
      createStorageTimestamp(),
      questionId,
    ]);

    return loadQuestions();
  },

  async deleteQuestion(questionId: string) {
    const database = await getSurveyDatabase();

    await database.executeSql('DELETE FROM questions WHERE id = ?;', [questionId]);
    const refreshedQuestions = await loadQuestions();
    await executeBatch(
      refreshedQuestions.map(
        (question, questionIndex) =>
          [
            'UPDATE questions SET display_order = ? WHERE id = ?;',
            [questionIndex + 1, question.id],
          ] as [string, unknown[]],
      ),
    );

    return loadQuestions();
  },

  async deleteAllQuestions() {
    await executeBatch([
      'DELETE FROM survey_answers;',
      'DELETE FROM question_options;',
      'DELETE FROM questions;',
    ]);

    return loadQuestions();
  },

  async reorderQuestions(questionIds: string[]) {
    await executeBatch(
      questionIds.map(
        (questionId, questionIndex) =>
          [
            'UPDATE questions SET display_order = ?, updated_at = ? WHERE id = ?;',
            [questionIndex + 1, createStorageTimestamp(), questionId],
          ] as [string, unknown[]],
      ),
    );

    return loadQuestions();
  },

  async saveQuestion(questionId: string, values: QuestionFormValues, fallbackOrder: number) {
    return persistQuestion(questionId, values, fallbackOrder);
  },

  async createSurveySubmission(
    participant: Required<ParticipantBiodata>,
    answers: Record<string, string[]>,
  ) {
    const submissionId = createLocalId('session');
    const completedAt = createStorageTimestamp();
    const statements: SqlBatchStatement[] = [
      [
        `
          INSERT INTO survey_sessions (id, gender, age_range, completed_at)
          VALUES (?, ?, ?, ?);
        `,
        [submissionId, participant.gender, participant.ageRange, completedAt],
      ],
    ];

    for (const [questionId, optionIds] of Object.entries(answers)) {
      for (const optionId of optionIds) {
        statements.push([
          `
            INSERT INTO survey_answers (id, session_id, question_id, option_id)
            VALUES (?, ?, ?, ?);
          `,
          [createLocalId('answer'), submissionId, questionId, optionId],
        ]);
      }
    }

    await executeBatch(statements);
  },
};
