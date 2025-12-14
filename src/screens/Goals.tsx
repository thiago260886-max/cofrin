import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MainLayout from '../components/MainLayout';
import AppHeader from '../components/AppHeader';
import { useAppTheme } from '../contexts/themeContext';
import { spacing, borderRadius, getShadow } from '../theme';

export default function Goals() {
  const { colors } = useAppTheme();

  // Mock goals data
  const goals = [
    { id: '1', name: 'Reserva de emergência', target: 10000, current: 6500, icon: 'shield-check', color: '#3b82f6' },
    { id: '2', name: 'Viagem de férias', target: 5000, current: 2200, icon: 'airplane', color: '#8b5cf6' },
    { id: '3', name: 'Novo celular', target: 3000, current: 800, icon: 'cellphone', color: '#10b981' },
  ];

  const GoalCard = ({ goal }: { goal: typeof goals[0] }) => {
    const progress = (goal.current / goal.target) * 100;
    
    return (
      <Pressable 
        style={({ pressed }) => [
          styles.goalCard, 
          { backgroundColor: colors.card },
          getShadow(colors),
          pressed && { opacity: 0.95 }
        ]}
      >
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: goal.color + '15' }]}>
            <MaterialCommunityIcons name={goal.icon as any} size={24} color={goal.color} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
            <Text style={[styles.goalProgress, { color: colors.textMuted }]}>
              R$ {goal.current.toLocaleString('pt-BR')} de R$ {goal.target.toLocaleString('pt-BR')}
            </Text>
          </View>
          <Text style={[styles.goalPercent, { color: goal.color }]}>{Math.round(progress)}%</Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.grayLight }]}>
          <View 
            style={[
              styles.progressFill, 
              { backgroundColor: goal.color, width: `${Math.min(progress, 100)}%` }
            ]} 
          />
        </View>
      </Pressable>
    );
  };

  return (
    <MainLayout>
      <ScrollView style={[styles.root, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
        <AppHeader />
        <View style={styles.content}>
          <View style={styles.maxWidth}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]}>Metas do ano</Text>
              <Pressable 
                style={({ pressed }) => [
                  styles.addButton, 
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.9 }
                ]}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              </Pressable>
            </View>

            {goals.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.card }, getShadow(colors)]}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.primaryBg }]}>
                  <MaterialCommunityIcons name="target" size={40} color={colors.primary} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma meta criada</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  Crie metas financeiras para acompanhar seu progresso ao longo do ano.
                </Text>
              </View>
            ) : (
              <View style={styles.goalsList}>
                {goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  maxWidth: {
    width: '100%',
    maxWidth: 980,
    paddingHorizontal: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  goalsList: {
    gap: spacing.md,
  },
  goalCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgress: {
    fontSize: 13,
    marginTop: 2,
  },
  goalPercent: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
