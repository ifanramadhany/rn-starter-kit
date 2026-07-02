import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
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
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import MetricCard from '../components/MetricCard';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyMetrics } from '../hooks/useSurveyMetrics';
import { surveyRepository } from '../services/surveyRepository';
import { useSurveyStore } from '../store/useSurveyStore';
import type { SurveyQuestion, SurveyRespondentDetail } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import { createStyles } from './AdminDashboardScreen.styles';

type AdminDashboardScreenProps = NativeStackScreenProps<DashboardStackParamList, 'AdminDashboard'>;
type AdminDashboardScreenStyles = ReturnType<typeof createStyles>;
type ResultAccordionItemProps = {
  colors: AppColors;
  isExpanded: boolean;
  onToggle: () => void;
  question: SurveyQuestion;
  questionIndex: number;
  styles: AdminDashboardScreenStyles;
};

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
const shortMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
const monthOptions = Array.from({ length: 12 }, (_, month) => ({
  value: month,
  label: monthFormatter.format(new Date(2026, month, 1)),
  shortLabel: shortMonthFormatter.format(new Date(2026, month, 1)),
}));
const ACTIVITY_CHART_HEIGHT = 184;
const ACTIVITY_CHART_ROWS = 4;
const ACTIVITY_CHART_LABEL_SPACE = 26;

function createActivityScale(maxValue: number) {
  const stepValue = Math.max(1, Math.ceil(Math.max(maxValue, 1) / ACTIVITY_CHART_ROWS));
  const chartCeiling = stepValue * ACTIVITY_CHART_ROWS;

  return Array.from(
    { length: ACTIVITY_CHART_ROWS + 1 },
    (_, index) => chartCeiling - stepValue * index,
  );
}

function formatResponseLabel(completions: number) {
  return `${completions} ${completions === 1 ? 'response' : 'responses'}`;
}

function formatQuestionTypeLabel(type: SurveyQuestion['type']) {
  return type === 'multiple' ? 'Multiple choice' : 'Single choice';
}

function formatSelectionCountLabel(selectionCount: number, type: SurveyQuestion['type']) {
  if (type === 'multiple') {
    return `${selectionCount} ${selectionCount === 1 ? 'choice' : 'choices'} logged`;
  }

  return `${selectionCount} ${selectionCount === 1 ? 'response' : 'responses'} logged`;
}

