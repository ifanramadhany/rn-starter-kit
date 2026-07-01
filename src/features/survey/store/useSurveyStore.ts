import { create } from 'zustand';

import { createCurrentMonthActivity, initialSurveyQuestions } from '../services/surveySeed';
import { surveyRepository } from '../services/surveyRepository';
import type {
  ActivityPeriod,
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
  activityPeriod: ActivityPeriod;
  availableActivityYears: number[];
  questions: SurveyQuestion[];
  participant: ParticipantBiodata;
  answers: Record<string, string[]>;
  activeQuestionIndex: number;
  sessionStage: SessionStage;
  isLoading: boolean;
  isSubmittingSurvey: boolean;
  initialize: () => Promise<void>;
  refreshSurveyData: () => Promise<void>;
  setActivityPeriod: (period: ActivityPeriod) => Promise<void>;
  setGender: (gender: ParticipantGender) => void;
  setAgeRange: (ageRange: ParticipantAgeRange) => void;
  startSurvey: () => void;
  restartSurvey: () => void;
  setSingleAnswer: (questionId: string, optionId: string) => void;
  toggleMultiAnswer: (questionId: string, optionId: string) => void;
  previousQuestion: () => void;
  nextQuestion: () => void;
  completeSurvey: () => void;
  submitSurveySession: () => Promise<void>;
  clearAllResponses: () => Promise<void>;
  toggleQuestionStatus: (questionId: string) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
  deleteAllQuestions: () => Promise<void>;
  moveQuestion: (questionId: string, direction: QuestionMoveDirection) => Promise<void>;
  saveQuestion: (questionId: string | undefined, values: QuestionFormValues) => Promise<string>;
};

function sortQuestions(questions: SurveyQuestion[]) {
  return [...questions].sort((left, right) => left.order - right.order);
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

export const useSurveyStore = create<SurveyStore>((set, get) => ({
  activity: createCurrentMonthActivity(),
  activityPeriod: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  availableActivityYears: [new Date().getFullYear()],
  questions: [],
  participant: {},
  answers: {},
  activeQuestionIndex: 0,
  sessionStage: 'biodata',
  isLoading: true,
  isSubmittingSurvey: false,

  initialize: async () => {
    set({ isLoading: true });

    try {
      await surveyRepository.initialize();
      const activityPeriod = get().activityPeriod;
      const [questions, activity] = await Promise.all([
        surveyRepository.getQuestions(),
        surveyRepository.getActivity(activityPeriod),
      ]);
      const availableActivityYears = await surveyRepository.getAvailableActivityYears();

      set((state) => ({
        questions,
        activity,
        availableActivityYears,
        activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
        isLoading: false,
      }));
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to initialize survey storage.', error);
      }

      set({
        questions: initialSurveyQuestions,
        activity: createCurrentMonthActivity(),
        availableActivityYears: [new Date().getFullYear()],
        isLoading: false,
      });
    }
  },

  refreshSurveyData: async () => {
    const activityPeriod = get().activityPeriod;
    const [questions, activity] = await Promise.all([
      surveyRepository.getQuestions(),
      surveyRepository.getActivity(activityPeriod),
    ]);
    const availableActivityYears = await surveyRepository.getAvailableActivityYears();

    set((state) => ({
      questions,
      activity,
      availableActivityYears,
      activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
    }));
  },

  setActivityPeriod: async (period) => {
    const activity = await surveyRepository.getActivity(period);
    const availableActivityYears = await surveyRepository.getAvailableActivityYears();

    set({
      activity,
      activityPeriod: period,
      availableActivityYears,
    });
  },

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
      isSubmittingSurvey: false,
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

  submitSurveySession: async () => {
    const { participant, answers } = get();

    if (!participant.gender || !participant.ageRange || Object.keys(answers).length === 0) {
      return;
    }

    set({ isSubmittingSurvey: true });

    try {
      await surveyRepository.createSurveySubmission(
        {
          gender: participant.gender,
          ageRange: participant.ageRange,
        },
        answers,
      );

      const activityPeriod = get().activityPeriod;
      const [questions, activity] = await Promise.all([
        surveyRepository.getQuestions(),
        surveyRepository.getActivity(activityPeriod),
      ]);
      const availableActivityYears = await surveyRepository.getAvailableActivityYears();

      set({
        questions,
        activity,
        availableActivityYears,
        sessionStage: 'completed',
        isSubmittingSurvey: false,
      });
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to save survey submission.', error);
      }

      set({ isSubmittingSurvey: false });
      throw error;
    }
  },

  clearAllResponses: async () => {
    await surveyRepository.clearAllResponses();

    const activityPeriod = get().activityPeriod;
    const [questions, activity] = await Promise.all([
      surveyRepository.getQuestions(),
      surveyRepository.getActivity(activityPeriod),
    ]);
    const availableActivityYears = await surveyRepository.getAvailableActivityYears();

    set((state) => ({
      questions,
      activity,
      availableActivityYears,
      answers: {},
      participant: {},
      sessionStage: 'biodata',
      activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
      isSubmittingSurvey: false,
    }));
  },

  toggleQuestionStatus: async (questionId) => {
    const currentQuestion = get().questions.find((question) => question.id === questionId);

    if (!currentQuestion) {
      return;
    }

    const questions = await surveyRepository.setQuestionStatus(
      questionId,
      currentQuestion.status === 'active' ? 'draft' : 'active',
    );

    set((state) => ({
      questions,
      activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
    }));
  },

  deleteQuestion: async (questionId) => {
    const questions = await surveyRepository.deleteQuestion(questionId);

    set((state) => {
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

  deleteAllQuestions: async () => {
    await surveyRepository.deleteAllQuestions();

    const activityPeriod = get().activityPeriod;
    const [questions, activity] = await Promise.all([
      surveyRepository.getQuestions(),
      surveyRepository.getActivity(activityPeriod),
    ]);
    const availableActivityYears = await surveyRepository.getAvailableActivityYears();

    set({
      questions,
      activity,
      availableActivityYears,
      answers: {},
      activeQuestionIndex: 0,
      sessionStage: 'biodata',
    });
  },

  moveQuestion: async (questionId, direction) => {
    const questions = sortQuestions(get().questions);
    const questionIndex = questions.findIndex((question) => question.id === questionId);

    if (questionIndex < 0) {
      return;
    }

    const targetIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1;

    if (targetIndex < 0 || targetIndex >= questions.length) {
      return;
    }

    const nextQuestions = [...questions];
    const [question] = nextQuestions.splice(questionIndex, 1);
    nextQuestions.splice(targetIndex, 0, question);

    const persistedQuestions = await surveyRepository.reorderQuestions(
      nextQuestions.map((currentQuestion) => currentQuestion.id),
    );

    set((state) => ({
      questions: persistedQuestions,
      activeQuestionIndex: clampQuestionIndex(persistedQuestions, state.activeQuestionIndex),
    }));
  },

  saveQuestion: async (questionId, values) => {
    const targetQuestionId = questionId ?? createQuestionId(get().questions);
    const fallbackOrder =
      get().questions.find((question) => question.id === targetQuestionId)?.order ??
      get().questions.length + 1;
    const questions = await surveyRepository.saveQuestion(targetQuestionId, values, fallbackOrder);

    set((state) => ({
      questions,
      activeQuestionIndex: clampQuestionIndex(questions, state.activeQuestionIndex),
    }));

    return targetQuestionId;
  },
}));
