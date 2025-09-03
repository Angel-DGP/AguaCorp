import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/Styles';
import { useAuth } from '../../store/authContext';

type LogoutButtonProps = {
  variant?: 'default' | 'compact' | 'minimal';
};

export default function LogoutButton({ 
  variant = 'default'
}: LogoutButtonProps) {
  const { logout } = useAuth();

  const getIconSize = () => {
    switch (variant) {
      case 'compact':
        return 18;
      case 'minimal':
        return 16;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity 
      onPress={logout} 
      style={{
        padding: SPACING.sm,
        marginRight: SPACING.base,
      }}
      activeOpacity={0.6}
    >
      <FontAwesome 
        name="sign-out" 
        size={getIconSize()} 
        color={COLORS.red} 
      />
    </TouchableOpacity>
  );
}