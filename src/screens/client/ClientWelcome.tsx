import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const last = useMemo(() => (
    currentCustomer ? getCurrentReading(currentCustomer.meterNumber) : undefined
  ), [currentCustomer]);

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setModalData({ title, message, type });
    setModalVisible(true);
  };

  const handlePaymentSimulation = () => {
    console.log('=== BOTÓN PAGAR CLICKEADO ===');
    console.log('currentCustomer:', currentCustomer);
    console.log('last reading:', last);
    
    if (!currentCustomer) {
      console.log('No hay cliente autenticado');
      showModal('Error', 'No hay cliente autenticado', 'error');
      return;
    }

    if (!last) {
      console.log('No hay lectura disponible');
      showModal('Error', 'No hay lectura disponible para pagar', 'error');
      return;
    }

    // Verificar si tiene datos bancarios
    const hasBankData = currentCustomer.bankName && 
                       currentCustomer.accountNumber && 
                       currentCustomer.accountType && 
                       currentCustomer.accountHolder;
    
    console.log('Datos bancarios:', {
      bankName: currentCustomer.bankName,
      accountNumber: currentCustomer.accountNumber,
      accountType: currentCustomer.accountType,
      accountHolder: currentCustomer.accountHolder
    });
    console.log('hasBankData:', hasBankData);

    if (!hasBankData) {
      Alert.alert(
        'Datos Bancarios Requeridos',
        'Para realizar el pago necesitas agregar tus datos bancarios primero.',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Agregar Datos',
            onPress: () => {
              console.log('Navegando a datos bancarios...');
              try {
                const tabNavigator = nav.getParent();
                if (tabNavigator) {
                  tabNavigator.navigate('ClientDataStack');
                } else {
                  console.log('No se pudo acceder al tab navigator');
                  Alert.alert('Error', 'No se pudo navegar a la sección de datos');
                }
              } catch (error) {
                console.log('Error en navegación:', error);
                Alert.alert('Error', 'Error al navegar a la sección de datos');
              }
            }
          }
        ]
      );
      return;
    }

    // Si tiene datos bancarios, mostrar modal de pago exitoso
    showModal(
      '✅ Pago Realizado Exitosamente',
      `Se ha procesado el pago de $${last.amount.toFixed(2)} por ${last.diff} m³ de consumo.\n\nMonto: $${last.amount.toFixed(2)}\nConsumo: ${last.diff} m³\n\nEsta es una simulación del sistema.`,
      'success'
    );
  };

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
        <AppCard style={{ ...SHADOWS.lg, borderLeftWidth: 4, borderLeftColor: COLORS.orange }}>
          {/* Header con gradiente */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9'
          }}>
            <View style={{ 
              backgroundColor: COLORS.orange, 
              padding: 12, 
              borderRadius: 12,
              ...SHADOWS.sm
            }}>
              <FontAwesome name="bar-chart" size={24} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.darkBlue, marginBottom: 2 }}>
                Última Lectura
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.gray }}>
                Información detallada de tu consumo
              </Text>
            </View>
          </View>
          
          {/* Información principal con cards */}
          <View style={{ gap: 16, marginBottom: 20 }}>
            {/* Fecha */}
            <View style={{ 
              backgroundColor: '#f8fafc', 
              padding: 12, 
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: COLORS.lightBlue
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <FontAwesome name="calendar" size={14} color={COLORS.lightBlue} />
                <Text style={{ color: COLORS.darkGray, fontSize: 12, fontWeight: '600' }}>FECHA DE LECTURA</Text>
              </View>
              <Text style={{ fontWeight: '700', color: COLORS.darkBlue, fontSize: 16 }}>
                {new Date(last.date).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Text>
            </View>

            {/* Valor actual */}
            <View style={{ 
              backgroundColor: '#f0f9ff', 
              padding: 12, 
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: COLORS.darkBlue
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <FontAwesome name="tachometer" size={14} color={COLORS.darkBlue} />
                <Text style={{ color: COLORS.darkGray, fontSize: 12, fontWeight: '600' }}>VALOR ACTUAL</Text>
              </View>
              <Text style={{ fontWeight: '700', color: COLORS.darkBlue, fontSize: 20 }}>
                {last.value} m³
              </Text>
            </View>

            {/* Consumo */}
            <View style={{ 
              backgroundColor: '#f0fdf4', 
              padding: 12, 
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: COLORS.lightBlue
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <FontAwesome name="tint" size={14} color={COLORS.lightBlue} />
                <Text style={{ color: COLORS.darkGray, fontSize: 12, fontWeight: '600' }}>CONSUMO</Text>
              </View>
              <Text style={{ fontWeight: '700', color: COLORS.lightBlue, fontSize: 18 }}>
                {last.diff} m³
              </Text>
            </View>

            {/* Monto a pagar */}
            <View style={{ 
              backgroundColor: '#fef3c7', 
              padding: 12, 
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: COLORS.orange
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <FontAwesome name="dollar" size={14} color={COLORS.orange} />
                <Text style={{ color: COLORS.darkGray, fontSize: 12, fontWeight: '600' }}>MONTO A PAGAR</Text>
              </View>
              <Text style={{ fontWeight: '700', color: COLORS.orange, fontSize: 22 }}>
                ${last.amount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Información de lectura anterior */}
          {(last.previousValue || last.previousDate || last.readerName) && (
            <>
              <View style={{ 
                height: 1, 
                backgroundColor: '#e2e8f0', 
                marginVertical: 16 
              }} />
              
              <View style={{ marginBottom: 20 }}>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  gap: 10, 
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f1f5f9'
                }}>
                  <View style={{ 
                    backgroundColor: COLORS.gray, 
                    padding: 8, 
                    borderRadius: 8 
                  }}>
                    <FontAwesome name="history" size={16} color={COLORS.white} />
                  </View>
                  <Text style={{ 
                    color: COLORS.darkGray, 
                    fontSize: 14, 
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}>
                    Lectura Anterior
                  </Text>
                </View>
                
                <View style={{ gap: 10, marginLeft: 8 }}>
                  {/* Lectura anterior */}
                  {last.previousValue && (
                    <View style={{ 
                      backgroundColor: '#f8fafc', 
                      padding: 10, 
                      borderRadius: 6,
                      borderLeftWidth: 2,
                      borderLeftColor: COLORS.gray
                    }}>
                      <Text style={{ color: COLORS.darkGray, fontSize: 11, fontWeight: '600', marginBottom: 2 }}>
                        VALOR ANTERIOR
                      </Text>
                      <Text style={{ fontWeight: '600', color: COLORS.darkBlue, fontSize: 14 }}>
                        {last.previousValue} m³
                      </Text>
                    </View>
                  )}
                  
                  {/* Fecha anterior */}
                  {last.previousDate && (
                    <View style={{ 
                      backgroundColor: '#f8fafc', 
                      padding: 10, 
                      borderRadius: 6,
                      borderLeftWidth: 2,
                      borderLeftColor: COLORS.gray
                    }}>
                      <Text style={{ color: COLORS.darkGray, fontSize: 11, fontWeight: '600', marginBottom: 2 }}>
                        FECHA ANTERIOR
                      </Text>
                      <Text style={{ fontWeight: '600', color: COLORS.darkBlue, fontSize: 14 }}>
                        {new Date(last.previousDate).toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </Text>
                    </View>
                  )}
                  
                  {/* Lector */}
                  {last.readerName && (
                    <View style={{ 
                      backgroundColor: '#f8fafc', 
                      padding: 10, 
                      borderRadius: 6,
                      borderLeftWidth: 2,
                      borderLeftColor: COLORS.gray
                    }}>
                      <Text style={{ color: COLORS.darkGray, fontSize: 11, fontWeight: '600', marginBottom: 2 }}>
                        LECTOR RESPONSABLE
                      </Text>
                      <Text style={{ fontWeight: '600', color: COLORS.darkBlue, fontSize: 14 }}>
                        {last.readerName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}

          {/* Botón de pagar mejorado */}
          <AppButton 
            title="💳 Pagar Ahora" 
            onPress={handlePaymentSimulation}
            style={{ 
              backgroundColor: COLORS.green,
              paddingVertical: 16,
              borderRadius: 12,
              ...SHADOWS.base
            }}
          />
        </AppCard>
      )}

      {/* Modal personalizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            ...SHADOWS.lg
          }}>
            {/* Header del modal */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <View style={{
                backgroundColor: modalData?.type === 'success' ? COLORS.green : 
                               modalData?.type === 'error' ? COLORS.orange : COLORS.lightBlue,
                padding: 8,
                borderRadius: 8,
                marginRight: 12
              }}>
                <FontAwesome 
                  name={modalData?.type === 'success' ? 'check' : 
                        modalData?.type === 'error' ? 'exclamation-triangle' : 'info-circle'} 
                  size={20} 
                  color={COLORS.white} 
                />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: COLORS.darkBlue,
                flex: 1
              }}>
                {modalData?.title}
              </Text>
            </View>

            {/* Mensaje del modal */}
            <Text style={{
              fontSize: 14,
              color: COLORS.darkGray,
              lineHeight: 20,
              marginBottom: 24
            }}>
              {modalData?.message}
            </Text>

            {/* Botón de cerrar */}
            <AppButton
              title="Entendido"
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: modalData?.type === 'success' ? COLORS.green : 
                               modalData?.type === 'error' ? COLORS.orange : COLORS.lightBlue
              }}
            />
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
