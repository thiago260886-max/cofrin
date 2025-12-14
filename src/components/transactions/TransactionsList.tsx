import { View, Text, StyleSheet } from 'react-native';
import TransactionItem from './TransactionItem';
import type { Transaction } from '../../state/transactionsState';
import { useAppTheme } from '../../contexts/themeContext';
import { spacing } from '../../theme';

interface Props { items: Transaction[] }

export default function TransactionsList({ items = [] }: Props) {
  const { colors } = useAppTheme();
  
  // group by date (simple grouping: same date string -> header)
  const groups: Record<string, Transaction[]> = {};
  items.forEach((t) => {
    const date = new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
  });

  const dates = Object.keys(groups);

  return (
    <View>
      {dates.map((d) => (
        <View key={d} style={styles.group}>
          <Text style={[styles.dateHeader, { color: colors.textMuted }]}>{d}</Text>
          {groups[d].map((tx) => (
            <TransactionItem key={tx.id} title={tx.title} account={tx.account} amount={tx.amount} type={tx.type} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: spacing.md,
  },
  dateHeader: { 
    marginVertical: spacing.sm, 
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'capitalize',
  },
});
