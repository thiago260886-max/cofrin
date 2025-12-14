import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../contexts/themeContext';
import { spacing, borderRadius, getShadow } from '../../theme';
import { formatCurrencyBRL } from '../../utils/format';

interface CreditCard {
  id: string;
  name: string;
  currentBill: number;
  dueDate: number; // dia do vencimento
  icon?: string;
  color?: string;
}

interface Props {
  cards?: CreditCard[];
  onCardPress?: (card: CreditCard) => void;
}

// Nome dos meses em português
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Cores para os cartões baseado no nome
const getCardColor = (name: string): string => {
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function CreditCardsCard({ cards = [], onCardPress }: Props) {
  const { colors } = useAppTheme();
  const currentMonth = MONTHS[new Date().getMonth()];

  // Componente de item do cartão
  const CardRow = ({ card }: { card: CreditCard }) => {
    const cardColor = card.color || getCardColor(card.name);
    
    return (
      <Pressable
        onPress={() => onCardPress?.(card)}
        style={({ pressed }) => [
          styles.cardRow,
          { backgroundColor: pressed ? colors.grayLight : 'transparent' }
        ]}
      >
        <View style={[styles.cardIcon, { backgroundColor: `${cardColor}15` }]}>
          <MaterialCommunityIcons
            name={(card.icon as any) || 'credit-card'}
            size={22}
            color={cardColor}
          />
        </View>

        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: colors.text }]}>{card.name}</Text>
          <Text style={[styles.cardDue, { color: colors.textMuted }]}>
            Vence dia {card.dueDate}
          </Text>
        </View>

        <View style={styles.cardBill}>
          <Text style={[styles.billLabel, { color: colors.textMuted }]}>Fatura</Text>
          <Text style={[styles.billValue, { color: card.currentBill > 0 ? colors.expense : colors.text }]}>
            {formatCurrencyBRL(card.currentBill)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            Faturas de {currentMonth}
          </Text>
        </View>

        <View style={[styles.iconContainer, { backgroundColor: colors.primaryBg }]}>
          <MaterialCommunityIcons
            name="credit-card-multiple"
            size={20}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Subtítulo */}
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Cartões ativos</Text>

      {/* Lista de cartões */}
      {cards.length > 0 ? (
        <View style={styles.cardsList}>
          {cards.map((card) => (
            <CardRow key={card.id} card={card} />
          ))}
        </View>
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: colors.grayLight }]}>
          <MaterialCommunityIcons
            name="credit-card-off-outline"
            size={48}
            color={colors.border}
          />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Nenhum cartão cadastrado
          </Text>
        </View>
      )}
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
    marginBottom: spacing.xs,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: spacing.md,
  },
  cardsList: {
    gap: spacing.xs,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '500',
  },
  cardDue: {
    fontSize: 12,
    marginTop: 2,
  },
  cardBill: {
    alignItems: 'flex-end',
  },
  billLabel: {
    fontSize: 11,
  },
  billValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 13,
  },
});
