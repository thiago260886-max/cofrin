import React, { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCurrencyBRL } from '../../utils/format';
import { useAppTheme } from '../../contexts/themeContext';
import { spacing, borderRadius } from '../../theme';

interface Props {
  creditCardName: string;
  creditCardIcon?: string;
  creditCardColor?: string;
  billMonth: number;
  billYear: number;
  totalAmount: number;
  isPaid: boolean;
  onPress: () => void;
}

// Nomes dos meses abreviados
const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

function CreditCardBillItemComponent({
  creditCardName,
  creditCardIcon = 'credit-card',
  creditCardColor = '#3B82F6',
  billMonth,
  billYear,
  totalAmount,
  isPaid,
  onPress,
}: Props) {
  const { colors } = useAppTheme();
  
  const monthName = MONTHS_SHORT[billMonth - 1] || '';
  const title = `Fatura ${creditCardName}`;
  const subtitle = `${monthName}/${billYear}`;
  
  // Cor do valor - igual ao TransactionItem
  const amountColor = isPaid ? colors.textMuted : '#dc2626';
  
  // Status icon e cor - igual ao TransactionItem
  const statusColor = isPaid ? '#10b981' : colors.textMuted;
  const statusIcon = isPaid ? 'check-circle' : 'circle-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { 
          backgroundColor: pressed ? colors.grayLight : colors.card, 
          borderBottomColor: colors.border 
        }
      ]}
    >
      {/* Ícone de status - mesmo estilo do TransactionItem */}
      <Pressable
        hitSlop={8}
        style={styles.statusButton}
      >
        <MaterialCommunityIcons name={statusIcon} size={20} color={statusColor} />
      </Pressable>

      {/* Ícone do cartão - mesmo tamanho do avatar do TransactionItem */}
      <View style={[styles.avatar, { backgroundColor: creditCardColor + '15' }]}>
        <MaterialCommunityIcons 
          name={creditCardIcon as any} 
          size={20} 
          color={creditCardColor} 
        />
      </View>
      
      {/* Conteúdo - mesmo estilo do TransactionItem */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.account, { color: colors.textMuted }]}>
          {subtitle}{!isPaid && ' • Pendente'}
        </Text>
      </View>
      
      {/* Valor - mesmo estilo do TransactionItem */}
      <Text style={[styles.amount, { color: amountColor }]}>
        {formatCurrencyBRL(-totalAmount)}
      </Text>
      
      {/* Seta para indicar navegação */}
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={18} 
        color={colors.textMuted}
        style={styles.chevron}
      />
    </Pressable>
  );
}

export default memo(CreditCardBillItemComponent);

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
  statusButton: {
    marginRight: spacing.xs,
    padding: 2,
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: borderRadius.md,
    alignItems: 'center', 
    justifyContent: 'center',
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
  chevron: {
    marginLeft: spacing.xs,
  },
});
