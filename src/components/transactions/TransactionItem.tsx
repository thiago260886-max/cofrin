import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { formatCurrencyBRL } from '../../utils/format';
import { useAppTheme } from '../../contexts/themeContext';
import { spacing, borderRadius } from '../../theme';

interface Props {
  icon?: string; // letter or emoji
  title: string;
  account?: string;
  amount: number; // numeric value; positive = income, negative = expense
  type?: 'received' | 'paid' | 'transfer';
  onPress?: () => void;
}

function TransactionItemComponent({ icon = '◻', title, account, amount, type, onPress }: Props) {
  const { colors } = useAppTheme();
  const isReceived = amount >= 0 || type === 'received';
  const color = isReceived ? colors.income : colors.expense;
  const initial = title.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? colors.grayLight : colors.card, borderBottomColor: colors.border }
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: color + '15' }]}>
        <Text style={[styles.avatarLabel, { color }]}>{initial}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        {account && <Text style={[styles.account, { color: colors.textMuted }]}>{account}</Text>}
      </View>
      
      <Text style={[styles.amount, { color }]}>{formatCurrencyBRL(amount)}</Text>
    </Pressable>
  );
}

export default memo(TransactionItemComponent);

const styles = StyleSheet.create({
  row: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderRadius: borderRadius.sm,
    marginBottom: 2,
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: borderRadius.md,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  avatarLabel: { 
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  account: {
    fontSize: 13,
    marginTop: 2,
  },
  amount: { 
    fontWeight: '700', 
    fontSize: 15,
  },
});
