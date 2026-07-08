import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { fontFamily, tokens } from '../util/tokens';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export default function AppButton({ title, onPress, variant = 'primary' }: AppButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.timing(scale, { toValue: 0.95, duration: 125, useNativeDriver: true }).start();

  const pressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: 125, useNativeDriver: true }).start();

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.base, variant === 'primary' ? styles.primary : styles.secondary, { transform: [{ scale }] }]}>
        <Text style={styles.label}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radiusMd,
    paddingVertical: tokens.space5,
    paddingHorizontal: tokens.space10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: tokens.accent,
  },
  secondary: {
    backgroundColor: tokens.altBackgroundNeutral,
  },
  label: {
    color: tokens.foreground,
    fontSize: tokens.fontSizeBase,
    fontFamily,
  },
});
