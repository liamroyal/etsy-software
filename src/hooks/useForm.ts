import { useState, useCallback } from 'react';

export type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

export type FieldConfig<T> = {
  initialValue: T;
  rules?: ValidationRule<T>[];
  transform?: (value: T) => T;
};

export type FormConfig<T extends Record<string, any>> = {
  [K in keyof T]: FieldConfig<T[K]>;
};

export interface UseFormOptions<T> {
  onSubmit?: (values: T) => Promise<void> | void;
  onError?: (error: Error) => void;
}

export function useForm<T extends Record<string, any>>(
  config: FormConfig<T>,
  options: UseFormOptions<T> = {}
) {
  const [values, setValues] = useState<T>(() => {
    const initialValues: Partial<T> = {};
    for (const [key, field] of Object.entries(config)) {
      initialValues[key as keyof T] = field.initialValue;
    }
    return initialValues as T;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: T[keyof T]): string | null => {
    const fieldConfig = config[name];
    if (!fieldConfig.rules) return null;

    for (const rule of fieldConfig.rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  }, [config]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const name of Object.keys(config) as Array<keyof T>) {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [config, validateField, values]);

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    const fieldConfig = config[name];
    const transformedValue = fieldConfig.transform ? fieldConfig.transform(value) : value;
    
    setValues(prev => ({
      ...prev,
      [name]: transformedValue
    }));

    if (touched[name]) {
      const error = validateField(name, transformedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  }, [config, touched, validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  }, [validateField, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await options.onSubmit?.(values);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Form submission failed');
      options.onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values, options]);

  const reset = useCallback(() => {
    const initialValues: Partial<T> = {};
    for (const [key, field] of Object.entries(config)) {
      initialValues[key as keyof T] = field.initialValue;
    }
    setValues(initialValues as T);
    setErrors({});
    setTouched({});
  }, [config]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
} 