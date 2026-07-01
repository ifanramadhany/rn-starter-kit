export type QuestionType = 'single' | 'multiple';
export type QuestionStatus = 'active' | 'draft';

export type SurveyOption = {
  id: string;
  label: string;
  responseCount: number;
};

export type SurveyQuestion = {
  id: string;
  title: string;
  helperText: string;
  type: QuestionType;
  status: QuestionStatus;
  options: SurveyOption[];
  order: number;
  updatedAt: string;
};

export type ParticipantGender = 'male' | 'female' | 'other';
export type ParticipantAgeRange = '18-35' | '36-55' | '56+';

export type ParticipantBiodata = {
  gender?: ParticipantGender;
  ageRange?: ParticipantAgeRange;
};

export type DashboardActivityPoint = {
  label: string;
  completions: number;
  highlighted?: boolean;
};

export type QuestionFormValues = {
  title: string;
  helperText: string;
  type: QuestionType;
  status: QuestionStatus;
  options: string[];
};
