import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../contexts/themeContext';
import { spacing, borderRadius, getShadow } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

export default function Card({ children, style }: CardProps) {
  const { colors } = useAppTheme();
  
  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: colors.card }, 
        getShadow(colors),
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
});
