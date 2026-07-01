import { dailySurveyActivity, initialSurveyQuestions } from '../services/surveySeed';
import { useSurveyStore } from './useSurveyStore';

describe('useSurveyStore question ordering', () => {
  beforeEach(() => {
    useSurveyStore.setState({
      activity: dailySurveyActivity,
      questions: initialSurveyQuestions,
      participant: {},
      answers: {},
      activeQuestionIndex: 0,
      sessionStage: 'biodata',
    });
  });

  test('moveQuestion keeps the reordered position instead of snapping back', () => {
    const originalIds = initialSurveyQuestions.map((question) => question.id);
    const lastQuestionId = originalIds[originalIds.length - 1];

    useSurveyStore.getState().moveQuestion(lastQuestionId, 'up');

    const reorderedQuestions = useSurveyStore.getState().questions;
    const reorderedIds = reorderedQuestions.map((question) => question.id);

    expect(reorderedIds).toEqual([
      originalIds[0],
      originalIds[1],
      originalIds[2],
      originalIds[4],
      originalIds[3],
    ]);
    expect(reorderedQuestions.map((question) => question.order)).toEqual([1, 2, 3, 4, 5]);
    expect(reorderedQuestions[3]?.updatedAt).toBe('Reordered just now');
  });
});
