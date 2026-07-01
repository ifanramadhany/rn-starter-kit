import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
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
import { useSurveyStore } from '../store/useSurveyStore';
import { createStyles } from './AdminDashboardScreen.styles';

type AdminDashboardScreenProps = NativeStackScreenProps<DashboardStackParamList, 'AdminDashboard'>;

export default function AdminDashboardScreen({ navigation }: AdminDashboardScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const metrics = useSurveyMetrics();
  const activity = useSurveyStore((state) => state.activity);
  const parentNavigation = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
  const displayedQuestions = metrics.activeQuestionList.slice(0, 3);
  const maxActivityValue = activity.reduce(
    (largestValue, day) => Math.max(largestValue, day.completions),
    1,
  );

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
          label="Peak Day"
          value={`${metrics.peakDay.completions}`}
          tone="secondary"
        />
        <MetricCard
          icon={<TrendingUp color={colors.tertiary} size={18} strokeWidth={2.3} />}
          label="Active Mix"
          value={`${metrics.completionRate}%`}
          tone="tertiary"
        />
      </View>

      <SurveySurfaceCard style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>Daily Survey Activity</Text>
            <Text style={styles.cardSubtitle}>
              Survey completions tracked over the last 30 days.
            </Text>
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>December</Text>
              <ChevronDown color={colors.textSubtle} size={14} strokeWidth={2.4} />
            </View>
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>2024</Text>
              <ChevronDown color={colors.textSubtle} size={14} strokeWidth={2.4} />
            </View>
          </View>
        </View>
        <ScrollView
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          style={styles.chartScroll}
          contentContainerStyle={styles.chartContent}
        >
          <View style={styles.chartFrame}>
            <View style={styles.chart}>
              {activity.map((point) => (
                <View key={point.label} style={styles.chartColumnWrap}>
                  <View
                    style={[
                      styles.chartColumn,
                      point.highlighted ? styles.chartColumnHighlighted : null,
                      {
                        height: Math.max((point.completions / maxActivityValue) * 180, 16),
                      },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{point.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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
    </SurveyScaffold>
  );
}
