import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GripVertical } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DraggableFlatList, {
  type DraggableFlatListProps,
  ScaleDecorator,
  ShadowDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { QuestionsStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useSurveyStore } from '../store/useSurveyStore';
import type { SurveyQuestion } from '../types';
import { createStyles } from './QuestionReorderScreen.styles';

type QuestionReorderScreenProps = NativeStackScreenProps<
  QuestionsStackParamList,
  'QuestionReorder'
>;

type DragAnimationValues = Parameters<
  NonNullable<DraggableFlatListProps<SurveyQuestion>['onAnimValInit']>
>[0];

type DragListFrame = {
  x: number;
  y: number;
  width: number;
};

function formatQuestionMeta(question: SurveyQuestion) {
  return `${question.id} · ${
    question.type === 'multiple' ? 'Multiple Choice' : 'Single Choice'
  } · ${question.status === 'active' ? 'Active' : 'Draft'}`;
}

function DragOverlay({
  animValues,
  frame,
  question,
  styles,
  colors,
}: {
  animValues: DragAnimationValues;
  frame: DragListFrame;
  question: SurveyQuestion;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: animValues.isDraggingCell.value ? 1 : 0,
      width: frame.width,
      transform: [
        { translateX: frame.x },
        { translateY: frame.y + animValues.hoverOffset.value - animValues.scrollOffset.value },
        {
          scale: withSpring(animValues.isDraggingCell.value ? 1.12 : 1, {
            damping: 18,
            mass: 0.18,
            stiffness: 240,
            overshootClamping: false,
          }),
        },
      ],
    }),
    [animValues, frame.width, frame.x, frame.y],
  );

  return (
    <Animated.View pointerEvents="none" style={[styles.dragOverlayCardWrap, overlayStyle]}>
      <SurveySurfaceCard style={styles.dragOverlayCard}>
        <View style={styles.itemLead}>
          <View style={styles.dragBadge}>
            <GripVertical color={colors.textSubtle} size={20} strokeWidth={2.2} />
          </View>
          <Text style={styles.itemOrder}>#{question.order}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{question.title}</Text>
          <Text style={styles.itemMeta}>{formatQuestionMeta(question)}</Text>
        </View>
      </SurveySurfaceCard>
    </Animated.View>
  );
}

