import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/themeContext';
import AppHeader from '../components/AppHeader';
import MainLayout from '../components/MainLayout';
import { spacing, borderRadius, getShadow } from '../theme';
import { formatCurrencyBRL } from '../utils/format';
import { useMonthReport, useExpensesByCategory } from '../hooks/useFirebaseTransactions';

// Componente de stat card
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
  colors: any;
}

function StatCard({ title, value, icon, iconBg, iconColor, subtitle, colors }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }, getShadow(colors)]}>
      <View style={[styles.statIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statTitle, { color: colors.textMuted }]}>{title}</Text>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

// Componente de barra de progresso simples para gráfico
interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  colors: any;
}

function ProgressBar({ label, value, maxValue, color, colors }: ProgressBarProps) {
  const percentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  
  return (
    <View style={styles.progressItem}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.progressValue, { color: colors.text }]}>
          {formatCurrencyBRL(value)}
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { backgroundColor: color, width: `${percentage}%` }
          ]} 
        />
      </View>
    </View>
  );
}

export default function Reports() {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isNarrow = width < 700;

  // Mês atual
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Dados do relatório
  const { report, loading } = useMonthReport(currentMonth, currentYear);
  const { expenses: categoryExpenses } = useExpensesByCategory(currentMonth, currentYear);

  // Nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Mês anterior
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Calcular evolução
  const savingsEvolution = useMemo(() => {
    if (!report) return { current: 0, previous: 0, difference: 0, improved: false };
    
    const current = report.balance;
    const previous = report.previousMonth.balance;
    const difference = current - previous;
    
    return {
      current,
      previous,
      difference,
      improved: difference > 0
    };
  }, [report]);

  // Máximo para o gráfico de barras
  const maxBalance = Math.max(
    Math.abs(savingsEvolution.current), 
    Math.abs(savingsEvolution.previous),
    1
  );

  if (loading) {
    return (
      <MainLayout>
        <ScrollView style={[styles.root, { backgroundColor: colors.bg }]}>
          <AppHeader />
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Carregando relatório...
            </Text>
          </View>
        </ScrollView>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ScrollView style={[styles.root, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
        <AppHeader />
        <View style={styles.content}>
          <View style={styles.maxWidth}>
            <Text style={[styles.title, { color: colors.text }]}>Relatórios</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {monthNames[currentMonth - 1]} de {currentYear}
            </Text>

            {/* Alerta de dívida */}
            {report && report.debtPercentage >= 30 && (
              <View style={[styles.alertCard, { backgroundColor: colors.dangerBg }]}>
                <MaterialCommunityIcons name="alert" size={24} color={colors.expense} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: colors.expense }]}>
                    Atenção com suas dívidas!
                  </Text>
                  <Text style={[styles.alertText, { color: colors.text }]}>
                    Você já atingiu {report.debtPercentage.toFixed(0)}% de dívidas em cartão de crédito sobre o seu salário atual. 
                    O recomendado é manter abaixo de 30%.
                  </Text>
                </View>
              </View>
            )}

            {/* Cards de estatísticas */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Resumo financeiro
            </Text>
            
            <View style={[styles.statsGrid, { flexDirection: isNarrow ? 'column' : 'row' }]}>
              <View style={[styles.statsRow, { flex: isNarrow ? undefined : 1 }]}>
                <StatCard
                  title="Receitas"
                  value={formatCurrencyBRL(report?.income || 0)}
                  icon="arrow-up-circle"
                  iconBg={colors.successBg}
                  iconColor={colors.income}
                  colors={colors}
                />
                <StatCard
                  title="Despesas"
                  value={formatCurrencyBRL(report?.expense || 0)}
                  icon="arrow-down-circle"
                  iconBg={colors.dangerBg}
                  iconColor={colors.expense}
                  colors={colors}
                />
              </View>
              <View style={[styles.statsRow, { flex: isNarrow ? undefined : 1 }]}>
                <StatCard
                  title="Gastos no débito"
                  value={formatCurrencyBRL(report?.debitExpenses || 0)}
                  icon="wallet"
                  iconBg={colors.primaryBg}
                  iconColor={colors.primary}
                  colors={colors}
                />
                <StatCard
                  title="Gastos no crédito"
                  value={formatCurrencyBRL(report?.creditExpenses || 0)}
                  icon="credit-card"
                  iconBg={colors.warningBg || '#FEF3C7'}
                  iconColor={colors.warning || '#F59E0B'}
                  colors={colors}
                />
              </View>
            </View>

            {/* Balanço do mês */}
            <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
                  <MaterialCommunityIcons name="scale-balance" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Balanço do mês</Text>
              </View>
              
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>
                  Receitas - Despesas
                </Text>
                <Text style={[
                  styles.balanceValue, 
                  { color: (report?.balance || 0) >= 0 ? colors.income : colors.expense }
                ]}>
                  {formatCurrencyBRL(report?.balance || 0)}
                </Text>
              </View>
            </View>

            {/* Compromisso futuro */}
            <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: colors.warningBg || '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="calendar-clock" size={24} color={colors.warning || '#F59E0B'} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Compromissos de cartão</Text>
              </View>
              
              <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
                Valor total atualmente utilizado nos cartões de crédito (fatura a pagar)
              </Text>

              <View style={styles.futureRow}>
                <View style={styles.futureItem}>
                  <Text style={[styles.futureLabel, { color: colors.textMuted }]}>
                    Fatura atual
                  </Text>
                  <Text style={[styles.futureValue, { color: colors.expense }]}>
                    {formatCurrencyBRL(report?.totalCreditCardUsage || 0)}
                  </Text>
                </View>
                
                {report?.currentSalary ? (
                  <View style={styles.futureItem}>
                    <Text style={[styles.futureLabel, { color: colors.textMuted }]}>
                      % do salário
                    </Text>
                    <Text style={[
                      styles.futureValue, 
                      { color: (report.debtPercentage >= 30) ? colors.expense : colors.text }
                    ]}>
                      {report.debtPercentage.toFixed(1)}%
                    </Text>
                  </View>
                ) : null}
              </View>

              {report?.currentSalary ? (
                <View style={[styles.salaryInfo, { backgroundColor: colors.grayLight }]}>
                  <MaterialCommunityIcons name="briefcase" size={16} color={colors.textMuted} />
                  <Text style={[styles.salaryText, { color: colors.textMuted }]}>
                    Salário atual: {formatCurrencyBRL(report.currentSalary)}
                  </Text>
                </View>
              ) : (
                <View style={[styles.salaryInfo, { backgroundColor: colors.grayLight }]}>
                  <MaterialCommunityIcons name="information" size={16} color={colors.textMuted} />
                  <Text style={[styles.salaryText, { color: colors.textMuted }]}>
                    Cadastre uma receita com categoria "Salário" para ver o percentual comprometido
                  </Text>
                </View>
              )}
            </View>

            {/* Gráfico de evolução */}
            <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: colors.successBg }]}>
                  <MaterialCommunityIcons name="trending-up" size={24} color={colors.income} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Evolução de poupança</Text>
              </View>
              
              <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
                Comparativo do saldo entre o mês anterior e o atual
              </Text>

              <View style={styles.evolutionChart}>
                <ProgressBar
                  label={`${monthNames[prevMonth - 1]} ${prevYear}`}
                  value={savingsEvolution.previous}
                  maxValue={maxBalance}
                  color={colors.textMuted}
                  colors={colors}
                />
                <ProgressBar
                  label={`${monthNames[currentMonth - 1]} ${currentYear}`}
                  value={savingsEvolution.current}
                  maxValue={maxBalance}
                  color={savingsEvolution.improved ? colors.income : colors.expense}
                  colors={colors}
                />
              </View>

              {/* Indicador de evolução */}
              <View style={[
                styles.evolutionIndicator, 
                { backgroundColor: savingsEvolution.improved ? colors.successBg : colors.dangerBg }
              ]}>
                <MaterialCommunityIcons 
                  name={savingsEvolution.improved ? 'trending-up' : 'trending-down'} 
                  size={20} 
                  color={savingsEvolution.improved ? colors.income : colors.expense} 
                />
                <Text style={[
                  styles.evolutionText, 
                  { color: savingsEvolution.improved ? colors.income : colors.expense }
                ]}>
                  {savingsEvolution.improved ? 'Você está guardando mais dinheiro!' : 'Seu saldo diminuiu em relação ao mês passado'}
                  {' '}
                  ({savingsEvolution.difference >= 0 ? '+' : ''}{formatCurrencyBRL(savingsEvolution.difference)})
                </Text>
              </View>
            </View>

            {/* Top categorias de gastos */}
            {categoryExpenses.length > 0 && (
              <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.dangerBg }]}>
                    <MaterialCommunityIcons name="chart-pie" size={24} color={colors.expense} />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Gastos por categoria</Text>
                </View>

                <View style={styles.categoryList}>
                  {categoryExpenses.slice(0, 5).map((cat, index) => {
                    const percentage = report?.expense 
                      ? ((cat.total / report.expense) * 100).toFixed(0) 
                      : '0';
                    
                    return (
                      <View key={cat.categoryId} style={styles.categoryItem}>
                        <View style={styles.categoryLeft}>
                          <View style={[styles.categoryRank, { backgroundColor: colors.primaryBg }]}>
                            <Text style={[styles.categoryRankText, { color: colors.primary }]}>
                              {index + 1}
                            </Text>
                          </View>
                          <MaterialCommunityIcons 
                            name={cat.categoryIcon as any} 
                            size={20} 
                            color={colors.text} 
                          />
                          <Text style={[styles.categoryName, { color: colors.text }]}>
                            {cat.categoryName}
                          </Text>
                        </View>
                        <View style={styles.categoryRight}>
                          <Text style={[styles.categoryValue, { color: colors.expense }]}>
                            {formatCurrencyBRL(cat.total)}
                          </Text>
                          <Text style={[styles.categoryPercent, { color: colors.textMuted }]}>
                            {percentage}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    lineHeight: 18,
  },
  statsGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  balanceLabel: {
    fontSize: 14,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  futureRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  futureItem: {
    flex: 1,
  },
  futureLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  futureValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  salaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  salaryText: {
    fontSize: 12,
    flex: 1,
  },
  evolutionChart: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progressItem: {
    gap: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
  evolutionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  evolutionText: {
    fontSize: 13,
    flex: 1,
  },
  categoryList: {
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  categoryRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryRankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryName: {
    fontSize: 14,
    flex: 1,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPercent: {
    fontSize: 11,
  },
});
