/**
 * @file Input.tsx
 * @description Standardized text input with validation and error states
 * @module components/atoms
 *
 * A flexible input component that handles single-line and multi-line text,
 * with built-in error display, loading states, and dark theme styling.
 *
 * @example
 * <Input
 *   value={text}
 *   onChange={setText}
 *   placeholder="Enter your prompt..."
 *   multiline
 *   error="Please enter at least 20 characters"
 * />
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  helperText?: string;
  multiline?: boolean;
  secure?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  maxLength?: number;
  showCharCount?: boolean;
}

/**
 * Input component with validation and error handling
 *
 * @param {InputProps} props - Input configuration
 * @returns {JSX.Element} Styled input with optional label and error
 */
export default function Input({
  value,
  onChange,
  placeholder,
  error,
  label,
  helperText,
  multiline = false,
  secure = false,
  disabled = false,
  containerStyle,
  maxLength,
  showCharCount = false,
  ...rest
}: InputProps) {
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        secureTextEntry={secure}
        editable={!disabled}
        multiline={multiline}
        maxLength={maxLength}
        {...rest}
      />

      {(error || helperText || showCharCount) && (
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {error && <Text style={styles.error}>{error}</Text>}
            {!error && helperText && (
              <Text style={styles.helperText}>{helperText}</Text>
            )}
          </View>

          {showCharCount && maxLength && (
            <Text style={styles.charCount}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFF',
    minHeight: 50,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.05)',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  footerLeft: {
    flex: 1,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
  },
  charCount: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
});
