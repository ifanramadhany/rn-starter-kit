import type { DashboardActivityPoint, SurveyQuestion } from '../types';

export function createCurrentMonthActivity(referenceDate = new Date()): DashboardActivityPoint[] {
  const year = referenceDate.getFullYear();
  const monthIndex = referenceDate.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const currentDay = referenceDate.getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;

    return {
      label: String(dayNumber).padStart(2, '0'),
      completions: 0,
      highlighted: dayNumber === currentDay,
    };
  });
}

export const initialSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'Q-1042',
    title: 'How satisfied are you with today’s service experience?',
    helperText: 'Single response used for quick satisfaction tracking.',
    type: 'single',
    status: 'active',
    order: 1,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1042-1', label: 'Very satisfied', responseCount: 0 },
      { id: 'Q-1042-2', label: 'Satisfied', responseCount: 0 },
      { id: 'Q-1042-3', label: 'Neutral', responseCount: 0 },
      { id: 'Q-1042-4', label: 'Dissatisfied', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1043',
    title: 'Which service channel did you use during this visit?',
    helperText: 'Supports one answer per participant.',
    type: 'single',
    status: 'active',
    order: 2,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1043-1', label: 'Front desk', responseCount: 0 },
      { id: 'Q-1043-2', label: 'Tablet kiosk', responseCount: 0 },
      { id: 'Q-1043-3', label: 'Call center', responseCount: 0 },
      { id: 'Q-1043-4', label: 'Mobile app', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1044',
    title: 'Which features should be improved first?',
    helperText: 'Multiple choice question for prioritization.',
    type: 'multiple',
    status: 'active',
    order: 3,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1044-1', label: 'Queue time visibility', responseCount: 0 },
      { id: 'Q-1044-2', label: 'Staff guidance', responseCount: 0 },
      { id: 'Q-1044-3', label: 'Survey speed', responseCount: 0 },
      { id: 'Q-1044-4', label: 'Accessibility support', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1045',
    title: 'Would you recommend this service to a friend or colleague?',
    helperText: 'Classic recommendation signal.',
    type: 'single',
    status: 'active',
    order: 4,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1045-1', label: 'Definitely', responseCount: 0 },
      { id: 'Q-1045-2', label: 'Maybe', responseCount: 0 },
      { id: 'Q-1045-3', label: 'Not likely', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1046',
    title: 'What follow-up topics would you like to receive?',
    helperText: 'Multiple response question for future outreach preferences.',
    type: 'multiple',
    status: 'active',
    order: 5,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1046-1', label: 'Service tips', responseCount: 0 },
      { id: 'Q-1046-2', label: 'Promotions', responseCount: 0 },
      { id: 'Q-1046-3', label: 'Policy updates', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1047',
    title: 'How easy was it to complete your task today?',
    helperText: 'Single response that measures process clarity.',
    type: 'single',
    status: 'active',
    order: 6,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1047-1', label: 'Very easy', responseCount: 0 },
      { id: 'Q-1047-2', label: 'Easy', responseCount: 0 },
      { id: 'Q-1047-3', label: 'Difficult', responseCount: 0 },
      { id: 'Q-1047-4', label: 'Very difficult', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1048',
    title: 'Which parts of the visit took the most time?',
    helperText: 'Multiple choice diagnostic for bottleneck tracking.',
    type: 'multiple',
    status: 'active',
    order: 7,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1048-1', label: 'Registration', responseCount: 0 },
      { id: 'Q-1048-2', label: 'Waiting area', responseCount: 0 },
      { id: 'Q-1048-3', label: 'Staff consultation', responseCount: 0 },
      { id: 'Q-1048-4', label: 'Payment or checkout', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1049',
    title: 'Did staff explain the next steps clearly?',
    helperText: 'Single response for instruction clarity.',
    type: 'single',
    status: 'active',
    order: 8,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1049-1', label: 'Yes, very clearly', responseCount: 0 },
      { id: 'Q-1049-2', label: 'Somewhat clearly', responseCount: 0 },
      { id: 'Q-1049-3', label: 'Not clearly', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1050',
    title: 'What information would have helped you most before arriving?',
    helperText: 'Multiple choice to improve pre-visit communication.',
    type: 'multiple',
    status: 'active',
    order: 9,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1050-1', label: 'Required documents', responseCount: 0 },
      { id: 'Q-1050-2', label: 'Estimated wait time', responseCount: 0 },
      { id: 'Q-1050-3', label: 'Service steps', responseCount: 0 },
      { id: 'Q-1050-4', label: 'Location guidance', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1051',
    title: 'How comfortable was the waiting area?',
    helperText: 'Single response for physical environment feedback.',
    type: 'single',
    status: 'active',
    order: 10,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1051-1', label: 'Very comfortable', responseCount: 0 },
      { id: 'Q-1051-2', label: 'Comfortable', responseCount: 0 },
      { id: 'Q-1051-3', label: 'Uncomfortable', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1052',
    title: 'Which support channels would you use again?',
    helperText: 'Multiple response question for channel preference.',
    type: 'multiple',
    status: 'active',
    order: 11,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1052-1', label: 'In-person counter', responseCount: 0 },
      { id: 'Q-1052-2', label: 'Self-service tablet', responseCount: 0 },
      { id: 'Q-1052-3', label: 'Phone support', responseCount: 0 },
      { id: 'Q-1052-4', label: 'Mobile app', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1053',
    title: 'Was your issue resolved in one visit?',
    helperText: 'Single response resolution metric.',
    type: 'single',
    status: 'active',
    order: 12,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1053-1', label: 'Yes', responseCount: 0 },
      { id: 'Q-1053-2', label: 'Partially', responseCount: 0 },
      { id: 'Q-1053-3', label: 'No', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1054',
    title: 'What motivated you to participate in this survey?',
    helperText: 'Multiple response question for participation drivers.',
    type: 'multiple',
    status: 'active',
    order: 13,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1054-1', label: 'Quick to answer', responseCount: 0 },
      { id: 'Q-1054-2', label: 'Wanted to share feedback', responseCount: 0 },
      { id: 'Q-1054-3', label: 'Staff invitation', responseCount: 0 },
      { id: 'Q-1054-4', label: 'Interested in improvements', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1055',
    title: 'How likely are you to return for a similar service?',
    helperText: 'Single response loyalty signal.',
    type: 'single',
    status: 'active',
    order: 14,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1055-1', label: 'Very likely', responseCount: 0 },
      { id: 'Q-1055-2', label: 'Likely', responseCount: 0 },
      { id: 'Q-1055-3', label: 'Unlikely', responseCount: 0 },
    ],
  },
  {
    id: 'Q-1056',
    title: 'Which improvements would make the next visit better?',
    helperText: 'Multiple response idea capture for service design.',
    type: 'multiple',
    status: 'active',
    order: 15,
    updatedAt: 'Seeded locally',
    options: [
      { id: 'Q-1056-1', label: 'Faster queue handling', responseCount: 0 },
      { id: 'Q-1056-2', label: 'Clearer signage', responseCount: 0 },
      { id: 'Q-1056-3', label: 'More staff availability', responseCount: 0 },
      { id: 'Q-1056-4', label: 'Simpler forms', responseCount: 0 },
    ],
  },
];
