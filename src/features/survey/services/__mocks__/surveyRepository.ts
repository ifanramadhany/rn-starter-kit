import { createCurrentMonthActivity, initialSurveyQuestions } from '../surveySeed';
import type {
  ActivityPeriod,
  DashboardActivityPoint,
  ParticipantBiodata,
  QuestionFormValues,
  QuestionStatus,
  SurveyRespondentDetail,
  SurveyQuestion,
} from '../../types';

function cloneQuestions(questions: SurveyQuestion[]) {
  return questions.map((question) => ({
    ...question,
    options: question.options.map((option) => ({ ...option })),
  }));
}

function cloneActivity(activity: DashboardActivityPoint[]) {
  return activity.map((activityPoint) => ({ ...activityPoint }));
}

function sortQuestions(questions: SurveyQuestion[]) {
  return [...questions].sort((left, right) => left.order - right.order);
}

function normalizeOptionLabels(options: string[]) {
  const normalizedLabels = options.map((option) => option.trim()).filter(Boolean);

  return normalizedLabels.length > 0 ? normalizedLabels : ['Opsi 1', 'Opsi 2'];
}

let questions = cloneQuestions(initialSurveyQuestions);
let activity = createCurrentMonthActivity();
let sessions: Array<
  SurveyRespondentDetail & {
    completedAt: string;
  }
> = [];

function createUpdatedLabel() {
  return 'Diperbarui hari ini';
}

function syncQuestionOrder(nextQuestions: SurveyQuestion[]) {
  questions = nextQuestions.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
}

function findCurrentDayIndex() {
  const currentDayLabel = String(new Date().getDate()).padStart(2, '0');

  return activity.findIndex((activityPoint) => activityPoint.label === currentDayLabel);
}

export function resetSurveyRepositoryMock() {
  questions = cloneQuestions(initialSurveyQuestions);
  activity = createCurrentMonthActivity();
  sessions = [];
}

export const surveyRepository = {
  async initialize() {
    if (questions.length === 0) {
      resetSurveyRepositoryMock();
    }
  },

  async getQuestions() {
    return cloneQuestions(sortQuestions(questions));
  },

  async getActivity(_period?: ActivityPeriod) {
    return cloneActivity(activity);
  },

  async getAvailableActivityYears() {
    return Array.from(
      new Set([
        new Date().getFullYear(),
        ...sessions.map((session) => Number(session.completedAt.slice(0, 4))),
      ]),
    )
      .filter((year) => !Number.isNaN(year))
      .sort((left, right) => right - left);
  },

  async getActivityDayRespondents(period: ActivityPeriod, dayLabel: string) {
    const monthLabel = String(period.month + 1).padStart(2, '0');
    const dateKey = `${period.year}-${monthLabel}-${dayLabel}`;

    return sessions
      .filter((session) => session.completedAt.slice(0, 10) === dateKey)
      .map(({ completedAt: _completedAt, ...session }) => ({ ...session }));
  },

  async clearAllResponses() {
    activity = activity.map((activityPoint) => ({
      ...activityPoint,
      completions: 0,
    }));
    questions = questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({
        ...option,
        responseCount: 0,
      })),
    }));
    sessions = [];
  },

  async setQuestionStatus(questionId: string, status: QuestionStatus) {
    questions = questions.map((question) =>
      question.id === questionId
        ? { ...question, status, updatedAt: createUpdatedLabel() }
        : question,
    );

    return this.getQuestions();
  },

  async deleteQuestion(questionId: string) {
    syncQuestionOrder(questions.filter((question) => question.id !== questionId));

    return this.getQuestions();
  },

  async deleteAllQuestions() {
    questions = [];

    return this.getQuestions();
  },

  async reorderQuestions(questionIds: string[]) {
    const questionById = new Map(questions.map((question) => [question.id, question]));
    const reorderedQuestions = questionIds
      .map((questionId) => questionById.get(questionId))
      .filter((question): question is SurveyQuestion => Boolean(question))
      .map((question) => ({
        ...question,
        updatedAt: createUpdatedLabel(),
      }));

    syncQuestionOrder(reorderedQuestions);

    return this.getQuestions();
  },

  async saveQuestion(questionId: string, values: QuestionFormValues, fallbackOrder: number) {
    const existingQuestion = questions.find((question) => question.id === questionId);
    const nextOptions = normalizeOptionLabels(values.options).map((label, index) => ({
      id: existingQuestion?.options[index]?.id ?? `${questionId}-${index + 1}`,
      label,
      responseCount: existingQuestion?.options[index]?.responseCount ?? 0,
    }));

    if (existingQuestion) {
      questions = questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              title: values.title.trim(),
              helperText: values.helperText.trim(),
              type: values.type,
              status: values.status,
              options: nextOptions,
              updatedAt: createUpdatedLabel(),
            }
          : question,
      );
    } else {
      syncQuestionOrder(
        sortQuestions([
          ...questions,
          {
            id: questionId,
            title: values.title.trim(),
            helperText: values.helperText.trim(),
            type: values.type,
            status: values.status,
            options: nextOptions,
            order: fallbackOrder,
            updatedAt: createUpdatedLabel(),
          },
        ]),
      );
    }

    return this.getQuestions();
  },

  async createSurveySubmission(
    participant: Required<ParticipantBiodata>,
    answers: Record<string, string[]>,
  ) {
    const completedAt = new Date().toISOString();

    questions = questions.map((question) => ({
      ...question,
      options: question.options.map((option) => ({
        ...option,
        responseCount:
          option.responseCount +
          Object.values(answers).reduce(
            (count, optionIds) => count + (optionIds.includes(option.id) ? 1 : 0),
            0,
          ),
      })),
    }));

    const currentDayIndex = findCurrentDayIndex();

    if (currentDayIndex >= 0) {
      activity = activity.map((activityPoint, index) =>
        index === currentDayIndex
          ? {
              ...activityPoint,
              completions: activityPoint.completions + 1,
            }
          : activityPoint,
      );
    }

    sessions.push({
      id: `session-${sessions.length + 1}`,
      gender: participant.gender,
      ageRange: participant.ageRange,
      completedAt,
    });

    return Promise.resolve(participant);
  },
};
