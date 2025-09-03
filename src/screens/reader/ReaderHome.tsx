import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { AppInput } from '@components/ui/AppInput';
import { AppButton } from '@components/ui/AppButton';
import { AppCard } from '@components/ui/AppCard';
import { addReading, findCustomerByIdOrMeter, getCurrentReading } from '../../services/mockApi';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS, ICON_SIZES } from '../../constants/Styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReaderStackParamList } from './ReaderStack';
import * as BarCodeScanner from 'expo-barcode-scanner';

export default function ReaderHome() {
  const [query, setQuery] = useState('M-1001');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [meter, setMeter] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [lastSavedReading, setLastSavedReading] = useState<any>(null);
  
  const nav = useNavigation<NativeStackNavigationProp<ReaderStackParamList>>();

  // Información del lector (en una app real esto vendría del contexto de autenticación)
  const readerInfo = {
    name: 'Juan Pérez',
    code: 'L-001',
    id: 'reader-001',
    totalReadings: 156,
    lastActivity: '2024-01-15'
  };

  const handleQRScan = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la cámara');
        return;
      }

      // Simular escaneo de QR (en una app real usarías BarCodeScanner)
      Alert.alert(
        'Escanear Código QR',
        '¿Qué tipo de código quieres escanear?',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Medidor M-1001',
            onPress: () => {
              setQuery('M-1001');
              onAccess();
            }
          },
          {
            text: 'Medidor M-1002',
            onPress: () => {
              setQuery('M-1002');
              onAccess();
            }
          },
          {
            text: 'Cédula 0102030405',
            onPress: () => {
              setQuery('0102030405');
              onAccess();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error scanning QR:', error);
      Alert.alert('Error', 'No se pudo acceder al escáner de códigos QR');
    }
  };

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
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING.xl }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      {/* Header con logo y información del lector */}
      <AppCard>
        <View style={{ alignItems: 'center', marginBottom: SPACING.base }}>
          <Image 
            source={require('../../img/logo.jpeg')}
            style={{
              width: 80,
              height: 80,
              resizeMode: 'contain',
              marginBottom: SPACING.sm,
            }}
          />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue, marginBottom: SPACING.xs }}>
            Agua Corp
          </Text>
          <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray }}>
            Sistema de Lectura de Medidores
          </Text>
        </View>
        
        <View style={{ 
          backgroundColor: COLORS.lightBlue + '20', 
          padding: SPACING.base, 
          borderRadius: BORDER_RADIUS.sm,
          marginTop: SPACING.sm
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
            <FontAwesome name="user" size={ICON_SIZES.base} color={COLORS.darkBlue} />
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>
              Información del Lector
            </Text>
          </View>
          
          <View style={{ gap: SPACING.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <FontAwesome name="id-card" size={ICON_SIZES.sm} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>
                <Text style={{ fontWeight: FONT_WEIGHTS.semibold }}>Nombre:</Text> {readerInfo.name}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <FontAwesome name="tag" size={ICON_SIZES.sm} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>
                <Text style={{ fontWeight: FONT_WEIGHTS.semibold }}>Código:</Text> {readerInfo.code}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <FontAwesome name="tachometer" size={ICON_SIZES.sm} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>
                <Text style={{ fontWeight: FONT_WEIGHTS.semibold }}>Lecturas realizadas:</Text> {readerInfo.totalReadings}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <FontAwesome name="clock-o" size={ICON_SIZES.sm} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>
                <Text style={{ fontWeight: FONT_WEIGHTS.semibold }}>Última actividad:</Text> {new Date(readerInfo.lastActivity).toLocaleDateString('es-ES')}
              </Text>
            </View>
          </View>
        </View>
      </AppCard>
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="search" size={ICON_SIZES.base} color={COLORS.darkBlue} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>
            Acceder al Medidor
          </Text>
        </View>
        
        <View style={{ marginBottom: SPACING.base }}>
          <Text style={{ 
            fontSize: FONT_SIZES.sm, 
            fontWeight: FONT_WEIGHTS.semibold, 
            color: COLORS.darkGray, 
            marginBottom: SPACING.xs 
          }}>
            QR/Cédula/Nº Medidor
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <View style={{ flex: 1 }}>
              <AppInput 
                label=""
                value={query} 
                onChangeText={setQuery} 
                placeholder="Ej: M-1001 o 0102030405"
              />
            </View>
            <TouchableOpacity
              onPress={handleQRScan}
              style={{
                backgroundColor: COLORS.lightBlue,
                padding: SPACING.sm,
                borderRadius: BORDER_RADIUS.sm,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 50,
                height: 50,
                ...SHADOWS.sm
              }}
            >
              <FontAwesome name="qrcode" size={ICON_SIZES.base} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <AppButton title="Buscar" onPress={onAccess} />
      </AppCard>

      {customerName && meter && (
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
            <FontAwesome name="check-circle" size={ICON_SIZES.base} color={COLORS.green} />
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>
              Cliente Encontrado
            </Text>
          </View>
          
          <View style={{ gap: SPACING.sm, marginBottom: SPACING.base }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <FontAwesome name="tachometer" size={ICON_SIZES.sm} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>
                <Text style={{ fontWeight: FONT_WEIGHTS.semibold }}>Medidor:</Text> {meter}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <FontAwesome name="user" size={ICON_SIZES.sm} color={COLORS.darkGray} />
              <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>
                <Text style={{ fontWeight: FONT_WEIGHTS.semibold }}>Abonado:</Text> {customerName}
              </Text>
            </View>
          </View>

          <View style={{ gap: SPACING.sm }}>
            <AppButton 
              title="Ver Historial" 
              onPress={() => nav.navigate('ReaderHistory', { meterNumber: meter, customerName })} 
              variant="secondary" 
            />
          </View>
        </AppCard>
      )}

      {meter && customerName && (
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
            <FontAwesome name="plus-circle" size={ICON_SIZES.base} color={COLORS.orange} />
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>
              Registrar Nueva Lectura
            </Text>
          </View>
          
          <Text style={{ color: COLORS.darkGray, marginBottom: SPACING.base, textAlign: 'center', fontSize: FONT_SIZES.sm }}>
            Accede a la pantalla completa para registrar una nueva lectura con todos los detalles
          </Text>
          
          <AppButton 
            title="Nueva Lectura Completa" 
            onPress={() => {
              const customer = findCustomerByIdOrMeter(query.trim());
              if (customer) {
                const lastReading = getCurrentReading(meter);
                nav.navigate('ReaderAddReading', {
                  meterNumber: meter,
                  customerName: customer.name,
                  customerCedula: customer.cedula,
                  lastReading: lastReading?.value || 0
                });
              }
            }}
          />
        </AppCard>
      )}

      {showMessage()}
    </ScrollView>
  );
}


