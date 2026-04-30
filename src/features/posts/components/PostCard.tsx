import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
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

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  title: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    color: '#475569',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
