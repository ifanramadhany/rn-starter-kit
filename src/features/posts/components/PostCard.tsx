import React, { useMemo } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { AppColors } from '../../../shared/theme/colors';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { Post } from '../types';

type PostCardProps = {
  post: Post;
  isDeleting?: boolean;
  isUpdating?: boolean;
  onDelete: (id: number) => void;
  onUpdate: (post: Post) => void;
};

export default function PostCard({
  post,
  isDeleting,
  isUpdating,
  onDelete,
  onUpdate,
}: PostCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body} numberOfLines={3}>
        {post.body}
      </Text>
      <View style={styles.actions}>
        <Button
          title={isUpdating ? 'Updating...' : 'Update'}
          onPress={() => onUpdate(post)}
          disabled={isUpdating}
        />
        <Button
          title={isDeleting ? 'Deleting...' : 'Delete'}
          onPress={() => onDelete(post.id)}
          disabled={isDeleting}
        />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 8,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
    body: {
      color: colors.textMuted,
      lineHeight: 20,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });
}
