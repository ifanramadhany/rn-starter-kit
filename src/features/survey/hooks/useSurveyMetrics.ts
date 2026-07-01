import { useMemo } from 'react';

import { useSurveyStore } from '../store/useSurveyStore';

export function useSurveyMetrics() {
  const questions = useSurveyStore((state) => state.questions);

  return useMemo(() => {
    const activeQuestions = questions
      .filter((question) => question.status === 'active')
      .sort((left, right) => left.order - right.order);
    const draftQuestions = questions.filter((question) => question.status === 'draft');
    const totalResponses = activeQuestions.reduce(
      (responseCount, question) =>
        responseCount +
        question.options.reduce((optionCount, option) => optionCount + option.responseCount, 0),
      0,
    );

    return {
      totalQuestions: questions.length,
      activeQuestions: activeQuestions.length,
      draftQuestions: draftQuestions.length,
      responseCount: totalResponses,
      completionRate:
        questions.length === 0 ? 0 : Math.round((activeQuestions.length / questions.length) * 100),
      activeQuestionList: activeQuestions,
    };
  }, [questions]);
}
