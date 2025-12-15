import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/themeContext';
import { spacing, borderRadius, getShadow } from '../theme';
import { Goal, GOAL_TIMEFRAME_LABELS, GOAL_TIMEFRAME_DESCRIPTIONS } from '../types/firebase';
import { formatCurrencyBRL } from '../utils/format';

interface Props {
  goal: Goal | null;
  progressPercentage: number;
  monthBalance?: number; // Saldo do mês (receitas - despesas)
  onCreatePress?: () => void;
  onGoalPress?: () => void;
}

export default function GoalProgressCard({ 
  goal, 
  progressPercentage, 
  monthBalance = 0,
  onCreatePress, 
  onGoalPress 
}: Props) {
  const { colors } = useAppTheme();

  // Card quando NÃO há meta
  if (!goal) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
            <MaterialCommunityIcons name="flag-checkered" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Sua meta financeira</Text>
        </View>

        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Ter uma meta financeira ajuda a dar sentido aos seus hábitos e decisões.
        </Text>

        <Pressable
          onPress={onCreatePress}
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85 }
          ]}
        >
          <MaterialCommunityIcons name="plus" size={18} color="#fff" />
          <Text style={styles.createButtonText}>Criar meta</Text>
        </Pressable>
      </View>
    );
  }

  // Card quando há meta ativa
  const timeframeLabel = GOAL_TIMEFRAME_LABELS[goal.timeframe];
  const timeframeDescription = GOAL_TIMEFRAME_DESCRIPTIONS[goal.timeframe];
  const remaining = goal.targetAmount - goal.currentAmount;

  // Gerar texto contextual baseado no comportamento do mês
  const getContextualText = () => {
    if (progressPercentage >= 100) {
      return '🎉 Parabéns! Você alcançou sua meta. Hora de celebrar e definir um novo objetivo.';
    }

    if (monthBalance > 0) {
      if (progressPercentage >= 75) {
        return 'Neste mês, seu saldo positivo te aproximou ainda mais da sua meta. Você está quase lá!';
      }
      return 'Neste mês, seu saldo positivo ajudou você a avançar na sua meta. Continue assim!';
    } else if (monthBalance < 0) {
      return 'Reduzir gastos e aumentar o saldo pode acelerar o progresso da sua meta.';
    }

    return 'Manter um saldo positivo todo mês ajuda a conquistar sua meta mais rápido.';
  };

  return (
    <Pressable
      onPress={onGoalPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card },
        getShadow(colors),
        pressed && { opacity: 0.95 }
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
          <MaterialCommunityIcons 
            name={(goal.icon as any) || 'flag-checkered'} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Sua meta financeira</Text>
        </View>
      </View>

      {/* Informações da meta */}
      <View style={styles.goalInfo}>
        <Text style={[styles.goalName, { color: colors.text }]}>
          {goal.name}
        </Text>
        <Text style={[styles.goalTimeframe, { color: colors.textMuted }]}>
          {timeframeLabel} • {timeframeDescription}
        </Text>
      </View>

      {/* Valores e progresso */}
      <View style={styles.valuesRow}>
        <View style={styles.valueItem}>
          <Text style={[styles.valueLabel, { color: colors.textMuted }]}>Conquistado</Text>
          <Text style={[styles.valueAmount, { color: colors.primary }]}>
            {formatCurrencyBRL(goal.currentAmount)}
          </Text>
        </View>
        <View style={[styles.valueDivider, { backgroundColor: colors.border }]} />
        <View style={styles.valueItem}>
          <Text style={[styles.valueLabel, { color: colors.textMuted }]}>Faltam</Text>
          <Text style={[styles.valueAmount, { color: colors.text }]}>
            {formatCurrencyBRL(remaining > 0 ? remaining : 0)}
          </Text>
        </View>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
            Progresso
          </Text>
          <Text style={[styles.progressPercentage, { color: colors.primary }]}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(progressPercentage, 100)}%`,
                backgroundColor: colors.primary
              }
            ]} 
          />
        </View>
      </View>

      {/* Texto contextual educativo */}
      <View style={[styles.contextBox, { backgroundColor: colors.primaryBg }]}>
        <MaterialCommunityIcons name="lightbulb-on" size={16} color={colors.primary} />
        <Text style={[styles.contextText, { color: colors.primary }]}>
          {getContextualText()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  goalInfo: {
    marginBottom: spacing.md,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  goalTimeframe: {
    fontSize: 13,
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  valueItem: {
    flex: 1,
  },
  valueDivider: {
    width: 1,
    height: 32,
    marginHorizontal: spacing.md,
  },
  valueLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contextBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  contextText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
