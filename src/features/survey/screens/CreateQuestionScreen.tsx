import React, { useMemo } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2, Plus } from 'lucide-react-native';

import { useResponsiveLayout } from '../../../shared/hooks/useResponsiveLayout';
import type { QuestionsStackParamList } from '../../../shared/navigation/routes';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import OptionEditorRow from '../components/OptionEditorRow';
import SurveyScaffold from '../components/SurveyScaffold';
import SurveySurfaceCard from '../components/SurveySurfaceCard';
import { useQuestionForm } from '../hooks/useQuestionForm';
import { createStyles } from './CreateQuestionScreen.styles';

type CreateQuestionScreenProps = NativeStackScreenProps<QuestionsStackParamList, 'CreateQuestion'>;

export default function CreateQuestionScreen({ navigation, route }: CreateQuestionScreenProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsiveLayout();
  const styles = useMemo(() => createStyles(colors, isTablet), [colors, isTablet]);
  const questionId = route.params?.questionId;
  const isEditing = Boolean(questionId);
  const {
    values,
    canSubmit,
    setTitle,
    setHelperText,
    setType,
    setStatus,
    setOptionValue,
    addOption,
    removeOption,
    reset,
    submit,
  } = useQuestionForm(questionId);

  return (
    <SurveyScaffold
      title={isEditing ? 'Edit Question' : 'Create Question'}
      subtitle="Build and stage answer structures that read cleanly on an iPad-sized survey station."
    >
      <View style={styles.columns}>
        <View style={styles.leftColumn}>
          <SurveySurfaceCard style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Question Text</Text>
            <TextInput
              multiline
              value={values.title}
              onChangeText={setTitle}
              placeholder="Enter the survey question"
              placeholderTextColor={colors.textSubtle}
              style={styles.textInput}
            />
          </SurveySurfaceCard>

          <SurveySurfaceCard style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Helper Text</Text>
            <TextInput
              multiline
              value={values.helperText}
              onChangeText={setHelperText}
              placeholder="Add a short description for surveyors or respondents"
              placeholderTextColor={colors.textSubtle}
              style={[styles.textInput, styles.helperInput]}
            />
          </SurveySurfaceCard>

          <SurveySurfaceCard style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Question Status</Text>
            <View style={styles.statusRow}>
              {(['active', 'draft'] as const).map((status) => {
                const isActive = values.status === status;

                return (
                  <Pressable
                    key={status}
                    onPress={() => setStatus(status)}
                    style={[styles.toggleButton, isActive ? styles.toggleButtonActive : null]}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        isActive ? styles.toggleButtonTextActive : null,
                      ]}
                    >
                      {status === 'active' ? 'Active' : 'Draft'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SurveySurfaceCard>

          <SurveySurfaceCard style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Selection Type</Text>
            <View style={styles.statusRow}>
              {(
                [
                  ['single', 'Single Choice'],
                  ['multiple', 'Multiple Choice'],
                ] as const
              ).map(([type, label]) => {
                const isActive = values.type === type;

                return (
                  <Pressable
                    key={type}
                    onPress={() => setType(type)}
                    style={[styles.toggleButton, isActive ? styles.toggleButtonActive : null]}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        isActive ? styles.toggleButtonTextActive : null,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SurveySurfaceCard>
        </View>

        <View style={styles.rightColumn}>
          <SurveySurfaceCard style={styles.optionsCard}>
            <View style={styles.optionsHeader}>
              <Text style={styles.fieldLabel}>Answer Options</Text>
              <Pressable onPress={addOption} style={styles.addOptionButton}>
                <Plus color={colors.onSecondaryContainer} size={18} strokeWidth={2.3} />
                <Text style={styles.addOptionButtonText}>Add Choice</Text>
              </Pressable>
            </View>
            <View style={styles.optionsList}>
              {values.options.map((option, index) => (
                <OptionEditorRow
                  key={`${index}-${option}`}
                  canRemove={values.options.length > 2}
                  label={option}
                  onChangeText={(nextValue) => setOptionValue(index, nextValue)}
                  onRemove={() => removeOption(index)}
                />
              ))}
            </View>
          </SurveySurfaceCard>
        </View>
      </View>

      <View style={styles.footerBar}>
        <Pressable
          onPress={() => {
            reset();
            navigation.goBack();
          }}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>Discard Changes</Text>
        </Pressable>
        <Pressable
          disabled={!canSubmit}
          onPress={() => {
            if (!canSubmit) {
              return;
            }

            submit();
            navigation.goBack();
          }}
          style={[styles.primaryAction, !canSubmit ? styles.primaryActionDisabled : null]}
        >
          <CheckCircle2 color={colors.onPrimary} size={18} strokeWidth={2.3} />
          <Text style={styles.primaryActionText}>
            {isEditing ? 'Save Question' : 'Create Question'}
          </Text>
        </Pressable>
      </View>
    </SurveyScaffold>
  );
}
