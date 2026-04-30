import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ApiError } from '../../../shared/api/errors';
import PostCard from '../components/PostCard';
import { useCreatePostMutation } from '../hooks/useCreatePostMutation';
import { useDeletePostMutation } from '../hooks/useDeletePostMutation';
import { usePostListQuery } from '../hooks/usePostListQuery';
import { useUpdatePostMutation } from '../hooks/useUpdatePostMutation';
import type { Post } from '../types';

type MutationType = 'create' | 'update' | 'delete';

export default function PostsScreen() {
  const postsQuery = usePostListQuery();
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();
  const [lastMutationType, setLastMutationType] = useState<MutationType | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateBody, setUpdateBody] = useState('');

  const handleCreate = () => {
    const randomId = Math.floor(Math.random() * 1000);

    setLastMutationType('create');
    createPostMutation.mutate({
      userId: 1,
      title: `Random post ${randomId}`,
      body: `Created from the app with random value ${randomId}.`,
    });
  };

  const handleOpenUpdateModal = (post: Post) => {
    setSelectedPost(post);
    setUpdateTitle(post.title);
    setUpdateBody(post.body);
  };

  const handleUpdate = () => {
    if (!selectedPost) {
      return;
    }

    setLastMutationType('update');
    updatePostMutation.mutate(
      {
        id: selectedPost.id,
        userId: selectedPost.userId,
        title: updateTitle,
        body: updateBody,
      },
      {
        onSuccess: () => {
          setSelectedPost(null);
        },
      },
    );
  };

  const handleOpenDeleteModal = (post: Post) => {
    setPostToDelete(post);
  };

  const handleDelete = () => {
    if (!postToDelete) {
      return;
    }

    setLastMutationType('delete');
    deletePostMutation.mutate(postToDelete.id, {
      onSuccess: () => {
        setPostToDelete(null);
      },
    });
  };

  const mutationMessage = getMutationMessage({
    type: lastMutationType,
    createMessage: createPostMutation.data?.message,
    updateMessage: updatePostMutation.data?.message,
    deleteMessage: deletePostMutation.data?.message,
  });

  if (postsQuery.isLoading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading posts...</Text>
      </View>
    );
  }

  if (postsQuery.error) {
    const message =
      postsQuery.error instanceof ApiError
        ? postsQuery.error.response.message
        : 'Failed to load posts.';

    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{message}</Text>
        <Button title="Try Again" onPress={() => postsQuery.refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Posts API Example</Text>
          <Text style={styles.subtitle}>GET, POST, PUT, DELETE</Text>
        </View>
        <Button
          title={createPostMutation.isPending ? 'Creating...' : 'Create'}
          onPress={handleCreate}
          disabled={createPostMutation.isPending}
        />
      </View>

      {mutationMessage ? (
        <Text style={[styles.message, getMessageStyle(lastMutationType)]}>{mutationMessage}</Text>
      ) : null}

      <FlatList
        data={postsQuery.data?.result ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            isDeleting={deletePostMutation.isPending && deletePostMutation.variables === item.id}
            isUpdating={
              updatePostMutation.isPending && updatePostMutation.variables?.id === item.id
            }
            onDelete={() => handleOpenDeleteModal(item)}
            onUpdate={handleOpenUpdateModal}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={selectedPost !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Post</Text>
            <TextInput
              value={updateTitle}
              onChangeText={setUpdateTitle}
              style={styles.input}
              placeholder="Post title"
            />
            <TextInput
              value={updateBody}
              onChangeText={setUpdateBody}
              style={[styles.input, styles.bodyInput]}
              placeholder="Post body"
              multiline
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setSelectedPost(null)} />
              <Button
                title={updatePostMutation.isPending ? 'Updating...' : 'Update'}
                onPress={handleUpdate}
                disabled={updatePostMutation.isPending}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={postToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPostToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Post</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this post?</Text>
            <Text style={styles.deleteTitle}>{postToDelete?.title}</Text>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setPostToDelete(null)} />
              <Button
                title={deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
                color="#dc2626"
                onPress={handleDelete}
                disabled={deletePostMutation.isPending}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getMutationMessage({
  type,
  createMessage,
  updateMessage,
  deleteMessage,
}: {
  type: MutationType | null;
  createMessage?: string;
  updateMessage?: string;
  deleteMessage?: string;
}) {
  if (type === 'create') {
    return createMessage;
  }

  if (type === 'update') {
    return updateMessage;
  }

  if (type === 'delete') {
    return deleteMessage;
  }

  return undefined;
}

function getMessageStyle(type: MutationType | null) {
  if (type === 'update') {
    return styles.updateMessage;
  }

  if (type === 'delete') {
    return styles.deleteMessage;
  }

  return styles.createMessage;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusText: {
    marginTop: 12,
    color: '#475569',
  },
  errorText: {
    marginBottom: 12,
    color: '#b91c1c',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    color: '#64748b',
  },
  message: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createMessage: {
    color: '#166534',
    backgroundColor: '#dcfce7',
  },
  updateMessage: {
    color: '#854d0e',
    backgroundColor: '#fef3c7',
  },
  deleteMessage: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  modalText: {
    color: '#475569',
  },
  deleteTitle: {
    color: '#0f172a',
    fontWeight: '700',
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  bodyInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
