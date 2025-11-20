/**
 * @file Dropdown.tsx
 * @description Elegant dropdown/select component
 * @module components/atoms
 *
 * A custom dropdown component with dark theme styling and
 * smooth animations for option selection.
 *
 * @example
 * <Dropdown
 *   options={[
 *     { label: 'Brief', value: '256' },
 *     { label: 'Standard', value: '512' }
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="Select length"
 * />
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from 'react-native';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
  description?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: string;
  style?: ViewStyle;
}

/**
 * Dropdown component for option selection
 *
 * @param {DropdownProps} props - Dropdown configuration
 * @returns {JSX.Element} Interactive dropdown with modal
 */
export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  icon,
  style,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          {icon && <Text style={styles.triggerIcon}>{icon}</Text>}
          <Text style={[styles.triggerText, !selectedOption && styles.placeholder]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <View style={styles.optionContent}>
                      {option.icon && (
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                      )}
                      <View style={styles.optionText}>
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {option.description && (
                          <Text style={styles.optionDescription}>
                            {option.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  trigger: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  triggerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  triggerText: {
    fontSize: 16,
    color: '#FFF',
  },
  placeholder: {
    color: '#64748B',
  },
  arrow: {
    fontSize: 12,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '80%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionsList: {
    padding: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionSelected: {
    backgroundColor: 'rgba(59,130,246,0.15)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  checkmark: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});
