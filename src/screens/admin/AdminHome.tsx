import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { customers as dummyCustomers } from '@services/mockAdmin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AdminStackParamList } from './AdminStack';
import { AppInput } from '@components/ui/AppInput';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { 
  FONT_SIZES, 
  FONT_WEIGHTS, 
  SPACING, 
  BORDER_RADIUS, 
  SHADOWS, 
  ICON_SIZES,
  CARD_STYLES,
  BUTTON_STYLES,
  TEXT_STYLES,
  BADGE_STYLES
} from '../../constants/Styles';

const { width } = Dimensions.get('window');

export default function AdminHome() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrar clientes basado en la búsqueda
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return dummyCustomers;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return dummyCustomers.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.cedula.includes(query) ||
      customer.meterNumber.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleViewHistory = (customer: any) => {
    navigation.navigate('AdminUserHistory', {
      meterNumber: customer.meterNumber,
      customerName: customer.name,
      customerCedula: customer.cedula
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Generar datos adicionales para cada cliente
  const getCustomerStats = (customer: any) => {
    const randomReadings = Math.floor(Math.random() * 50) + 10;
    const randomLastReading = Math.floor(Math.random() * 1000) + 500;
    const randomStatus = Math.random() > 0.8 ? 'overdue' : 'current';
    const randomLastActivity = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    return {
      totalReadings: randomReadings,
      lastReading: randomLastReading,
      status: randomStatus,
      lastActivity: randomLastActivity.toLocaleDateString('es-ES'),
      averageConsumption: Math.floor(Math.random() * 50) + 20,
      paymentStatus: Math.random() > 0.7 ? 'pending' : 'paid'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return COLORS.red;
      case 'current': return COLORS.green;
      default: return COLORS.orange;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue': return 'Vencido';
      case 'current': return 'Al día';
      default: return 'Pendiente';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return COLORS.orange;
      case 'paid': return COLORS.green;
      default: return COLORS.gray;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      default: return 'Desconocido';
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: SPACING.lg }}>
      {/* Header scrolleable */}
      <View style={{ 
        backgroundColor: COLORS.white, 
        borderRadius: BORDER_RADIUS.lg, 
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.sm
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
          <FontAwesome name="users" size={ICON_SIZES.xl} color={COLORS.darkBlue} />
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: FONT_SIZES['2xl'], 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.darkBlue 
            }}>
              Gestión de Clientes
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.base, 
              color: COLORS.darkGray,
              marginTop: 2
            }}>
              Administra y busca información de clientes
            </Text>
          </View>
        </View>
        
        {/* Estadísticas rápidas */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.base }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="users" size={ICON_SIZES.lg} color={COLORS.darkBlue} />
            <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue, marginTop: SPACING.xs }}>
              {dummyCustomers.length}
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, textAlign: 'center' }}>Total Clientes</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="check-circle" size={ICON_SIZES.lg} color={COLORS.green} />
            <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.green, marginTop: SPACING.xs }}>
              {dummyCustomers.length - Math.floor(dummyCustomers.length * 0.2)}
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, textAlign: 'center' }}>Clientes Activos</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="clock-o" size={ICON_SIZES.lg} color={COLORS.orange} />
            <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange, marginTop: SPACING.xs }}>
              {Math.floor(dummyCustomers.length * 0.2)}
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, textAlign: 'center' }}>Clientes Inactivos</Text>
          </View>
        </View>
      </View>
        {/* Buscador de clientes */}
        <View style={{ marginBottom: SPACING.xl }}>
          <View style={{ position: 'relative' }}>
            <AppInput
              label="Buscar clientes"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por nombre, cédula o medidor..."
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
          style={{
                  position: 'absolute',
                  right: SPACING.base,
                  top: 32,
                  padding: SPACING.xs,
                  backgroundColor: COLORS.gray,
                  borderRadius: BORDER_RADIUS.full,
                }}
              >
                <FontAwesome name="times" size={ICON_SIZES.sm} color={COLORS.white} />
          </TouchableOpacity>
            )}
          </View>
          
          {/* Información de resultados */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: SPACING.sm,
            paddingHorizontal: SPACING.xs
          }}>
            <Text style={{ 
              fontSize: FONT_SIZES.base, 
              color: COLORS.darkGray 
            }}>
              {filteredCustomers.length} cliente{filteredCustomers.length !== 1 ? 's' : ''} encontrado{filteredCustomers.length !== 1 ? 's' : ''}
            </Text>
            {searchQuery.length > 0 && (
              <Text style={{ 
                fontSize: FONT_SIZES.sm, 
                color: COLORS.gray 
              }}>
                Búsqueda: "{searchQuery}"
              </Text>
            )}
          </View>
        </View>

        {/* Lista de clientes filtrados */}
        {filteredCustomers.length === 0 ? (
          <View style={{
            ...CARD_STYLES.base,
            padding: SPACING['3xl'],
            alignItems: 'center',
          }}>
            <FontAwesome name="search" size={ICON_SIZES['3xl']} color={COLORS.gray} />
            <Text style={{ 
              fontSize: FONT_SIZES.lg, 
              fontWeight: FONT_WEIGHTS.semibold, 
              color: COLORS.darkGray, 
              marginTop: SPACING.lg 
            }}>
              No se encontraron clientes
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.base, 
              color: COLORS.gray, 
              marginTop: SPACING.sm, 
              textAlign: 'center' 
            }}>
              {searchQuery.length > 0 
                ? `No hay clientes que coincidan con "${searchQuery}"`
                : 'No hay clientes registrados'
              }
            </Text>
          </View>
        ) : (
          filteredCustomers.map((customer: any) => {
            const stats = getCustomerStats(customer);
            return (
            <View
                key={customer.id}
              style={{
                  backgroundColor: COLORS.white,
                  borderRadius: BORDER_RADIUS.lg,
                  marginBottom: SPACING.lg,
                  ...SHADOWS.base,
                  overflow: 'hidden',
                }}
              >
                {/* Header del cliente */}
                <View style={{
                  backgroundColor: COLORS.darkBlue,
                  padding: SPACING.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: FONT_SIZES.xl, 
                      fontWeight: FONT_WEIGHTS.bold, 
                      color: COLORS.white,
                      marginBottom: SPACING.xs
                    }}>
                      {customer.name}
                    </Text>
                    <Text style={{ 
                      fontSize: FONT_SIZES.base, 
                      color: COLORS.white,
                      opacity: 0.9
                    }}>
                      {customer.meterNumber}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: getStatusColor(stats.status),
                    paddingHorizontal: SPACING.base,
                    paddingVertical: SPACING.xs,
                    borderRadius: BORDER_RADIUS.xl,
                  }}>
                    <Text style={{ 
                      color: COLORS.white, 
                      fontSize: FONT_SIZES.sm, 
                      fontWeight: FONT_WEIGHTS.semibold 
                    }}>
                      {getStatusText(stats.status)}
                    </Text>
                  </View>
                </View>

                {/* Información del cliente */}
                <View style={{ padding: SPACING.lg }}>
                  {/* Información básica */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    marginBottom: SPACING.lg 
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: FONT_SIZES.base, 
                        color: COLORS.darkGray, 
                        marginBottom: SPACING.xs 
                      }}>
                        📋 Cédula
                      </Text>
                      <Text style={{ 
                        fontSize: FONT_SIZES.lg, 
                        fontWeight: FONT_WEIGHTS.semibold, 
                        color: COLORS.darkBlue 
                      }}>
                        {customer.cedula}
                      </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={{ 
                        fontSize: FONT_SIZES.base, 
                        color: COLORS.darkGray, 
                        marginBottom: SPACING.xs 
                      }}>
                        💳 Estado de Pago
                      </Text>
                      <View style={{
                        backgroundColor: getPaymentStatusColor(stats.paymentStatus),
                        paddingHorizontal: SPACING.sm,
                        paddingVertical: SPACING.xs,
                        borderRadius: BORDER_RADIUS.base,
                      }}>
                        <Text style={{ 
                          color: COLORS.white, 
                          fontSize: FONT_SIZES.sm, 
                          fontWeight: FONT_WEIGHTS.semibold 
                        }}>
                          {getPaymentStatusText(stats.paymentStatus)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Estadísticas del cliente */}
                  <View style={{
                    backgroundColor: '#f8fafc',
                    padding: SPACING.lg,
                    borderRadius: BORDER_RADIUS.base,
                    marginBottom: SPACING.lg,
                  }}>
                    <Text style={TEXT_STYLES.cardTitle}>
                      📊 Estadísticas del Cliente
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES['2xl'], 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: COLORS.darkBlue 
                        }}>
                          {stats.totalReadings}
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Total Lecturas
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES['2xl'], 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: COLORS.orange 
                        }}>
                          {stats.lastReading}
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Última Lectura
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES['2xl'], 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: COLORS.green 
                        }}>
                          {stats.averageConsumption}
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Consumo Promedio
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Información adicional */}
                  <View style={{ marginBottom: SPACING.lg }}>
                    <Text style={{ 
                      fontSize: FONT_SIZES.base, 
                      color: COLORS.darkGray, 
                      marginBottom: SPACING.sm 
                    }}>
                      🕒 Última actividad: {stats.lastActivity}
                    </Text>
                  </View>

                  {/* Botón de acción */}
                  <TouchableOpacity 
                    onPress={() => handleViewHistory(customer)}
                    style={BUTTON_STYLES.primary}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                      <FontAwesome name="history" size={ICON_SIZES.base} color={COLORS.white} />
                      <Text style={{ 
                        color: COLORS.white, 
                        fontWeight: FONT_WEIGHTS.semibold, 
                        fontSize: FONT_SIZES.lg 
                      }}>
                        Ver Historial Completo
                      </Text>
                    </View>
                  </TouchableOpacity>
            </View>
        </View>
            );
          })
      )}
    </ScrollView>
  );
}
