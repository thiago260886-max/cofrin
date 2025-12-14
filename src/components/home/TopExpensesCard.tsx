import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../contexts/themeContext';
import { spacing, borderRadius, getShadow } from '../../theme';

interface Props { 
  title?: string;
}

export default function TopExpensesCard({ title = 'Maiores gastos do mês atual' }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="titleMedium" style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: colors.dangerBg }]}>
          <MaterialCommunityIcons 
            name="chart-pie" 
            size={20} 
            color={colors.expense} 
          />
        </View>
      </View>

      {/* Chart placeholder */}
      <View style={[styles.chartContainer, { backgroundColor: colors.grayLight }]}>
        <MaterialCommunityIcons 
          name="chart-donut" 
          size={64} 
          color={colors.border} 
        />
        <Text variant="bodySmall" style={[styles.placeholderText, { color: colors.textMuted }]}>
          Sem dados suficientes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '600',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  placeholderText: {
    marginTop: spacing.sm,
  },
});
