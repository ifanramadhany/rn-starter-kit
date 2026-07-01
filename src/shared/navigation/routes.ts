import type { NavigatorScreenParams } from '@react-navigation/native';

export const questionStackRouteNames = [
  'QuestionManagement',
  'CreateQuestion',
  'QuestionReorder',
] as const;

export const surveyFlowRouteNames = [
  'ParticipantBiodata',
  'SurveyQuestion',
  'SurveyCompleted',
] as const;

export const dashboardStackRouteNames = ['AdminDashboard'] as const;

export const mainTabRouteNames = ['QuestionsTab', 'StartSurveyTab', 'DashboardTab'] as const;

export const mainStackRouteNames = ['MainTabs'] as const;

export const mainRouteNames = [
  ...mainStackRouteNames,
  ...mainTabRouteNames,
  ...questionStackRouteNames,
  ...surveyFlowRouteNames,
  ...dashboardStackRouteNames,
] as const;

export type QuestionsStackParamList = {
  QuestionManagement: undefined;
  CreateQuestion: { questionId?: string } | undefined;
  QuestionReorder: undefined;
};

export type SurveyFlowStackParamList = {
  ParticipantBiodata: undefined;
  SurveyQuestion: undefined;
  SurveyCompleted: undefined;
};

export type DashboardStackParamList = {
  AdminDashboard: undefined;
};

export type MainTabParamList = {
  QuestionsTab: NavigatorScreenParams<QuestionsStackParamList> | undefined;
  StartSurveyTab: NavigatorScreenParams<SurveyFlowStackParamList> | undefined;
  DashboardTab: NavigatorScreenParams<DashboardStackParamList> | undefined;
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
