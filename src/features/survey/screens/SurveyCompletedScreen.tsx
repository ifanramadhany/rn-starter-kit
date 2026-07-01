import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CheckCircle2, RotateCcw } from 'lucide-react-native';

import type { MainTabParamList, SurveyFlowStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyStore } from '../store/useSurveyStore';
import { createStyles } from './SurveyCompletedScreen.styles';

type SurveyCompletedScreenProps = NativeStackScreenProps<
  SurveyFlowStackParamList,
  'SurveyCompleted'
>;

export default function SurveyCompletedScreen({ navigation }: SurveyCompletedScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const participant = useSurveyStore((state) => state.participant);
  const answers = useSurveyStore((state) => state.answers);
  const restartSurvey = useSurveyStore((state) => state.restartSurvey);
  const answeredCount = Object.keys(answers).length;
  const parentNavigation = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();

  return (
    <SurveyScaffold
      title="Survey Completed"
      subtitle="The tablet can now return to the surveyor, or be reset for the next participant."
      contentWidth="narrow"
    >
      <SurveySurfaceCard style={styles.successCard}>
        <View style={styles.successIconWrap}>
          <CheckCircle2 color={colors.onSecondaryContainer} size={64} strokeWidth={2.5} />
        </View>
        <Text style={styles.title}>Thank You</Text>
        <Text style={styles.subtitle}>
          Responses have been captured for this session. Continue to the dashboard or reset the
          tablet for the next participant.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipText}>Answered {answeredCount} live questions</Text>
          </View>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipText}>
              Segment {participant.gender ?? 'not set'} · {participant.ageRange ?? 'not set'}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => {
              restartSurvey();
              navigation.navigate('ParticipantBiodata');
            }}
            style={styles.secondaryAction}
          >
            <View style={styles.actionInnerRow}>
              <RotateCcw color={colors.text} size={18} strokeWidth={2.3} />
              <Text style={styles.secondaryActionText}>Start Another Survey</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              parentNavigation?.navigate('DashboardTab');
            }}
            style={styles.primaryAction}
          >
            <Text style={styles.primaryActionText}>Back to Dashboard</Text>
          </Pressable>
        </View>
      </SurveySurfaceCard>
    </SurveyScaffold>
  );
}