function formatPercentLabel(value: number, total: number) {
  if (value <= 0 || total <= 0) {
    return '0%';
  }

  return `${Math.round((value / total) * 100)}%`;
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

function ResultAccordionItem({
  colors,
  isExpanded,
  onToggle,
  question,
  questionIndex,
  styles,
}: ResultAccordionItemProps) {
  const totalSelections = question.options.reduce(
    (selectionCount, option) => selectionCount + option.responseCount,
    0,
  );
  const highestResponseCount = question.options.reduce(
    (highest, option) => Math.max(highest, option.responseCount),
    0,
  );
  const leadingOption =
    question.options.find((option) => option.responseCount === highestResponseCount) ?? null;
  const [expandedContentHeight, setExpandedContentHeight] = useState(0);
  const [expandAnimation] = useState(() => new Animated.Value(isExpanded ? 1 : 0));

  useEffect(() => {
    Animated.timing(expandAnimation, {
      toValue: isExpanded ? 1 : 0,
      duration: 260,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, [expandAnimation, isExpanded]);

  const animatedContainerHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(expandedContentHeight, 1)],
  });
  const animatedContentOpacity = expandAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0.28, 1],
  });
  const animatedContentTranslateY = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });
  const animatedChevronRotation = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.resultCard, isExpanded ? styles.resultCardExpanded : null]}>
      <Pressable onPress={onToggle} style={styles.resultCardButton}>
        <View style={styles.resultHeaderMain}>
          <View style={styles.resultQuestionBadge}>
            <Text style={styles.resultQuestionBadgeText}>
              Q{String(questionIndex + 1).padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.resultQuestionContent}>
            <View style={styles.resultHeaderTopRow}>
              <View style={styles.resultMetaRow}>
                <View style={styles.resultMetaPill}>
                  <Text style={styles.resultMetaPillText}>
                    {formatQuestionTypeLabel(question.type)}
                  </Text>
                </View>
                <View style={[styles.resultMetaPill, styles.resultMetaPillMuted]}>
                  <Text style={[styles.resultMetaPillText, styles.resultMetaPillTextMuted]}>
                    {formatSelectionCountLabel(totalSelections, question.type)}
                  </Text>
                </View>
              </View>

              <View style={[styles.resultToggle, isExpanded ? styles.resultToggleExpanded : null]}>
                <Text
                  style={[
                    styles.resultToggleText,
                    isExpanded ? styles.resultToggleTextExpanded : null,
                  ]}
                >
                  Detail
                </Text>
                <Animated.View
                  style={[
                    styles.resultToggleIconWrap,
                    {
                      transform: [{ rotate: animatedChevronRotation }],
                    },
                  ]}
                >
                  <ChevronDown
                    color={isExpanded ? colors.primary : colors.textSubtle}
                    size={16}
                    strokeWidth={2.6}
                  />
                </Animated.View>
              </View>
            </View>
            <Text numberOfLines={isExpanded ? undefined : 2} style={styles.tableQuestion}>
              {question.title}
            </Text>
            <View style={styles.resultSummaryRowCompact}>
              <View style={styles.resultSummaryPillCompact}>
                <Text style={styles.resultSummaryPillLabel}>Top option</Text>
                <Text numberOfLines={1} style={styles.resultSummaryPillValue}>
                  {leadingOption && highestResponseCount > 0
                    ? leadingOption.label
                    : 'No responses yet'}
                </Text>
              </View>
              <View
                style={[styles.resultSummaryPillCompact, styles.resultSummaryPillCompactAccent]}
              >
                <Text style={[styles.resultSummaryPillLabel, styles.resultSummaryPillLabelAccent]}>
                  Lead share
                </Text>
                <Text style={[styles.resultSummaryPillValue, styles.resultSummaryPillValueAccent]}>
                  {leadingOption && highestResponseCount > 0
                    ? `${highestResponseCount} • ${formatPercentLabel(
                        highestResponseCount,
                        totalSelections,
                      )}`
                    : '0 • 0%'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      <Animated.View
        pointerEvents={isExpanded ? 'auto' : 'none'}
        style={[
          styles.resultExpandedWrap,
          {
            height: animatedContainerHeight,
          },
        ]}
      >
        <Animated.View
          onLayout={(event) => {
            const nextHeight = Math.ceil(event.nativeEvent.layout.height);

            if (nextHeight !== expandedContentHeight) {
              setExpandedContentHeight(nextHeight);
            }
          }}
          style={[
            styles.resultExpandedSection,
            {
              opacity: animatedContentOpacity,
              transform: [{ translateY: animatedContentTranslateY }],
            },
          ]}
        >
          <Text style={styles.resultHelperText}>{question.helperText}</Text>
          <Text style={styles.tableMeta}>{question.id}</Text>
          <View style={styles.resultOptionsList}>
            {question.options.map((option) => {
              const isTopChoice =
                highestResponseCount > 0 && option.responseCount === highestResponseCount;
              const barWidth =
                highestResponseCount > 0
                  ? (`${Math.max(
                      (option.responseCount / highestResponseCount) * 100,
                      10,
                    )}%` as const)
                  : ('0%' as const);

              return (
                <View
                  key={option.id}
                  style={[styles.resultOptionCard, isTopChoice ? styles.resultOptionCardTop : null]}
                >
                  <View style={styles.resultOptionHeader}>
                    <Text
                      style={[
                        styles.resultOptionLabel,
                        isTopChoice ? styles.resultOptionLabelTop : null,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <View style={styles.resultOptionCountWrap}>
                      <Text
                        style={[
                          styles.resultOptionCount,
                          isTopChoice ? styles.resultOptionCountTop : null,
                        ]}
                      >
                        {option.responseCount}
                      </Text>
                      <Text
                        style={[
                          styles.resultOptionPercent,
                          isTopChoice ? styles.resultOptionPercentTop : null,
                        ]}
                      >
                        {formatPercentLabel(option.responseCount, totalSelections)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultOptionBarRow}>
                    <View style={styles.resultOptionBarTrack}>
                      <View
                        style={[
                          styles.resultOptionBarFill,
                          isTopChoice ? styles.resultOptionBarFillTop : null,
                          {
                            width: barWidth,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
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
  const [expandedResultQuestionId, setExpandedResultQuestionId] = useState<string | null>(null);
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
  const activityScaleValues = useMemo(
    () => createActivityScale(maxActivityValue),
    [maxActivityValue],
  );
  const chartCeiling = activityScaleValues[0] ?? 1;
  const totalPeriodResponses = activity.reduce(
    (responseCount, day) => responseCount + day.completions,
    0,
  );
  const activityDisplayPoints = activity.map((point) => ({
    ...point,
    barHeight:
      point.completions > 0
        ? Math.max((point.completions / chartCeiling) * ACTIVITY_CHART_HEIGHT, 14)
        : 8,
  }));
  const selectedMonthLabel = monthOptions[activityPeriod.month]?.label ?? monthOptions[0].label;
  const selectedYearLabel = String(activityPeriod.year);
  const selectedDayPoint =
    selectedActivityDay !== null
      ? activityDisplayPoints.find((point) => point.label === selectedActivityDay) ?? null
      : null;
  const yearOptions =
    availableActivityYears.length > 0 ? availableActivityYears : [activityPeriod.year];
  const sortedYearOptions = [...yearOptions].sort((leftYear, rightYear) => rightYear - leftYear);
  const activeDaysCount = activity.filter((point) => point.completions > 0).length;
  const peakActivityPoint = activity.reduce<(typeof activity)[number] | null>(
    (peakPoint, point) => (point.completions > (peakPoint?.completions ?? 0) ? point : peakPoint),
    null,
  );
  const chartPlotWidth = activityDisplayPoints.length * (isTablet ? 35 : 30);
  const chartGridOffsets = activityScaleValues.map(
    (_value, index) => (index * ACTIVITY_CHART_HEIGHT) / ACTIVITY_CHART_ROWS,
  );

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
          <View style={[styles.filterArea, openFilter ? styles.filterAreaOpen : null]}>
            <View style={styles.filterRow}>
              <Pressable
                disabled={isUpdatingFilter}
                onPress={() =>
                  setOpenFilter((currentFilter) => (currentFilter === 'month' ? null : 'month'))
                }
                style={[
                  styles.filterSelectButton,
                  openFilter === 'month' ? styles.filterSelectButtonActive : null,
                  isUpdatingFilter ? styles.filterSelectButtonDisabled : null,
                ]}
              >
                <Text style={styles.filterSelectLabel}>Month</Text>
                <View style={styles.filterSelectValueRow}>
                  <Text style={styles.filterSelectValue}>{selectedMonthLabel}</Text>
                  <ChevronDown color={colors.textSubtle} size={16} strokeWidth={2.3} />
                </View>
              </Pressable>

              <Pressable
                disabled={isUpdatingFilter}
                onPress={() =>
                  setOpenFilter((currentFilter) => (currentFilter === 'year' ? null : 'year'))
                }
                style={[
                  styles.filterSelectButton,
                  openFilter === 'year' ? styles.filterSelectButtonActive : null,
                  isUpdatingFilter ? styles.filterSelectButtonDisabled : null,
                ]}
              >
                <Text style={styles.filterSelectLabel}>Year</Text>
                <View style={styles.filterSelectValueRow}>
                  <Text style={styles.filterSelectValue}>{selectedYearLabel}</Text>
                  <ChevronDown color={colors.textSubtle} size={16} strokeWidth={2.3} />
                </View>
              </Pressable>
            </View>

            {openFilter ? (
              <View style={styles.filterDropdownPanel}>
                <View style={styles.filterDropdownHeader}>
                  <Text style={styles.filterDropdownTitle}>
                    {openFilter === 'month' ? 'Select month' : 'Select year'}
                  </Text>
                  <Pressable onPress={() => setOpenFilter(null)} style={styles.filterDropdownClose}>
                    <Text style={styles.filterDropdownCloseText}>Close</Text>
                  </Pressable>
                </View>
                <View style={styles.filterOptionGrid}>
                  {(openFilter === 'month' ? monthOptions : sortedYearOptions).map((option) => {
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
                        style={[
                          styles.filterOption,
                          isSelected ? styles.filterOptionActive : null,
                          isUpdatingFilter ? styles.filterOptionDisabled : null,
                        ]}
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
          </View>
        </View>

        <View style={styles.activityInsightRow}>
          <View style={styles.activityInsightCard}>
            <Text style={styles.activityInsightLabel}>Month total</Text>
            <Text style={styles.activityInsightValue}>{totalPeriodResponses}</Text>
            <Text style={styles.activityInsightMeta}>All responses recorded in this period.</Text>
          </View>
          <View style={styles.activityInsightCard}>
            <Text style={styles.activityInsightLabel}>Active days</Text>
            <Text style={styles.activityInsightValue}>{activeDaysCount}</Text>
            <Text style={styles.activityInsightMeta}>
              Days that received at least one survey response.
            </Text>
          </View>
          <View style={styles.activityInsightCard}>
            <Text style={styles.activityInsightLabel}>Peak day</Text>
            <Text style={styles.activityInsightValue}>
              {peakActivityPoint ? peakActivityPoint.label : '--'}
            </Text>
            <Text style={styles.activityInsightMeta}>
              {peakActivityPoint
                ? `${peakActivityPoint.completions} responses on the busiest day.`
                : 'No survey activity has been recorded yet.'}
            </Text>
          </View>
        </View>

        <View style={styles.chartBoard}>
          <View style={styles.chartScaleColumn}>
            {activityScaleValues.map((scaleValue) => (
              <Text key={`scale-${scaleValue}`} style={styles.chartScaleLabel}>
                {scaleValue}
              </Text>
            ))}
          </View>

          <ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            style={styles.chartScroll}
            contentContainerStyle={styles.chartContent}
          >
            <View style={[styles.chartFrame, { width: chartPlotWidth }]}>
              {chartGridOffsets.map((offset, index) => (
                <View
                  key={`grid-${offset}-${index}`}
                  style={[
                    styles.chartGridLine,
                    {
                      bottom: ACTIVITY_CHART_LABEL_SPACE + offset,
                    },
                  ]}
                />
              ))}

              <View style={styles.chart}>
                {activityDisplayPoints.map((point) => {
                  const isSelected = selectedActivityDay === point.label;

                  return (
                    <View
                      key={point.label}
                      style={[
                        styles.chartColumnWrap,
                        isSelected ? styles.chartColumnWrapSelected : null,
                      ]}
                    >
                      <Text
                        style={[styles.chartValue, isSelected ? styles.chartValueSelected : null]}
                      >
                        {point.completions}
                      </Text>
                      <View
                        style={[styles.chartTrack, isSelected ? styles.chartTrackSelected : null]}
                      >
                        <View
                          style={[
                            styles.chartColumn,
                            point.completions === 0 ? styles.chartColumnEmpty : null,
                            point.highlighted ? styles.chartColumnHighlighted : null,
                            isSelected ? styles.chartColumnSelected : null,
                            {
                              height: point.barHeight,
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[styles.chartLabel, isSelected ? styles.chartLabelSelected : null]}
                      >
                        {point.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.activitySummaryHeader}>
          <Text style={styles.cardSubtitle}>Tap a day card to see who responded on that date.</Text>
        </View>
        <View style={styles.activitySummaryGrid}>
          {activityDisplayPoints.map((point) => (
            <Pressable
              key={`summary-${point.label}`}
              onPress={async () => {
                await openDayDetail(point.label);
              }}
              style={[
                styles.activitySummaryCard,
                selectedActivityDay === point.label ? styles.activitySummaryCardSelected : null,
              ]}
            >
              <Text
                style={[
                  styles.activitySummaryDay,
                  selectedActivityDay === point.label ? styles.activitySummaryDaySelected : null,
                ]}
              >
                {point.label} {monthOptions[activityPeriod.month]?.shortLabel}
              </Text>
              <Text
                style={[
                  styles.activitySummaryValue,
                  selectedActivityDay === point.label ? styles.activitySummaryValueSelected : null,
                ]}
              >
                {formatResponseLabel(point.completions)}
              </Text>
            </Pressable>
          ))}
        </View>
      </SurveySurfaceCard>

      <SurveySurfaceCard style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <View style={styles.tableHeaderContent}>
            <Text style={styles.cardTitle}>Detailed Results</Text>
            <Text style={styles.cardSubtitle}>
              Keep this list compact. Tap a question only when you want to inspect the option
              breakdown.
            </Text>
          </View>
          <View style={styles.resultsSummaryRow}>
            <View style={styles.resultsSummaryPill}>
              <Text style={styles.resultsSummaryLabel}>Live questions</Text>
              <Text style={styles.resultsSummaryValue}>{displayedQuestions.length}</Text>
            </View>
            <View style={[styles.resultsSummaryPill, styles.resultsSummaryPillAccent]}>
              <Text style={styles.resultsSummaryLabel}>Survey sessions</Text>
              <Text style={styles.resultsSummaryValue}>{metrics.responseCount}</Text>
            </View>
          </View>
        </View>
        <View style={styles.resultsList}>
          {displayedQuestions.map((question, questionIndex) => (
            <ResultAccordionItem
              key={question.id}
              colors={colors}
              isExpanded={expandedResultQuestionId === question.id}
              onToggle={() =>
                setExpandedResultQuestionId((currentQuestionId) =>
                  currentQuestionId === question.id ? null : question.id,
                )
              }
              question={question}
              questionIndex={questionIndex}
              styles={styles}
            />
          ))}
        </View>
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
