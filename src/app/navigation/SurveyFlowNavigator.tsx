import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ParticipantBiodataScreen,
  SurveyCompletedScreen,
  SurveyQuestionScreen,
} from '../../features/survey';
import type { SurveyFlowStackParamList } from '../../shared/navigation/routes';

const Stack = createNativeStackNavigator<SurveyFlowStackParamList>();

export default function SurveyFlowNavigator() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }}>
      <Stack.Screen name="ParticipantBiodata" component={ParticipantBiodataScreen} />
      <Stack.Screen name="SurveyQuestion" component={SurveyQuestionScreen} />
      <Stack.Screen name="SurveyCompleted" component={SurveyCompletedScreen} />
    </Stack.Navigator>
  );
}
