/**
 * @file Button.tsx
 * @description Reusable button component with multiple variants and states
 * @module components/atoms
 *
 * A versatile button component supporting different visual styles,
 * sizes, loading states, and icons. Follows dark tech aesthetic.
 *
 * @example
 * <Button variant="primary" onPress={handleSubmit}>
 *   Generate
 * </Button>
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Button component with support for variants, sizes, and states
 *
 * @param {ButtonProps} props - Button configuration
 * @returns {JSX.Element} Styled button component
 */
export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  testID,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    (disabled || loading) && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size={size === 'small' ? 'small' : 'small'}
            color={variant === 'primary' ? '#FFF' : '#3B82F6'}
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={textStyles}>{children}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  button_primary: {
    backgroundColor: '#3B82F6',
  },
  button_secondary: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_danger: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  // Sizes
  button_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button_medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button_large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  // Text variants
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#FFF',
  },
  text_secondary: {
    color: '#3B82F6',
  },
  text_ghost: {
    color: '#94A3B8',
  },
  text_danger: {
    color: '#EF4444',
  },

  // Text sizes
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
});
