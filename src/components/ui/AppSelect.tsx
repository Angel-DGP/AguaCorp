import React from 'react';
import { Text, View } from 'react-native';
import { AppButton } from './AppButton';

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: Array<Option<T>>;
};

export function AppSelect<T extends string>({ label, value, onChange, options }: Props<T>) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, color: '#334155' }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {options.map((opt) => (
          <AppButton
            key={opt.value}
            title={opt.label}
            variant={value === opt.value ? 'primary' : 'secondary'}
            onPress={() => onChange(opt.value)}
          />
        ))}
      </View>
    </View>
  );
}


