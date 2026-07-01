import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react-native';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { QuestionsStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyStore } from '../store/useSurveyStore';
import { createStyles } from './QuestionReorderScreen.styles';

type QuestionReorderScreenProps = NativeStackScreenProps<
  QuestionsStackParamList,
  'QuestionReorder'
>;

export default function QuestionReorderScreen({ navigation }: QuestionReorderScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const questions = useSurveyStore((state) => state.questions);
  const moveQuestion = useSurveyStore((state) => state.moveQuestion);
  const orderedQuestions = useMemo(
    () => [...questions].sort((left, right) => left.order - right.order),
    [questions],
  );

  return (
    <SurveyScaffold
      title="Question Order"
      subtitle="Review the final tablet sequence before surveyors start the next run."
      contentWidth="narrow"
    >
      <SurveySurfaceCard style={styles.introCard}>
        <Text style={styles.introTitle}>Reorder the sequence</Text>
        <Text style={styles.introText}>
          Drag-style handles are mirrored here with step controls so you can change order without
          adding extra native dependencies.
        </Text>
      </SurveySurfaceCard>

      <View style={styles.list}>
        {orderedQuestions.map((question, index) => {
          const isFirst = index === 0;
          const isLast = index === orderedQuestions.length - 1;

          return (
            <SurveySurfaceCard key={question.id} style={styles.item}>
              <View style={styles.itemLead}>
                <GripVertical color={colors.textSubtle} size={20} strokeWidth={2.2} />
                <Text style={styles.itemOrder}>#{question.order}</Text>
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{question.title}</Text>
                <Text style={styles.itemMeta}>
                  {question.id} ·{' '}
                  {question.type === 'multiple' ? 'Multiple Choice' : 'Single Choice'} ·{' '}
                  {question.status === 'active' ? 'Active' : 'Draft'}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <Pressable
                  disabled={isFirst}
                  onPress={async () => {
                    await moveQuestion(question.id, 'up');
                  }}
                  style={[styles.moveButton, isFirst ? styles.moveButtonDisabled : null]}
                >
                  <ArrowUp
                    color={isFirst ? colors.textSubtle : colors.primary}
                    size={18}
                    strokeWidth={2.3}
                  />
                </Pressable>
                <Pressable
                  disabled={isLast}
                  onPress={async () => {
                    await moveQuestion(question.id, 'down');
                  }}
                  style={[styles.moveButton, isLast ? styles.moveButtonDisabled : null]}
                >
                  <ArrowDown
                    color={isLast ? colors.textSubtle : colors.primary}
                    size={18}
                    strokeWidth={2.3}
                  />
                </Pressable>
              </View>
            </SurveySurfaceCard>
          );
        })}
      </View>

      <Pressable onPress={() => navigation.goBack()} style={styles.doneButton}>
        <Text style={styles.doneButtonText}>Done Reordering</Text>
      </Pressable>
    </SurveyScaffold>
  );
}
