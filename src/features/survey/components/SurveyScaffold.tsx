import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type SurveyScaffoldProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentWidth?: 'narrow' | 'wide';
  headerAccessory?: ReactNode;
  scroll?: boolean;
  subtitle?: string;
  title: string;
};

export default function SurveyScaffold({
  children,
  contentContainerStyle,
  contentWidth = 'wide',
  headerAccessory,
  scroll = true,
  subtitle,
  title,
}: SurveyScaffoldProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(
    () => createStyles(colors, isTablet, contentWidth),
    [colors, contentWidth, isTablet],
  );

  const content = (
    <View style={[styles.content, contentContainerStyle]}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>DS</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>DS Hub</Text>
            <Text style={styles.brandSubtitle}>Dynamic Survey Hub</Text>
          </View>
        </View>
      </View>

      <View style={styles.pageHeader}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.pageTitle}>{title}</Text>
          {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
        </View>
        {headerAccessory ? <View style={styles.headerAccessory}>{headerAccessory}</View> : null}
      </View>

      {children}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={styles.backgroundOrbPrimary} />
        <View style={styles.backgroundOrbSecondary} />
      </View>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.scrollContent}>{content}</View>
      )}
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors, isTablet: boolean, contentWidth: 'narrow' | 'wide') {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundLayer: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
    },
    backgroundOrbPrimary: {
      position: 'absolute',
      top: -90,
      right: -60,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: colors.secondaryContainer,
      opacity: 0.28,
    },
    backgroundOrbSecondary: {
      position: 'absolute',
      bottom: -120,
      left: -80,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: colors.primarySoft,
      opacity: 0.55,
    },
    scrollContent: {
      paddingBottom: 128,
    },
    content: {
      width: '100%',
      maxWidth: contentWidth === 'narrow' ? (isTablet ? 860 : 720) : isTablet ? 1180 : 860,
      alignSelf: 'center',
      paddingHorizontal: isTablet ? 32 : 18,
      paddingTop: 8,
      gap: 24,
    },
    topBar: {
      minHeight: 72,
      justifyContent: 'center',
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    brandMark: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandMarkText: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    brandTitle: {
      color: colors.primary,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '800',
    },
    brandSubtitle: {
      color: colors.textSubtle,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
    },
    pageHeader: {
      flexDirection: isTablet ? 'row' : 'column',
      alignItems: isTablet ? 'flex-end' : 'flex-start',
      justifyContent: 'space-between',
      gap: 18,
    },
    headerTextWrap: {
      flex: 1,
      gap: 8,
    },
    pageTitle: {
      color: colors.text,
      fontSize: isTablet ? 34 : 28,
      lineHeight: isTablet ? 40 : 34,
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    pageSubtitle: {
      color: colors.textMuted,
      fontSize: 16,
      lineHeight: 24,
      maxWidth: 720,
    },
    headerAccessory: {
      width: isTablet ? 'auto' : '100%',
    },
  });
}
