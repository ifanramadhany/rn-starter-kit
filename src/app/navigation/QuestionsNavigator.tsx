import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  CreateQuestionScreen,
  QuestionManagementScreen,
  QuestionReorderScreen,
} from '../../features/survey';
import type { QuestionsStackParamList } from '../../shared/navigation/routes';

const Stack = createNativeStackNavigator<QuestionsStackParamList>();

export default function QuestionsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none', headerShown: false }}>
      <Stack.Screen name="QuestionManagement" component={QuestionManagementScreen} />
      <Stack.Screen name="CreateQuestion" component={CreateQuestionScreen} />
      <Stack.Screen name="QuestionReorder" component={QuestionReorderScreen} />
    </Stack.Navigator>
  );
}
