import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowUpDown, ChartColumn, ListChecks, Plus, Search } from 'lucide-react-native';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { QuestionsStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import MetricCard from '../components/MetricCard';
import ConfirmationModal from '../components/ConfirmationModal';
import QuestionListItem from '../components/QuestionListItem';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyMetrics } from '../hooks/useSurveyMetrics';
import { useSurveyStore } from '../store/useSurveyStore';
import type { SurveyQuestion } from '../types';
import { createStyles } from './QuestionManagementScreen.styles';

type QuestionManagementScreenProps = NativeStackScreenProps<
  QuestionsStackParamList,
  'QuestionManagement'
>;

export default function QuestionManagementScreen({ navigation }: QuestionManagementScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const questions = useSurveyStore((state) => state.questions);
  const deleteQuestion = useSurveyStore((state) => state.deleteQuestion);
  const deleteAllQuestions = useSurveyStore((state) => state.deleteAllQuestions);
  const toggleQuestionStatus = useSurveyStore((state) => state.toggleQuestionStatus);
  const metrics = useSurveyMetrics();
  const [searchValue, setSearchValue] = useState('');
  const [isDeleteAllModalVisible, setIsDeleteAllModalVisible] = useState(false);
  const [isDeletingAllQuestions, setIsDeletingAllQuestions] = useState(false);
  const [questionPendingDeletion, setQuestionPendingDeletion] = useState<SurveyQuestion | null>(
    null,
  );
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    return [...questions]
      .sort((left, right) => left.order - right.order)
      .filter((question) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          question.id.toLowerCase().includes(normalizedQuery) ||
          question.title.toLowerCase().includes(normalizedQuery)
        );
      });
  }, [questions, searchValue]);

  const headerAccessory = (
    <View style={styles.actionRow}>
      <Pressable
        onPress={() => navigation.navigate('QuestionReorder')}
        style={styles.secondaryAction}
      >
        <ArrowUpDown color={colors.text} size={18} strokeWidth={2.3} />
        <Text style={styles.secondaryActionText}>Reorder</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('CreateQuestion')} style={styles.primaryAction}>
        <Plus color={colors.onPrimary} size={18} strokeWidth={2.3} />
        <Text style={styles.primaryActionText}>Add Question</Text>
      </Pressable>
    </View>
  );

  async function handleDeleteAllQuestions() {
    setIsDeletingAllQuestions(true);

    try {
      await deleteAllQuestions();
      setIsDeleteAllModalVisible(false);
    } finally {
      setIsDeletingAllQuestions(false);
    }
  }

  async function handleDeleteQuestion() {
    if (!questionPendingDeletion) {
      return;
    }

    setIsDeletingQuestion(true);

    try {
      await deleteQuestion(questionPendingDeletion.id);
      setQuestionPendingDeletion(null);
    } finally {
      setIsDeletingQuestion(false);
    }
  }

  return (
    <SurveyScaffold
      title="Question Management"
      subtitle="Configure the live survey set, keep drafts in view, and stage tablet-ready question flows."
      headerAccessory={headerAccessory}
    >
      <View style={styles.metricGrid}>
        <MetricCard
          icon={<ListChecks color={colors.primary} size={18} strokeWidth={2.3} />}
          label="Total Questions"
          value={String(metrics.totalQuestions)}
        />
        <MetricCard
          icon={<ChartColumn color={colors.secondary} size={18} strokeWidth={2.3} />}
          label="Active Questions"
          value={String(metrics.activeQuestions)}
          tone="secondary"
        />
        <MetricCard
          icon={<ArrowUpDown color={colors.tertiary} size={18} strokeWidth={2.3} />}
          label="Draft Questions"
          value={String(metrics.draftQuestions)}
          tone="tertiary"
        />
      </View>

      <SurveySurfaceCard style={styles.searchCard}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Search color={colors.textSubtle} size={18} strokeWidth={2.2} />
            <TextInput
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Search questions by title or ID"
              placeholderTextColor={colors.textSubtle}
              style={styles.searchInput}
            />
          </View>
        </View>
        <View style={styles.searchMetaRow}>
          <Text style={styles.searchMetaText}>
            {filteredQuestions.length} questions shown · ordered for tablet review
          </Text>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Live + Draft Mix</Text>
          </View>
        </View>
        <View style={styles.dangerRow}>
          <Pressable
            disabled={isDeletingAllQuestions || isDeletingQuestion}
            onPress={() => setIsDeleteAllModalVisible(true)}
            style={[
              styles.dangerAction,
              isDeletingAllQuestions || isDeletingQuestion ? styles.dangerActionDisabled : null,
            ]}
          >
            <Text style={styles.dangerActionText}>Remove All Questions</Text>
          </Pressable>
        </View>
      </SurveySurfaceCard>

      <View style={styles.list}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionListItem
              key={question.id}
              question={question}
              onDelete={() => setQuestionPendingDeletion(question)}
              onEdit={() =>
                navigation.navigate('CreateQuestion', {
                  questionId: question.id,
                })
              }
              onToggleStatus={async () => {
                await toggleQuestionStatus(question.id);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching questions</Text>
            <Text style={styles.emptyText}>
              Try a different search term or create a new question for this survey set.
            </Text>
          </View>
        )}
      </View>

      <ConfirmationModal
        visible={isDeleteAllModalVisible}
        title="Remove All Questions"
        description="This will permanently delete every survey question on this device, including all option sets. Existing response history will remain, but there will be no survey questions left to run until you add new ones."
        confirmLabel="Remove Questions"
        isSubmitting={isDeletingAllQuestions}
        onCancel={() => setIsDeleteAllModalVisible(false)}
        onConfirm={handleDeleteAllQuestions}
      />
      <ConfirmationModal
        visible={questionPendingDeletion !== null}
        title="Delete Question"
        description={
          questionPendingDeletion
            ? `This will permanently delete "${questionPendingDeletion.title}" from this device, including its answer options. Existing response history will remain, but this question will no longer appear in the survey flow.`
            : ''
        }
        confirmLabel="Delete Question"
        isSubmitting={isDeletingQuestion}
        onCancel={() => setQuestionPendingDeletion(null)}
        onConfirm={handleDeleteQuestion}
      />
    </SurveyScaffold>
  );
}
