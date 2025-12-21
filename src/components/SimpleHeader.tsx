import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../contexts/themeContext';
import { spacing } from '../theme';

interface SimpleHeaderProps {
  title: string;
}

export default function SimpleHeader({ title }: SimpleHeaderProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  
  const topPadding = Math.max(insets.top, 8) + 8;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { paddingTop: topPadding, paddingBottom: 8 }]}>
        <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.5,
  },
});
