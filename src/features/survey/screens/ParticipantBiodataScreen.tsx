import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowRight, Info, ShieldCheck } from 'lucide-react-native';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { SurveyFlowStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyStore } from '../store/useSurveyStore';
import type { ParticipantAgeRange, ParticipantGender } from '../types';
import { createStyles } from './ParticipantBiodataScreen.styles';

type ParticipantBiodataScreenProps = NativeStackScreenProps<
  SurveyFlowStackParamList,
  'ParticipantBiodata'
>;

const genderOptions: Array<{ label: string; subtitle: string; value: ParticipantGender }> = [
  { label: 'Male', subtitle: 'Used only for segment reporting', value: 'male' },
  { label: 'Female', subtitle: 'Captured anonymously for analysis', value: 'female' },
  { label: 'Other / Prefer not to say', subtitle: 'Optional and non-identifying', value: 'other' },
];

const ageOptions: Array<{ label: string; subtitle: string; value: ParticipantAgeRange }> = [
  { label: '18 - 35', subtitle: 'Early-career and young adult segment', value: '18-35' },
  { label: '36 - 55', subtitle: 'Mid-career and family segment', value: '36-55' },
  { label: '56+', subtitle: 'Senior participant segment', value: '56+' },
];

const SESSION_SETUP_SECONDS = 60;
const QUESTION_RESPONSE_SECONDS = 15;

function formatEstimatedSessionTime(activeQuestionCount: number) {
  const totalSeconds = SESSION_SETUP_SECONDS + activeQuestionCount * QUESTION_RESPONSE_SECONDS;
  const estimatedMinutes = Math.max(1, Math.ceil(totalSeconds / 60));

  return `~${estimatedMinutes} minute${estimatedMinutes === 1 ? '' : 's'}`;
}

export default function ParticipantBiodataScreen({ navigation }: ParticipantBiodataScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const activeQuestionCount = useSurveyStore(
    (state) => state.questions.filter((question) => question.status === 'active').length,
  );
  const participant = useSurveyStore((state) => state.participant);
  const setGender = useSurveyStore((state) => state.setGender);
  const setAgeRange = useSurveyStore((state) => state.setAgeRange);
  const startSurvey = useSurveyStore((state) => state.startSurvey);
  const canStart = Boolean(participant.gender && participant.ageRange);
  const estimatedSessionTime = useMemo(
    () => formatEstimatedSessionTime(activeQuestionCount),
    [activeQuestionCount],
  );

  return (
    <SurveyScaffold
      title="Participant Biodata"
      subtitle="Capture only the minimum segmentation fields needed before handing the tablet to the participant."
      contentWidth="narrow"
    >
      <SurveySurfaceCard style={styles.guidelineCard}>
        <View style={styles.guidelineHeading}>
          <Info color={colors.secondary} size={18} strokeWidth={2.3} />
          <Text style={styles.guidelineTitle}>Surveyor Guideline</Text>
        </View>
        <Text style={styles.guidelineText}>
          Keep the setup anonymous, confirm consent verbally, and proceed once both fields are
          selected.
        </Text>
      </SurveySurfaceCard>

      <View style={styles.selectionGrid}>
        <View style={styles.selectionColumn}>
          <Text style={styles.sectionTitle}>01. Gender Selection</Text>
          {genderOptions.map((option) => {
            const isSelected = participant.gender === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => setGender(option.value)}
                style={[styles.optionCard, isSelected ? styles.optionCardSelected : null]}
              >
                <Text style={[styles.optionTitle, isSelected ? styles.optionTitleSelected : null]}>
                  {option.label}
                </Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.selectionColumn}>
          <Text style={styles.sectionTitle}>02. Age Range</Text>
          {ageOptions.map((option) => {
            const isSelected = participant.ageRange === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => setAgeRange(option.value)}
                style={[styles.optionCard, isSelected ? styles.optionCardSelected : null]}
              >
                <Text style={[styles.optionTitle, isSelected ? styles.optionTitleSelected : null]}>
                  {option.label}
                </Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SurveySurfaceCard style={styles.footerCard}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Estimated session time</Text>
          <Text style={styles.footerValue}>{estimatedSessionTime}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Privacy mode</Text>
          <View style={styles.privacyRow}>
            <ShieldCheck color={colors.secondary} size={18} strokeWidth={2.2} />
            <Text style={styles.footerValue}>Anonymous capture</Text>
          </View>
        </View>
        <Pressable
          disabled={!canStart}
          onPress={() => {
            if (!canStart) {
              return;
            }

            startSurvey();
            navigation.navigate('SurveyQuestion');
          }}
          style={[styles.startButton, !canStart ? styles.startButtonDisabled : null]}
        >
          <Text style={styles.startButtonText}>Start Survey</Text>
          <ArrowRight color={colors.onPrimary} size={20} strokeWidth={2.3} />
        </Pressable>
      </SurveySurfaceCard>
    </SurveyScaffold>
  );
}
