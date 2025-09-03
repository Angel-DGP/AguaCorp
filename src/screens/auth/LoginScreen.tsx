import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@components/ui/AppButton';
import { AppInput } from '@components/ui/AppInput';
import { useAuth } from '@store/authContext';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginStackParamList = {
  Login: undefined;
  SecondAuth: {
    meterCode: string;
    userType: 'Lector' | 'Admin';
  };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<LoginStackParamList, 'Login'>;

export default function LoginScreen() {
  const { loginClient } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [meterCode, setMeterCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    console.log('=== BOTÓN CLICKEADO ===');
    console.log('LoginScreen - handleLogin called');
    
    if (!meterCode.trim()) {
      setError('Por favor ingresa el código del medidor');
      return;
    }

    setError(null);

    // Detectar si es un código especial para lector o admin
    const code = meterCode.trim();
    console.log('LoginScreen - handleLogin called with code:', code);
    
    // Códigos especiales para lectores (ocultos)
    if (code === 'L001' || code === 'L002' || code === 'L003') {
      console.log('LoginScreen - Detected Lector code, navigating to SecondAuth');
      navigation.navigate('SecondAuth', {
        meterCode: code,
        userType: 'Lector'
      });
      return;
    }
    
    // Código especial para admin (oculto)
    if (code === 'ADMIN' || code === 'admin') {
      console.log('LoginScreen - Detected Admin code, navigating to SecondAuth');
      navigation.navigate('SecondAuth', {
        meterCode: code,
        userType: 'Admin'
      });
      return;
    }

    // Intentar login como cliente
    console.log('LoginScreen - Attempting client login with code:', code);
    const clientResult = loginClient(code);
    console.log('LoginScreen - Client login result:', clientResult);
    
    if (clientResult.ok) {
      // Si es cliente, login exitoso
      console.log('LoginScreen - Client login successful');
      return;
    }

    // Si no es cliente ni código especial, mostrar error
    console.log('LoginScreen - No valid login found, showing error');
    setError('Código de medidor no válido');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1,
          padding: 16,
          justifyContent: 'center'
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Image
            source={require('../../img/logo.jpeg')}
            style={{
              width: 120,
              height: 120,
              resizeMode: 'contain',
              marginBottom: 16,
            }}
          />
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.darkBlue, marginTop: 16 }}>
            Agua Corp
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.darkGray, marginTop: 8 }}>
            Sistema de Gestión de Agua
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.darkBlue, marginBottom: 8 }}>
            Ingresa tu código de medidor
          </Text>
        </View>

        <View>
          <AppInput
            label="Código del Medidor"
            value={meterCode}
            onChangeText={setMeterCode}
            placeholder="M-1001"
            autoCapitalize="characters"
            autoCorrect={false}
          />
          
          {error && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <FontAwesome name="exclamation-triangle" size={14} color={COLORS.orange} />
              <Text style={{ color: COLORS.orange }}>{error}</Text>
            </View>
          )}
          
          <View style={{ marginTop: 16, gap: 12 }}>
            <AppButton 
              title="Acceder" 
              onPress={handleLogin}
              style={{ backgroundColor: COLORS.lightBlue }}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 12, color: COLORS.gray, textAlign: 'center' }}>
            Ingresa tu código de medidor para acceder al sistema
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


