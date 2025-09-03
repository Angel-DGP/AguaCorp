import React from 'react';
import { View, ViewProps } from 'react-native';
import { COLORS } from '../../constants/Colors';

export function AppCard({ style, children, ...rest }: ViewProps) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: 12,
          padding: 16,
          shadowColor: COLORS.black,
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
