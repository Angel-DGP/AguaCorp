import React from 'react';
import { ActivityIndicator, Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/Colors';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ 
  title, 
  onPress, 
  loading, 
  disabled, 
  variant = 'primary',
  style
}: Props) {
  const isDisabled = loading || disabled;
  
  const getColors = () => {
    if (isDisabled) {
      return { bg: COLORS.gray, color: COLORS.white };
    }
    if (variant === 'primary') {
      return { bg: COLORS.darkBlue, color: COLORS.white };
    }
    return { bg: COLORS.lightBlue, color: COLORS.white };
  };

  const { bg, color } = getColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 12,
          opacity: isDisabled ? 0.6 : 1,
        },
        style
      ]}
      disabled={isDisabled}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={{ color, fontWeight: '600' }}>{title}</Text>}
    </Pressable>
  );
}


