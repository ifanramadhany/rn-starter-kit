import { createSeededJune2026Submissions, initialSurveyQuestions } from './surveySeed';

describe('survey response seed data', () => {
  test('creates more than 300 seeded June 2026 submissions', () => {
    const submissions = createSeededJune2026Submissions();

    expect(submissions).toHaveLength(379);
    expect(submissions.every((submission) => submission.completedAt.startsWith('2026-06-'))).toBe(
      true,
    );
  });

  test('includes an answer set for every default question', () => {
    const submissions = createSeededJune2026Submissions();
    const questionIds = initialSurveyQuestions.map((question) => question.id);

    expect(
      submissions.every((submission) =>
        questionIds.every((questionId) => (submission.answers[questionId] ?? []).length > 0),
      ),
    ).toBe(true);
  });
});
