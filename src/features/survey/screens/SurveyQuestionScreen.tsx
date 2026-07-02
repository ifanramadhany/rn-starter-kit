import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

import type { SurveyFlowStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import ConfirmationModal from '../components/ConfirmationModal';
import SurveyOptionCard from '../components/SurveyOptionCard';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyStore } from '../store/useSurveyStore';
import { createStyles } from './SurveyQuestionScreen.styles';

type SurveyQuestionScreenProps = NativeStackScreenProps<SurveyFlowStackParamList, 'SurveyQuestion'>;

export default function SurveyQuestionScreen({ navigation }: SurveyQuestionScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const questions = useSurveyStore((state) => state.questions);
  const answers = useSurveyStore((state) => state.answers);
  const activeQuestionIndex = useSurveyStore((state) => state.activeQuestionIndex);
  const nextQuestion = useSurveyStore((state) => state.nextQuestion);
  const previousQuestion = useSurveyStore((state) => state.previousQuestion);
  const setSingleAnswer = useSurveyStore((state) => state.setSingleAnswer);
  const toggleMultiAnswer = useSurveyStore((state) => state.toggleMultiAnswer);
  const isSubmittingSurvey = useSurveyStore((state) => state.isSubmittingSurvey);
  const submitSurveySession = useSurveyStore((state) => state.submitSurveySession);
  const restartSurvey = useSurveyStore((state) => state.restartSurvey);
  const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);

  const activeQuestions = useMemo(
    () =>
      [...questions]
        .sort((left, right) => left.order - right.order)
        .filter((question) => question.status === 'active'),
    [questions],
  );
  const currentQuestion = activeQuestions[activeQuestionIndex];
  const currentAnswers = currentQuestion ? answers[currentQuestion.id] ?? [] : [];
  const canContinue = currentAnswers.length > 0 && !isSubmittingSurvey;
  const progress = activeQuestions.length
    ? Math.round(((activeQuestionIndex + 1) / activeQuestions.length) * 100)
    : 0;

  if (!currentQuestion) {
    return (
      <SurveyScaffold
        title="Survey Question"
        subtitle="This branch only advances when at least one question is marked active."
        contentWidth="narrow"
      >
        <SurveySurfaceCard style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No active questions</Text>
          <Text style={styles.emptyText}>
            Switch a draft to active in Question Management, then return here to run the survey.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('ParticipantBiodata')}
            style={styles.primaryAction}
          >
            <Text style={styles.primaryActionText}>Back to Biodata</Text>
          </Pressable>
        </SurveySurfaceCard>
      </SurveyScaffold>
    );
  }

  const isLastQuestion = activeQuestionIndex === activeQuestions.length - 1;

  return (
    <>
      <SurveyScaffold
        title="Service Evaluation"
        subtitle="Designed for a focused, one-question-at-a-time tablet handoff."
        contentWidth="narrow"
      >
        <View style={styles.progressRow}>
          <View>
            <Text style={styles.progressLabel}>
              Step {activeQuestionIndex + 1} of {activeQuestions.length}
            </Text>
          </View>
          <Text style={styles.progressValue}>{progress}% Complete</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <SurveySurfaceCard style={styles.questionCard}>
          <View style={styles.questionIntro}>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
            <Text style={styles.questionHelper}>{currentQuestion.helperText}</Text>
          </View>

          <View style={styles.optionList}>
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswers.includes(option.id);

              return (
                <SurveyOptionCard
                  key={option.id}
                  isMultipleChoice={currentQuestion.type === 'multiple'}
                  isSelected={isSelected}
                  label={option.label}
                  onPress={() => {
                    if (currentQuestion.type === 'multiple') {
                      toggleMultiAnswer(currentQuestion.id, option.id);
                      return;
                    }

                    setSingleAnswer(currentQuestion.id, option.id);
                  }}
                />
              );
            })}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={() => {
                if (activeQuestionIndex === 0) {
                  setIsRestartModalVisible(true);
                  return;
                }

                previousQuestion();
              }}
              style={styles.secondaryAction}
            >
              <View style={styles.secondaryActionRow}>
                <ArrowLeft color={colors.secondary} size={18} strokeWidth={2.3} />
                <Text style={styles.secondaryActionText}>Back</Text>
              </View>
            </Pressable>

            <Pressable
              disabled={!canContinue}
              onPress={async () => {
                if (!canContinue) {
                  return;
                }

                if (isLastQuestion) {
                  await submitSurveySession();
                  navigation.navigate('SurveyCompleted');
                  return;
                }

                nextQuestion();
              }}
              style={[styles.primaryAction, !canContinue ? styles.primaryActionDisabled : null]}
            >
              <Text style={styles.primaryActionText}>
                {isLastQuestion
                  ? isSubmittingSurvey
                    ? 'Saving...'
                    : 'Finish Survey'
                  : 'Next Question'}
              </Text>
              <ArrowRight color={colors.onPrimary} size={18} strokeWidth={2.3} />
            </Pressable>
          </View>
        </SurveySurfaceCard>
      </SurveyScaffold>

      <ConfirmationModal
        visible={isRestartModalVisible}
        title="Restart Survey?"
        description="Going back now will restart this survey and clear the selected gender, age range, and current answers for this participant."
        confirmLabel="Restart Survey"
        onCancel={() => setIsRestartModalVisible(false)}
        onConfirm={() => {
          restartSurvey();
          setIsRestartModalVisible(false);
          navigation.navigate('ParticipantBiodata');
        }}
      />
    </>
  );
}
