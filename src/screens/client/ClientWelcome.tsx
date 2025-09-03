import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppButton } from '@components/ui/AppButton';
import { AppCard } from '@components/ui/AppCard';
import { useAuth } from '@store/authContext';
import { getCurrentReading } from '@services/mockApi';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ClientReadingsStackParamList } from './ClientReadingsStack';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS, ICON_SIZES } from '../../constants/Styles';

export default function ClientWelcome() {
  const { currentCustomer } = useAuth();
  const nav = useNavigation<NativeStackNavigationProp<ClientReadingsStackParamList>>();

  const last = useMemo(() => (
    currentCustomer ? getCurrentReading(currentCustomer.meterNumber) : undefined
  ), [currentCustomer]);

  if (!currentCustomer) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No hay cliente autenticado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      {/* Información del cliente - Diseño bonito */}
      <View style={{ 
        backgroundColor: '#f8fafc',
        borderRadius: BORDER_RADIUS.xl, 
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        ...SHADOWS.lg,
        borderWidth: 1,
        borderColor: '#e2e8f0'
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: SPACING.lg 
        }}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: COLORS.darkBlue,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SPACING.base,
            ...SHADOWS.sm
          }}>
            <FontAwesome name="user" size={24} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: FONT_SIZES['2xl'], 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.darkBlue,
              marginBottom: 2
            }}>
              ¡Hola, {currentCustomer.name}!
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              color: COLORS.darkGray,
              opacity: 0.8
            }}>
              Bienvenido a tu panel de control
            </Text>
          </View>
        </View>
        
        <View style={{ 
          backgroundColor: COLORS.white,
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.lg,
          ...SHADOWS.sm
        }}>
          <View style={{ gap: SPACING.base }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: SPACING.sm
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#fef3c7',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: SPACING.base
              }}>
                <FontAwesome name="tachometer" size={18} color="#f59e0b" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: FONT_SIZES.sm, 
                  color: COLORS.darkGray,
                  fontWeight: FONT_WEIGHTS.medium,
                  marginBottom: 2
                }}>
                  Número de Medidor
                </Text>
                <Text style={{ 
                  fontSize: FONT_SIZES.lg, 
                  color: COLORS.darkBlue,
                  fontWeight: FONT_WEIGHTS.bold
                }}>
                  {currentCustomer.meterNumber}
                </Text>
              </View>
            </View>
            
            <View style={{ 
              height: 1, 
              backgroundColor: '#f1f5f9',
              marginVertical: SPACING.sm 
            }} />
            
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              paddingVertical: SPACING.sm
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#dbeafe',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: SPACING.base
              }}>
                <FontAwesome name="id-card" size={18} color={COLORS.lightBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontSize: FONT_SIZES.sm, 
                  color: COLORS.darkGray,
                  fontWeight: FONT_WEIGHTS.medium,
                  marginBottom: 2
                }}>
                  Cédula de Identidad
                </Text>
                <Text style={{ 
                  fontSize: FONT_SIZES.lg, 
                  color: COLORS.darkBlue,
                  fontWeight: FONT_WEIGHTS.bold
                }}>
                  {currentCustomer.cedula}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {last && (
        <AppCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FontAwesome name="bar-chart" size={20} color={COLORS.orange} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.orange }}>Última lectura</Text>
          </View>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: COLORS.darkGray }}>Valor</Text>
              <Text style={{ fontWeight: '600', color: COLORS.darkBlue }}>{last.value} m³</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: COLORS.darkGray }}>Consumo</Text>
              <Text style={{ fontWeight: '600', color: COLORS.lightBlue }}>{last.diff} m³</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: COLORS.darkGray }}>Monto</Text>
              <Text style={{ fontWeight: '700', color: COLORS.orange }}>${last.amount.toFixed(2)}</Text>
            </View>
            <AppButton title="Ver detalle" onPress={() => nav.navigate('ClientReadingDetails', { readingId: last.id })} variant="secondary" />
          </View>
        </AppCard>
      )}

      {/* Acciones de Lecturas */}
      <View style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={() => nav.navigate('ClientHistory')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING.sm,
            backgroundColor: COLORS.darkBlue,
            paddingVertical: SPACING.lg,
            paddingHorizontal: SPACING.lg,
            borderRadius: BORDER_RADIUS.base,
            ...SHADOWS.sm,
            marginTop: SPACING.base,
          }}
        >
          <FontAwesome name="history" size={18} color={COLORS.white} />
          <Text style={{
            color: COLORS.white,
            fontSize: FONT_SIZES.base,
            fontWeight: FONT_WEIGHTS.semibold,
          }}>
            Historial de lecturas
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
