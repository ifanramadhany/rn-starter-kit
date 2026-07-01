import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  ChartColumn,
  ChevronDown,
  CirclePlay,
  ListChecks,
  TrendingUp,
  Users,
} from 'lucide-react-native';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { DashboardStackParamList, MainTabParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import MetricCard from '../components/MetricCard';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyMetrics } from '../hooks/useSurveyMetrics';
import { surveyRepository } from '../services/surveyRepository';
import { useSurveyStore } from '../store/useSurveyStore';
import type { SurveyRespondentDetail } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import { createStyles } from './AdminDashboardScreen.styles';

type AdminDashboardScreenProps = NativeStackScreenProps<DashboardStackParamList, 'AdminDashboard'>;

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
const shortMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
const monthOptions = Array.from({ length: 12 }, (_, month) => ({
  value: month,
  label: monthFormatter.format(new Date(2026, month, 1)),
  shortLabel: shortMonthFormatter.format(new Date(2026, month, 1)),
}));

function formatResponseLabel(completions: number) {
  return `${completions} ${completions === 1 ? 'response' : 'responses'}`;
}

function formatGenderLabel(gender: SurveyRespondentDetail['gender']) {
  if (gender === 'male') {
    return 'Male';
  }

  if (gender === 'female') {
    return 'Female';
  }

  if (gender === 'other') {
    return 'Other';
  }

  return 'Unknown';
}

