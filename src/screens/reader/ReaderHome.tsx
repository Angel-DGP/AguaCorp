import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppInput } from '@components/ui/AppInput';
import { AppButton } from '@components/ui/AppButton';
import { AppCard } from '@components/ui/AppCard';
import { addReading, findCustomerByIdOrMeter, getCurrentReading } from '@services/mockApi';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReaderStackParamList } from './ReaderStack';

export default function ReaderHome() {
  const [query, setQuery] = useState('M-1001');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [meter, setMeter] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [lastSavedReading, setLastSavedReading] = useState<any>(null);
  
  const nav = useNavigation<NativeStackNavigationProp<ReaderStackParamList>>();

  const onAccess = () => {
    const c = findCustomerByIdOrMeter(query.trim());
    if (!c) {
      setCustomerName(null);
      setMeter(null);
      setMessage('Cliente no encontrado');
      setMessageType('error');
      setLastSavedReading(null);
    } else {
      setCustomerName(`${c.name} (${c.cedula})`);
      setMeter(c.meterNumber);
      setMessage(null);
      setMessageType(null);
      setLastSavedReading(null);
    }
  };

  const onRegister = () => {
    if (!meter) return;
    const v = parseInt(value, 10);
    if (isNaN(v)) {
      setMessage('Ingrese una lectura válida');
      setMessageType('error');
      return;
    }
    
    const last = getCurrentReading(meter);
    const res = addReading(meter, v);
    
    setMessage(`Lectura guardada exitosamente. Diferencia: ${res.diff}. Anterior: ${last?.value ?? 0} → Actual: ${v}`);
    setMessageType('success');
    setValue('');
    setLastSavedReading(res);
  };

  const handleEditReading = () => {
    if (lastSavedReading && meter && customerName) {
      nav.navigate('ReaderEditReading', {
        readingId: lastSavedReading.id,
        meterNumber: meter,
        customerName
      });
    }
  };

  const showMessage = () => {
    if (!message) return null;
    
    return (
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: messageType === 'success' ? 12 : 0 }}>
          <FontAwesome 
            name={messageType === 'success' ? 'check-circle' : 'exclamation-triangle'} 
            size={20} 
            color={messageType === 'success' ? COLORS.green : COLORS.orange} 
          />
          <Text style={{ 
            color: messageType === 'success' ? COLORS.green : COLORS.orange,
            fontWeight: '600'
          }}>
            {message}
          </Text>
        </View>
        
        {/* Show edit button for successful readings */}
        {messageType === 'success' && lastSavedReading && (
          <View style={{ gap: 8 }}>
            <Text style={{ color: COLORS.darkGray, fontSize: 12, textAlign: 'center' }}>
              ¿Necesitas corregir algo de la lectura?
            </Text>
            <AppButton
              title="Editar lectura"
              onPress={handleEditReading}
              variant="secondary"
            />
          </View>
        )}
      </AppCard>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <FontAwesome name="search" size={20} color={COLORS.darkBlue} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.darkBlue }}>
            Acceder al medidor
          </Text>
        </View>
        
        <AppInput 
          label="QR/Cédula/Nº Medidor" 
          value={query} 
          onChangeText={setQuery} 
          placeholder="Ej: M-1001 o 0102030405"
        />
        <AppButton title="Buscar" onPress={onAccess} />
      </AppCard>

      {customerName && meter && (
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FontAwesome name="user" size={20} color={COLORS.green} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.green }}>
              Cliente encontrado
            </Text>
          </View>
          
          <View style={{ gap: 8, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome name="tachometer" size={16} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray }}>Medidor: {meter}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FontAwesome name="user" size={16} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray }}>Abonado: {customerName}</Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AppButton 
              title="Ver historial" 
              onPress={() => nav.navigate('ReaderHistory', { meterNumber: meter, customerName })} 
              variant="secondary" 
            />
          </View>
        </AppCard>
      )}

      {meter && (
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FontAwesome name="plus-circle" size={20} color={COLORS.orange} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.orange }}>
              Registrar nueva lectura
            </Text>
          </View>
          
          <AppInput 
            label="Lectura actual" 
            value={value} 
            onChangeText={setValue} 
            keyboardType="numeric" 
            placeholder="Ingrese el valor del medidor"
          />
          <AppButton title="Guardar lectura" onPress={onRegister} />
        </AppCard>
      )}

      {showMessage()}
    </ScrollView>
  );
}


