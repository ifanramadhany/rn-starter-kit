import { create } from 'zustand';

import { dailySurveyActivity, initialSurveyQuestions } from '../services/surveySeed';
import type {
  DashboardActivityPoint,
  ParticipantAgeRange,
  ParticipantBiodata,
  ParticipantGender,
  QuestionFormValues,
  SurveyQuestion,
} from '../types';

type QuestionMoveDirection = 'up' | 'down';
type SessionStage = 'biodata' | 'in-progress' | 'completed';

type SurveyStore = {
  activity: DashboardActivityPoint[];
  questions: SurveyQuestion[];
  participant: ParticipantBiodata;
  answers: Record<string, string[]>;
  activeQuestionIndex: number;
  sessionStage: SessionStage;
  setGender: (gender: ParticipantGender) => void;
  setAgeRange: (ageRange: ParticipantAgeRange) => void;
  startSurvey: () => void;
  restartSurvey: () => void;
  setSingleAnswer: (questionId: string, optionId: string) => void;
  toggleMultiAnswer: (questionId: string, optionId: string) => void;
  previousQuestion: () => void;
  nextQuestion: () => void;
  completeSurvey: () => void;
  toggleQuestionStatus: (questionId: string) => void;
  deleteQuestion: (questionId: string) => void;
  moveQuestion: (questionId: string, direction: QuestionMoveDirection) => void;
  saveQuestion: (questionId: string | undefined, values: QuestionFormValues) => string;
};

function sortQuestions(questions: SurveyQuestion[]) {
  return [...questions].sort((left, right) => left.order - right.order);
}

function reindexQuestions(questions: SurveyQuestion[]) {
  return questions.map((question, index) => ({
    ...question,
    order: index + 1,
  }));
}

function getActiveQuestions(questions: SurveyQuestion[]) {
  return sortQuestions(questions).filter((question) => question.status === 'active');
}

function clampQuestionIndex(questions: SurveyQuestion[], activeQuestionIndex: number) {
  const activeQuestionCount = getActiveQuestions(questions).length;

  if (activeQuestionCount === 0) {
    return 0;
  }

  return Math.min(activeQuestionIndex, activeQuestionCount - 1);
}

function createQuestionId(questions: SurveyQuestion[]) {
  const highestId = questions.reduce((highest, question) => {
    const numericId = Number(question.id.replace(/\D+/g, ''));

    return Number.isNaN(numericId) ? highest : Math.max(highest, numericId);
  }, 1040);

  return `Q-${highestId + 1}`;
}

function mapOptionLabels(questionId: string, options: string[]) {
  return options.map((optionLabel, index) => ({
    id: `${questionId}-${index + 1}`,
    label: optionLabel,
    responseCount: 0,
  }));
}

export const useSurveyStore = create<SurveyStore>((set) => ({
  activity: dailySurveyActivity,
  questions: initialSurveyQuestions,
  participant: {},
  answers: {},
  activeQuestionIndex: 0,
  sessionStage: 'biodata',

  setGender: (gender) => {
    set((state) => ({ participant: { ...state.participant, gender } }));
  },

  setAgeRange: (ageRange) => {
    set((state) => ({ participant: { ...state.participant, ageRange } }));
  },

  startSurvey: () => {
    set({
      answers: {},
      activeQuestionIndex: 0,
      sessionStage: 'in-progress',
    });
  },

  restartSurvey: () => {
    set({
      participant: {},
      answers: {},
      activeQuestionIndex: 0,
      sessionStage: 'biodata',
    });
  },

  setSingleAnswer: (questionId, optionId) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: [optionId],
      },
    }));
  },

  toggleMultiAnswer: (questionId, optionId) => {
    set((state) => {
      const previousAnswers = state.answers[questionId] ?? [];
      const nextAnswers = previousAnswers.includes(optionId)
        ? previousAnswers.filter((currentOptionId) => currentOptionId !== optionId)
        : [...previousAnswers, optionId];

      return {
        answers: {
          ...state.answers,
          [questionId]: nextAnswers,
        },
      };
    });
  },

  previousQuestion: () => {
    set((state) => ({
      activeQuestionIndex: Math.max(state.activeQuestionIndex - 1, 0),
    }));
  },

  nextQuestion: () => {
    set((state) => {
      const activeQuestions = getActiveQuestions(state.questions);
      const isLastQuestion = state.activeQuestionIndex >= activeQuestions.length - 1;

      if (isLastQuestion) {
        return {
          sessionStage: 'completed' as const,
        };
      }

      return {
        activeQuestionIndex: state.activeQuestionIndex + 1,
      };
    });
  },

  completeSurvey: () => {
    set({ sessionStage: 'completed' });
  },

  toggleQuestionStatus: (questionId) => {
    set((state) => {
      const questions = reindexQuestions(
        state.questions.map((question) =>
          question.id === questionId
            ? {
                ...question,
                status: question.status === 'active' ? 'draft' : 'active',
                updatedAt: 'Updated now',
              }
            : question,
        ),
      );

      return {
        questions,
        activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
      };
    });
  },

  deleteQuestion: (questionId) => {
    set((state) => {
      const questions = reindexQuestions(
        state.questions.filter((question) => question.id !== questionId),
      );
      const remainingAnswers = Object.fromEntries(
        Object.entries(state.answers).filter(
          ([currentQuestionId]) => currentQuestionId !== questionId,
        ),
      );

      return {
        questions,
        answers: remainingAnswers,
        activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
      };
    });
  },

  moveQuestion: (questionId, direction) => {
    set((state) => {
      const questions = sortQuestions(state.questions);
      const questionIndex = questions.findIndex((question) => question.id === questionId);

      if (questionIndex < 0) {
        return state;
      }

      const targetIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;

      if (targetIndex < 0 || targetIndex >= questions.length) {
        return state;
      }

      const nextQuestions = [...questions];
      const [question] = nextQuestions.splice(questionIndex, 1);
      nextQuestions.splice(targetIndex, 0, question);

      return {
        questions: reindexQuestions(nextQuestions).map((currentQuestion) =>
          currentQuestion.id === questionId
            ? { ...currentQuestion, updatedAt: 'Reordered just now' }
            : currentQuestion,
        ),
      };
    });
  },

  saveQuestion: (questionId, values) => {
    let savedQuestionId = questionId ?? '';

    set((state) => {
      const normalizedOptions = values.options.map((option) => option.trim()).filter(Boolean);
      const safeOptions =
        normalizedOptions.length > 0 ? normalizedOptions : ['Option 1', 'Option 2'];
      const nextQuestionId = questionId ?? createQuestionId(state.questions);
      const nextQuestion: SurveyQuestion = {
        id: nextQuestionId,
        title: values.title.trim(),
        helperText: values.helperText.trim(),
        type: values.type,
        status: values.status,
        order:
          state.questions.find((question) => question.id === nextQuestionId)?.order ??
          state.questions.length + 1,
        updatedAt: questionId ? 'Updated just now' : 'Created just now',
        options: mapOptionLabels(nextQuestionId, safeOptions),
      };

      savedQuestionId = nextQuestionId;

      const existingQuestion = state.questions.find((question) => question.id === nextQuestionId);
      const questions = existingQuestion
        ? state.questions.map((question) =>
            question.id === nextQuestionId ? nextQuestion : question,
          )
        : [...state.questions, nextQuestion];

      return {
        questions: reindexQuestions(questions),
      };
    });

    return savedQuestionId;
  },
}));
