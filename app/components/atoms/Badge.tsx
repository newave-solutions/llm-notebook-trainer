/**
 * @file Badge.tsx
 * @description Status and label badge component
 * @module components/atoms
 *
 * Displays small, colored badges for status indicators, labels,
 * and categorical information with semantic color coding.
 *
 * @example
 * <Badge variant="success" size="medium">
 *   Active
 * </Badge>
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  dot?: boolean;
}

/**
 * Badge component for status and labels
 *
 * @param {BadgeProps} props - Badge configuration
 * @returns {JSX.Element} Styled badge component
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'medium',
  style,
  dot = false,
}: BadgeProps) {
  const containerStyles = [
    styles.badge,
    styles[`badge_${variant}`],
    styles[`badge_${size}`],
    style,
  ];

  const textStyles = [styles.text, styles[`text_${size}`]];

  const dotStyles = [styles.dot, styles[`dot_${variant}`]];

  return (
    <View style={containerStyles}>
      {dot && <View style={dotStyles} />}
      <Text style={textStyles}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
  },

  // Variants
  badge_success: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  badge_error: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  badge_warning: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  badge_info: {
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  badge_neutral: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Sizes
  badge_small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge_medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badge_large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  // Text
  text: {
    fontWeight: '600',
  },
  text_small: {
    fontSize: 10,
    color: '#FFF',
  },
  text_medium: {
    fontSize: 12,
    color: '#FFF',
  },
  text_large: {
    fontSize: 14,
    color: '#FFF',
  },

  // Dot indicator
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dot_success: {
    backgroundColor: '#22C55E',
  },
  dot_error: {
    backgroundColor: '#EF4444',
  },
  dot_warning: {
    backgroundColor: '#F59E0B',
  },
  dot_info: {
    backgroundColor: '#3B82F6',
  },
  dot_neutral: {
    backgroundColor: '#94A3B8',
  },
});
