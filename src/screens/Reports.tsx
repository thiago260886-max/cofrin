import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../contexts/themeContext';
import AppHeader from '../components/AppHeader';
import MainLayout from '../components/MainLayout';
import { spacing, borderRadius, getShadow } from '../theme';

export default function Reports() {
  const { colors } = useAppTheme();

  return (
    <MainLayout>
      <ScrollView style={[styles.root, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
        <AppHeader />
        <View style={styles.content}>
          <View style={styles.maxWidth}>
            <Text style={[styles.title, { color: colors.text }]}>Relatórios</Text>
            
            <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
                  <MaterialCommunityIcons name="chart-bar" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Análise de gastos</Text>
              </View>
              <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
                Visualize relatórios detalhados com os gastos e entradas do mês atual e anteriores.
              </Text>
              
              {/* Placeholder */}
              <View style={[styles.placeholder, { backgroundColor: colors.grayLight }]}>
                <MaterialCommunityIcons name="chart-line" size={48} color={colors.border} />
                <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                  Em breve
                </Text>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card }, getShadow(colors)]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: colors.successBg }]}>
                  <MaterialCommunityIcons name="trending-up" size={24} color={colors.income} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Evolução patrimonial</Text>
              </View>
              <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
                Acompanhe a evolução do seu patrimônio ao longo do tempo.
              </Text>
              
              {/* Placeholder */}
              <View style={[styles.placeholder, { backgroundColor: colors.grayLight }]}>
                <MaterialCommunityIcons name="chart-areaspline" size={48} color={colors.border} />
                <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                  Em breve
                </Text>
              </View>
            </View>
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
    marginBottom: spacing.md,
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
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  placeholder: {
    height: 120,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: spacing.sm,
    fontSize: 14,
  },
});
