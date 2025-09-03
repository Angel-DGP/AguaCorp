import React from 'react';
import { Text, View } from 'react-native';

type Props = { type: 'success' | 'error' | 'info'; message: string };

export function Feedback({ type, message }: Props) {
  const colors = {
    success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d' },
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a' },
  }[type];
  return (
    <View style={{ backgroundColor: colors.bg, borderLeftWidth: 4, borderLeftColor: colors.border, padding: 10, borderRadius: 6 }}>
      <Text style={{ color: colors.text }}>{message}</Text>
    </View>
  );
}