export default function QuestionReorderScreen({ navigation }: QuestionReorderScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const questions = useSurveyStore((state) => state.questions);
  const reorderQuestions = useSurveyStore((state) => state.reorderQuestions);
  const orderedQuestions = useMemo(
    () => [...questions].sort((left, right) => left.order - right.order),
    [questions],
  );
  const orderedQuestionsRef = useRef(orderedQuestions);
  const [draftQuestions, setDraftQuestions] = useState(orderedQuestions);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<SurveyQuestion | null>(null);
  const [dragAnimValues, setDragAnimValues] = useState<DragAnimationValues | null>(null);
  const [dragListFrame, setDragListFrame] = useState<DragListFrame>({
    x: 0,
    y: 0,
    width: 0,
  });

  useEffect(() => {
    orderedQuestionsRef.current = orderedQuestions;

    if (isSavingOrder) {
      return;
    }

    setDraftQuestions(orderedQuestions);
  }, [isSavingOrder, orderedQuestions]);

  const handleDragEnd = useCallback(
    async ({ data }: { data: SurveyQuestion[] }) => {
      setDraftQuestions(data);
      setDraggedQuestion(null);
      setIsDragging(false);
      setIsSavingOrder(true);

      try {
        await reorderQuestions(data.map((question) => question.id));
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to reorder questions.', error);
        }

        setDraftQuestions(orderedQuestionsRef.current);
      } finally {
        setIsSavingOrder(false);
      }
    },
    [reorderQuestions],
  );

  const handleListLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width } = event.nativeEvent.layout;
    setDragListFrame({ x, y, width });
  }, []);

  const renderItemSeparator = useCallback(() => <View style={styles.itemSeparator} />, [styles]);

  const renderPlaceholder = useCallback(
    ({ item, index }: { item: SurveyQuestion; index: number }) => (
      <SurveySurfaceCard style={styles.placeholderCard}>
        <View style={styles.itemLead}>
          <View style={styles.dragBadge}>
            <GripVertical color={colors.textSubtle} size={20} strokeWidth={2.2} />
          </View>
          <Text style={styles.itemOrder}>#{index + 1}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemMeta}>{formatQuestionMeta(item)}</Text>
        </View>
      </SurveySurfaceCard>
    ),
    [colors.textSubtle, styles],
  );

  const renderItem = useCallback(
    ({ item, drag, getIndex, isActive }: RenderItemParams<SurveyQuestion>) => {
      const displayOrder = (getIndex() ?? 0) + 1;
      const shouldHideNativeCell =
        isActive && dragAnimValues !== null && draggedQuestion?.id === item.id;

      return (
        <ScaleDecorator activeScale={1.08}>
          <ShadowDecorator color={colors.shadow} elevation={14} opacity={0.22} radius={24}>
            <Pressable delayLongPress={220} disabled={isSavingOrder} onLongPress={drag}>
              <SurveySurfaceCard
                style={[
                  styles.item,
                  isActive ? styles.itemActive : null,
                  shouldHideNativeCell ? styles.itemDraggingGhost : null,
                ]}
              >
                <View style={styles.itemLead}>
                  <View style={styles.dragBadge}>
                    <GripVertical color={colors.textSubtle} size={20} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.itemOrder}>#{displayOrder}</Text>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemMeta}>{formatQuestionMeta(item)}</Text>
                </View>
              </SurveySurfaceCard>
            </Pressable>
          </ShadowDecorator>
        </ScaleDecorator>
      );
    },
    [colors.shadow, colors.textSubtle, dragAnimValues, draggedQuestion?.id, isSavingOrder, styles],
  );

  return (
    <SurveyScaffold
      title="Question Order"
      subtitle="Hold a card until it lifts, then drag it up or down to set the final tablet sequence."
      contentContainerStyle={styles.screenContent}
      contentWidth="narrow"
      scroll={false}
    >
      <SurveySurfaceCard style={styles.introCard}>
        <Text style={styles.introTitle}>Drag to reorder</Text>
        <Text style={styles.introText}>
          Press and hold a question card for a moment. When the card grows and lifts, drag it to the
          new position and release to save the order.
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusChip, isDragging ? styles.statusChipActive : null]}>
            <Text style={[styles.statusChipText, isDragging ? styles.statusChipTextActive : null]}>
              {isDragging ? 'Dragging in progress' : 'Ready to drag'}
            </Text>
          </View>
          <Text style={styles.statusHint}>
            The question list scrolls by itself while dragging, so the page will stay stable.
          </Text>
        </View>
      </SurveySurfaceCard>

      <View onLayout={handleListLayout} style={styles.listViewport}>
        <DraggableFlatList
          activationDistance={0}
          autoscrollSpeed={260}
          autoscrollThreshold={88}
          containerStyle={styles.listContainer}
          contentContainerStyle={styles.listContent}
          data={draftQuestions}
          dragItemOverflow
          ItemSeparatorComponent={renderItemSeparator}
          keyExtractor={(item) => item.id}
          onAnimValInit={setDragAnimValues}
          onDragBegin={(index) => {
            setDraggedQuestion(draftQuestions[index] ?? null);
            setIsDragging(true);
          }}
          onDragEnd={handleDragEnd}
          renderPlaceholder={renderPlaceholder}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {draggedQuestion && dragAnimValues && dragListFrame.width > 0 ? (
        <View pointerEvents="none" style={styles.dragOverlayLayer}>
          <DragOverlay
            animValues={dragAnimValues}
            colors={colors}
            frame={dragListFrame}
            question={draggedQuestion}
            styles={styles}
          />
        </View>
      ) : null}

      <Pressable
        disabled={isSavingOrder || isDragging}
        onPress={() => navigation.goBack()}
        style={[styles.doneButton, isSavingOrder || isDragging ? styles.doneButtonDisabled : null]}
      >
        <Text style={styles.doneButtonText}>
          {isSavingOrder ? 'Saving order...' : 'Done Reordering'}
        </Text>
      </Pressable>
    </SurveyScaffold>
  );
}