function formatAgeRangeLabel(ageRange: SurveyRespondentDetail['ageRange']) {
  if (ageRange === '18-35' || ageRange === '36-55' || ageRange === '56+') {
    return ageRange;
  }

  return 'Unknown';
}

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const metrics = useSurveyMetrics();
  const activity = useSurveyStore((state) => state.activity);
  const activityPeriod = useSurveyStore((state) => state.activityPeriod);
  const availableActivityYears = useSurveyStore((state) => state.availableActivityYears);
  const setActivityPeriod = useSurveyStore((state) => state.setActivityPeriod);
  const clearAllResponses = useSurveyStore((state) => state.clearAllResponses);
  const parentNavigation = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
  const displayedQuestions = metrics.activeQuestionList;
  const [openFilter, setOpenFilter] = useState<'month' | 'year' | null>(null);
  const [isUpdatingFilter, setIsUpdatingFilter] = useState(false);
  const [isClearResponsesModalVisible, setIsClearResponsesModalVisible] = useState(false);
  const [isClearingResponses, setIsClearingResponses] = useState(false);
  const [selectedActivityDay, setSelectedActivityDay] = useState<string | null>(null);
  const [selectedDayRespondents, setSelectedDayRespondents] = useState<SurveyRespondentDetail[]>(
    [],
  );
  const [isDayDetailLoading, setIsDayDetailLoading] = useState(false);
  const [dayDetailError, setDayDetailError] = useState<string | null>(null);
  const maxActivityValue = activity.reduce(
    (largestValue, day) => Math.max(largestValue, day.completions),
    1,
  );
  const totalPeriodResponses = activity.reduce(
    (responseCount, day) => responseCount + day.completions,
    0,
  );
  const activityDisplayPoints = activity.map((point) => ({
    ...point,
    barStyle: {
      height:
        point.completions > 0 ? Math.max((point.completions / maxActivityValue) * 152, 20) : 10,
    },
  }));
  const selectedMonthLabel = monthOptions[activityPeriod.month]?.label ?? monthOptions[0].label;
  const selectedYearLabel = String(activityPeriod.year);
  const selectedDayPoint =
    selectedActivityDay !== null
      ? activityDisplayPoints.find((point) => point.label === selectedActivityDay) ?? null
      : null;
  const yearOptions =
    availableActivityYears.length > 0 ? availableActivityYears : [activityPeriod.year];

  function closeDayDetailModal() {
    setSelectedActivityDay(null);
    setSelectedDayRespondents([]);
    setDayDetailError(null);
    setIsDayDetailLoading(false);
  }

  async function updateMonth(month: number) {
    if (month === activityPeriod.month) {
      setOpenFilter(null);
      return;
    }

    closeDayDetailModal();
    setIsUpdatingFilter(true);

    try {
      await setActivityPeriod({
        ...activityPeriod,
        month,
      });
      setOpenFilter(null);
    } finally {
      setIsUpdatingFilter(false);
    }
  }

  async function updateYear(year: number) {
    if (year === activityPeriod.year) {
      setOpenFilter(null);
      return;
    }

    closeDayDetailModal();
    setIsUpdatingFilter(true);

    try {
      await setActivityPeriod({
        ...activityPeriod,
        year,
      });
      setOpenFilter(null);
    } finally {
      setIsUpdatingFilter(false);
    }
  }

  async function openDayDetail(dayLabel: string) {
    setSelectedActivityDay(dayLabel);
    setSelectedDayRespondents([]);
    setDayDetailError(null);
    setIsDayDetailLoading(true);

    try {
      const respondents = await surveyRepository.getActivityDayRespondents(
        activityPeriod,
        dayLabel,
      );

      setSelectedDayRespondents(respondents);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to load day respondent details.', error);
      }

      setDayDetailError('Unable to load respondent details for this date.');
    } finally {
      setIsDayDetailLoading(false);
    }
  }

  async function handleClearResponses() {
    setIsClearingResponses(true);

    try {
      await clearAllResponses();
      closeDayDetailModal();
      setIsClearResponsesModalVisible(false);
    } finally {
      setIsClearingResponses(false);
    }
  }

  const headerAccessory = (
    <View style={styles.actionRow}>
      <Pressable
        onPress={() =>
          parentNavigation?.navigate('QuestionsTab', {
            screen: 'CreateQuestion',
          })
        }
        style={styles.secondaryAction}
      >
        <ListChecks color={colors.text} size={18} strokeWidth={2.3} />
        <Text style={styles.secondaryActionText}>Build Question</Text>
      </Pressable>
      <Pressable
        onPress={() => parentNavigation?.navigate('StartSurveyTab')}
        style={styles.primaryAction}
      >
        <CirclePlay color={colors.onPrimary} size={18} strokeWidth={2.3} />
        <Text style={styles.primaryActionText}>Run Survey</Text>
      </Pressable>
    </View>
  );

  return (
    <SurveyScaffold
      title="Admin Dashboard"
      subtitle="Monitor completion momentum and review how each live question is performing."
      headerAccessory={headerAccessory}
    >
      <View style={styles.metricGrid}>
        <MetricCard
          icon={<ChartColumn color={colors.primary} size={18} strokeWidth={2.3} />}
          label="Responses Logged"
          value={String(metrics.responseCount)}
        />
        <MetricCard
          icon={<Users color={colors.secondary} size={18} strokeWidth={2.3} />}
          label="Responded This Month"
          value={String(totalPeriodResponses)}
          tone="secondary"
        />
        <MetricCard
          icon={<TrendingUp color={colors.tertiary} size={18} strokeWidth={2.3} />}
          label="Active Mix"
          value={`${metrics.completionRate}%`}
          tone="tertiary"
        />
      </View>

      <View style={styles.dangerActionRow}>
        <Pressable
          disabled={isClearingResponses}
          onPress={() => setIsClearResponsesModalVisible(true)}
          style={[
            styles.dangerOutlineAction,
            isClearingResponses ? styles.dangerActionDisabled : null,
          ]}
        >
          <Text style={styles.dangerOutlineActionText}>Clear All Responses</Text>
        </Pressable>
      </View>

      <SurveySurfaceCard style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Daily Survey Activity</Text>
            <Text style={styles.cardSubtitle}>
              {isUpdatingFilter
                ? 'Loading survey activity for the selected period.'
                : `${formatResponseLabel(
                    totalPeriodResponses,
                  )} tracked for ${selectedMonthLabel} ${selectedYearLabel}.`}
            </Text>
          </View>
          <View style={styles.filterRow}>
            <Pressable
              disabled={isUpdatingFilter}
              onPress={() =>
                setOpenFilter((currentFilter) => (currentFilter === 'month' ? null : 'month'))
              }
              style={[
                styles.filterChip,
                openFilter === 'month' ? styles.filterChipActive : null,
                isUpdatingFilter ? styles.filterChipDisabled : null,
              ]}
            >
              <Text style={styles.filterChipText}>{selectedMonthLabel}</Text>
              <ChevronDown color={colors.textSubtle} size={14} strokeWidth={2.4} />
            </Pressable>
            <Pressable
              disabled={isUpdatingFilter}
              onPress={() =>
                setOpenFilter((currentFilter) => (currentFilter === 'year' ? null : 'year'))
              }
              style={[
                styles.filterChip,
                openFilter === 'year' ? styles.filterChipActive : null,
                isUpdatingFilter ? styles.filterChipDisabled : null,
              ]}
            >
              <Text style={styles.filterChipText}>{selectedYearLabel}</Text>
              <ChevronDown color={colors.textSubtle} size={14} strokeWidth={2.4} />
            </Pressable>
          </View>
        </View>
        {openFilter ? (
          <View style={styles.filterPanel}>
            <Text style={styles.filterPanelTitle}>
              {openFilter === 'month' ? 'Select Month' : 'Select Year'}
            </Text>
            <View style={styles.filterOptionGrid}>
              {(openFilter === 'month' ? monthOptions : yearOptions).map((option) => {
                const optionValue = typeof option === 'number' ? option : option.value;
                const optionLabel = typeof option === 'number' ? String(option) : option.label;
                const isSelected =
                  openFilter === 'month'
                    ? optionValue === activityPeriod.month
                    : optionValue === activityPeriod.year;

                return (
                  <Pressable
                    key={optionValue}
                    disabled={isUpdatingFilter}
                    onPress={async () => {
                      if (openFilter === 'month') {
                        await updateMonth(optionValue);
                        return;
                      }

                      await updateYear(optionValue);
                    }}
                    style={[styles.filterOption, isSelected ? styles.filterOptionActive : null]}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        isSelected ? styles.filterOptionTextActive : null,
                      ]}
                    >
                      {optionLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          style={styles.chartScroll}
          contentContainerStyle={styles.chartContent}
        >
          <View style={styles.chartFrame}>
            <View style={styles.chart}>
              {activityDisplayPoints.map((point) => (
                <View key={point.label} style={styles.chartColumnWrap}>
                  <Text style={styles.chartValue}>{point.completions}</Text>
                  <View
                    style={[
                      styles.chartColumn,
                      point.completions === 0 ? styles.chartColumnEmpty : null,
                      point.highlighted ? styles.chartColumnHighlighted : null,
                      point.barStyle,
                    ]}
                  />
                  <Text style={styles.chartLabel}>{point.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.activitySummaryGrid}>
          {activityDisplayPoints.map((point) => (
            <Pressable
              key={`summary-${point.label}`}
              onPress={async () => {
                await openDayDetail(point.label);
              }}
              style={styles.activitySummaryCard}
            >
              <Text style={styles.activitySummaryDay}>
                {point.label} {monthOptions[activityPeriod.month]?.shortLabel}
              </Text>
              <Text style={styles.activitySummaryValue}>
                {formatResponseLabel(point.completions)}
              </Text>
            </Pressable>
          ))}
        </View>
      </SurveySurfaceCard>

      <SurveySurfaceCard style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <View>
            <Text style={styles.cardTitle}>Detailed Results</Text>
            <Text style={styles.cardSubtitle}>Aggregate responses per question.</Text>
          </View>
        </View>
        <View style={styles.tableColumns}>
          <View style={styles.tableQuestionColumn}>
            <Text style={styles.tableColumnLabel}>Question Text</Text>
          </View>
          <View style={styles.tableAnswerColumn}>
            <Text style={styles.tableColumnLabel}>Answer Options & Choice Count</Text>
          </View>
        </View>

        {displayedQuestions.map((question) => {
          const highestResponseCount = question.options.reduce(
            (highest, option) => Math.max(highest, option.responseCount),
            0,
          );

          return (
            <View key={question.id} style={styles.tableRow}>
              <View style={styles.tableQuestionColumn}>
                <Text style={styles.tableQuestion}>{question.title}</Text>
                <Text style={styles.tableMeta}>
                  {question.id} ·{' '}
                  {question.type === 'multiple' ? 'Multiple Choice' : 'Single Choice'}
                </Text>
              </View>
              <View style={styles.tableAnswerColumn}>
                <View style={styles.chipRow}>
                  {question.options.map((option) => {
                    const isTopChoice = option.responseCount === highestResponseCount;

                    return (
                      <View
                        key={option.id}
                        style={[styles.chip, isTopChoice ? styles.chipStrong : null]}
                      >
                        <Text style={[styles.chipText, isTopChoice ? styles.chipStrongText : null]}>
                          {option.label}: {option.responseCount} customers
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.tableFooter}>
          <Pressable
            onPress={() =>
              parentNavigation?.navigate('QuestionsTab', {
                screen: 'QuestionManagement',
              })
            }
            style={styles.tableFooterButton}
          >
            <Text style={styles.tableFooterText}>View All Questions</Text>
            <TrendingUp color={colors.primary} size={14} strokeWidth={2.3} />
          </Pressable>
        </View>
      </SurveySurfaceCard>

      <Modal
        animationType="fade"
        transparent
        visible={selectedDayPoint !== null}
        onRequestClose={closeDayDetailModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable onPress={closeDayDetailModal} style={styles.modalBackdrop} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeading}>
                <Text style={styles.modalTitle}>
                  {selectedDayPoint
                    ? `${selectedDayPoint.label} ${
                        monthOptions[activityPeriod.month]?.shortLabel
                      } ${selectedYearLabel}`
                    : 'Daily Response Detail'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedDayPoint
                    ? `${formatResponseLabel(selectedDayPoint.completions)} submitted on this day.`
                    : 'Respondent details'}
                </Text>
              </View>
              <Pressable onPress={closeDayDetailModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </Pressable>
            </View>

            {isDayDetailLoading ? (
              <View style={styles.modalState}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.modalStateText}>Loading respondent details...</Text>
              </View>
            ) : null}

            {!isDayDetailLoading && dayDetailError ? (
              <View style={styles.modalState}>
                <Text style={styles.modalStateText}>{dayDetailError}</Text>
              </View>
            ) : null}

            {!isDayDetailLoading && !dayDetailError && selectedDayRespondents.length === 0 ? (
              <View style={styles.modalState}>
                <Text style={styles.modalStateText}>No respondents were recorded on this day.</Text>
              </View>
            ) : null}

            {!isDayDetailLoading && !dayDetailError && selectedDayRespondents.length > 0 ? (
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={styles.modalList}
                contentContainerStyle={styles.modalListContent}
              >
                {selectedDayRespondents.map((respondent, index) => (
                  <View key={respondent.id} style={styles.respondentRow}>
                    <View style={styles.respondentIndexWrap}>
                      <Text style={styles.respondentIndex}>{index + 1}</Text>
                    </View>
                    <View style={styles.respondentContent}>
                      <Text style={styles.respondentPrimary}>
                        {formatGenderLabel(respondent.gender)}
                      </Text>
                      <Text style={styles.respondentSecondary}>
                        Age range: {formatAgeRangeLabel(respondent.ageRange)}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={isClearResponsesModalVisible}
        title="Clear All Responses"
        description="This will permanently remove every saved survey response, dashboard activity entry, and respondent record from this device. Questions will stay in place."
        confirmLabel="Clear Responses"
        isSubmitting={isClearingResponses}
        onCancel={() => setIsClearResponsesModalVisible(false)}
        onConfirm={handleClearResponses}
      />
    </SurveyScaffold>
  );
}
