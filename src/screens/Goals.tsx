import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MainLayout from '../components/MainLayout';
import AppHeader from '../components/AppHeader';
import { palette } from '../theme';

export default function Goals() {
  return (
    <MainLayout>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <AppHeader />
          <View style={styles.body}>
            <Text style={styles.title}>Metas do ano</Text>
            <Text style={styles.subtitle}>Em breve você verá suas metas aqui.</Text>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.bg },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  body: { paddingTop: 12, gap: 8 },
  title: { fontSize: 22, fontWeight: '700', color: palette.text },
  subtitle: { fontSize: 15, color: palette.muted },
});
