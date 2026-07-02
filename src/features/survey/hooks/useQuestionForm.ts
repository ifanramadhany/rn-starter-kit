import { useEffect, useMemo, useState } from 'react';

import { useSurveyStore } from '../store/useSurveyStore';
import type { QuestionFormValues } from '../types';

function createInitialValues(
  questionId: string | undefined,
  questions: ReturnType<typeof useSurveyStore.getState>['questions'],
): QuestionFormValues {
  const existingQuestion = questions.find((question) => question.id === questionId);

  if (!existingQuestion) {
    return {
      title: '',
      helperText: '',
      type: 'single',
      status: 'active',
      options: ['Opsi 1', 'Opsi 2', 'Opsi 3'],
    };
  }

  return {
    title: existingQuestion.title,
    helperText: existingQuestion.helperText,
    type: existingQuestion.type,
    status: existingQuestion.status,
    options: existingQuestion.options.map((option) => option.label),
  };
}

let nextOptionFieldId = 0;

function createOptionFieldKeys(count: number) {
  return Array.from({ length: count }, () => `option-field-${nextOptionFieldId++}`);
}

export function useQuestionForm(questionId: string | undefined) {
  const questions = useSurveyStore((state) => state.questions);
  const saveQuestion = useSurveyStore((state) => state.saveQuestion);
  const initialValues = useMemo(
    () => createInitialValues(questionId, questions),
    [questionId, questions],
  );
  const [values, setValues] = useState<QuestionFormValues>(initialValues);
  const [optionFieldKeys, setOptionFieldKeys] = useState(() =>
    createOptionFieldKeys(initialValues.options.length),
  );

  useEffect(() => {
    setValues(initialValues);
    setOptionFieldKeys(createOptionFieldKeys(initialValues.options.length));
  }, [initialValues]);

  const nonEmptyOptions = values.options.map((option) => option.trim()).filter(Boolean);

  return {
    values,
    optionFieldKeys,
    canSubmit: values.title.trim().length > 0 && nonEmptyOptions.length >= 2,
    setTitle: (title: string) => {
      setValues((currentValues) => ({ ...currentValues, title }));
    },
    setHelperText: (helperText: string) => {
      setValues((currentValues) => ({ ...currentValues, helperText }));
    },
    setType: (type: QuestionFormValues['type']) => {
      setValues((currentValues) => ({ ...currentValues, type }));
    },
    setStatus: (status: QuestionFormValues['status']) => {
      setValues((currentValues) => ({ ...currentValues, status }));
    },
    setOptionValue: (optionIndex: number, optionValue: string) => {
      setValues((currentValues) => ({
        ...currentValues,
        options: currentValues.options.map((option, index) =>
          index === optionIndex ? optionValue : option,
        ),
      }));
    },
    addOption: () => {
      setValues((currentValues) => ({
        ...currentValues,
        options: [...currentValues.options, `Opsi ${currentValues.options.length + 1}`],
      }));
      setOptionFieldKeys((currentKeys) => [...currentKeys, createOptionFieldKeys(1)[0]]);
    },
    removeOption: (optionIndex: number) => {
      setValues((currentValues) => {
        if (currentValues.options.length <= 2) {
          return currentValues;
        }

        return {
          ...currentValues,
          options: currentValues.options.filter((_, index) => index !== optionIndex),
        };
      });
      setOptionFieldKeys((currentKeys) => {
        if (currentKeys.length <= 2) {
          return currentKeys;
        }

        return currentKeys.filter((_, index) => index !== optionIndex);
      });
    },
    reset: () => {
      setValues(initialValues);
      setOptionFieldKeys(createOptionFieldKeys(initialValues.options.length));
    },
    submit: () => saveQuestion(questionId, values),
  };
}
