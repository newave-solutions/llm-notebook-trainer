/**
 * @file Card.tsx
 * @description Base card container component
 * @module components/atoms
 *
 * A versatile container component that provides consistent styling
 * for card-based layouts with optional elevation and interactivity.
 *
 * @example
 * <Card elevated clickable onPress={handlePress}>
 *   <Text>Card content</Text>
 * </Card>
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  bordered?: boolean;
  clickable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Card container component with optional interactivity
 *
 * @param {CardProps} props - Card configuration
 * @returns {JSX.Element} Styled card container
 */
export default function Card({
  children,
  elevated = false,
  bordered = true,
  clickable = false,
  onPress,
  style,
  testID,
}: CardProps) {
  const cardStyles = [
    styles.card,
    elevated && styles.elevated,
    bordered && styles.bordered,
    style,
  ];

  if (clickable && onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.8}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bordered: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
