import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@components/ui/AppButton';
import { AppInput } from '@components/ui/AppInput';
import { useAuth } from '@store/authContext';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from '../../constants/Styles';

type LoginStackParamList = {
  Login: undefined;
  SecondAuth: {
    meterCode: string;
    userType: 'Lector' | 'Admin';
  };
};

type SecondAuthScreenRouteProp = RouteProp<LoginStackParamList, 'SecondAuth'>;
type SecondAuthScreenNavigationProp = NativeStackNavigationProp<LoginStackParamList, 'SecondAuth'>;

export default function SecondAuthScreen() {
  const route = useRoute<SecondAuthScreenRouteProp>();
  const navigation = useNavigation<SecondAuthScreenNavigationProp>();
  const { meterCode, userType } = route.params;
  
  const { loginReader, loginAdmin } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Credenciales válidas (en producción esto vendría de una base de datos)
  const validPasswords = {
    Lector: ['reader123', 'reader456', 'reader789'],
    Admin: ['admin2024']
  };

  const handlePasswordSubmit = () => {
    console.log('=== BOTÓN CLICKEADO EN SECOND AUTH ===');
    console.log('Contraseña ingresada:', password);
    console.log('Tipo de usuario:', userType);
    
    if (!password.trim()) {
      setError('Por favor ingresa la contraseña');
      return;
    }

    const isValidPassword = validPasswords[userType].includes(password.trim());
    console.log('Contraseña válida:', isValidPassword);
    
    if (!isValidPassword) {
      setError('Contraseña incorrecta');
      return;
    }

    setError(null);
    console.log('LOGIN EXITOSO - Procediendo con autenticación');
    
    // Login exitoso - navegación inmediata
    if (userType === 'Lector') {
      const readerNames = ['Juan Pérez', 'Ana López', 'Carlos Ruiz'];
      const readerIndex = validPasswords.Lector.indexOf(password.trim());
      const readerName = readerNames[readerIndex] || 'Lector';
      
      console.log('Lector detectado:', readerName);
      console.log('Llamando a loginReader...');
      loginReader(meterCode, readerName);
      console.log('loginReader ejecutado');
      
    } else {
      console.log('Admin detectado');
      console.log('Llamando a loginAdmin...');
      loginAdmin();
      console.log('loginAdmin ejecutado');
    }
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };



  const getIconAndColor = () => {
    if (userType === 'Lector') {
      return { icon: 'tachometer' as const, color: COLORS.orange };
    } else {
      return { icon: 'cog' as const, color: COLORS.darkBlue };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Encabezado con botón volver */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.base,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0'
      }}>
        <TouchableOpacity 
          onPress={handleBack}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm
          }}
        >
          <FontAwesome name="arrow-left" size={20} color={COLORS.darkBlue} />
          <Text style={{ 
            fontSize: FONT_SIZES.base, 
            color: COLORS.darkBlue,
            fontWeight: FONT_WEIGHTS.medium
          }}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: SPACING.lg, gap: SPACING.lg, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <FontAwesome name={icon} size={48} color={color} />
          <Text style={{ fontSize: 14, color: COLORS.darkGray, marginTop: 16, textAlign: 'center' }}>
            Código de medidor: {meterCode}
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.darkGray, marginTop: 4, textAlign: 'center' }}>
            Ingresa tu contraseña para continuar
          </Text>
        </View>

      <View>
        <AppInput
          label={`Contraseña de ${userType}`}
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          autoCapitalize="none"
        />
        
        {error && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <FontAwesome name="exclamation-triangle" size={14} color={COLORS.orange} />
            <Text style={{ color: COLORS.orange }}>{error}</Text>
          </View>
        )}
        
        <View style={{ marginTop: 16 }}>
          <AppButton 
            title={`Acceder como ${userType}`} 
            onPress={handlePasswordSubmit}
            style={{ backgroundColor: color }}
            disabled={false}
          />
        </View>
      </View>

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 12, color: COLORS.gray, textAlign: 'center' }}>
            {userType === 'Lector' 
              ? 'Contraseñas: reader123, reader456, reader789'
              : 'Contraseña: admin2024'
            }
          </Text>
          <Text style={{ fontSize: 10, color: COLORS.gray, textAlign: 'center', marginTop: 4 }}>
            ⚠️ Solo personal autorizado puede acceder como {userType.toLowerCase()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
