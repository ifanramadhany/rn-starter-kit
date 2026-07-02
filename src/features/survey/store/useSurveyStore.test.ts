import { createCurrentMonthActivity, initialSurveyQuestions } from '../services/surveySeed';
import { useSurveyStore } from './useSurveyStore';

describe('useSurveyStore question ordering', () => {
  const { resetSurveyRepositoryMock } = jest.requireMock('../services/surveyRepository') as {
    resetSurveyRepositoryMock: () => void;
  };

  beforeEach(() => {
    resetSurveyRepositoryMock();
    useSurveyStore.setState({
      activity: createCurrentMonthActivity(),
      activityPeriod: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      availableActivityYears: [new Date().getFullYear()],
      questions: initialSurveyQuestions,
      participant: {},
      answers: {},
      activeQuestionIndex: 0,
      sessionStage: 'biodata',
      isLoading: false,
      isSubmittingSurvey: false,
    });
  });

  test('initialize loads the seeded questions', async () => {
    useSurveyStore.setState({
      activity: [],
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
    });

    await useSurveyStore.getState().initialize();

    const questions = useSurveyStore.getState().questions;

    expect(questions).toHaveLength(initialSurveyQuestions.length);
    expect(questions.every((question) => question.status === 'active')).toBe(true);
  });

  test('moveQuestion keeps the reordered position instead of snapping back', async () => {
    const originalIds = initialSurveyQuestions.map((question) => question.id);
    const lastQuestionId = originalIds[originalIds.length - 1];

    await useSurveyStore.getState().moveQuestion(lastQuestionId, 'up');

    const reorderedQuestions = useSurveyStore.getState().questions;
    const reorderedIds = reorderedQuestions.map((question) => question.id);

    const expectedIds = [...originalIds];
    const [movedQuestionId] = expectedIds.splice(expectedIds.length - 1, 1);
    expectedIds.splice(expectedIds.length - 1, 0, movedQuestionId);

    expect(reorderedIds).toEqual(expectedIds);
    expect(reorderedQuestions.map((question) => question.order)).toEqual(
      Array.from({ length: originalIds.length }, (_, index) => index + 1),
    );
    expect(reorderedQuestions[originalIds.length - 2]?.updatedAt).toBe('Diperbarui hari ini');
  });
});
