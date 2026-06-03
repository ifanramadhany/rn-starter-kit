import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { Card } from '../../../shared/ui';

type ContentCardProps = {
  title: string;
  body: string;
};

export default function ContentCard({ title, body }: ContentCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Card>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
    body: {
      marginTop: 8,
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
    },
  });
}
