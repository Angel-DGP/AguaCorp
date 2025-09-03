import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { readers as dummyReaders } from '@services/mockAdmin';
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
  FILTER_STYLES
} from '../../constants/Styles';

const { width } = Dimensions.get('window');

export default function AdminReaders() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  
  // Filtrar lectores basado en la búsqueda y estado
  const filteredReaders = useMemo(() => {
    let filtered = dummyReaders;
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reader => reader.status === statusFilter);
    }
    
    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(reader => 
        reader.name.toLowerCase().includes(query) ||
        reader.code.toLowerCase().includes(query) ||
        reader.email.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, statusFilter]);

  const handleViewHistory = (reader: any) => {
    navigation.navigate('AdminReaderHistory', {
      readerId: reader.id,
      readerName: reader.name,
      readerCode: reader.code
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.green;
      case 'inactive': return COLORS.orange;
      case 'suspended': return COLORS.red;
      default: return COLORS.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return 'Desconocido';
    }
  };

  // Generar datos adicionales para cada lector
  const getReaderStats = (reader: any) => {
    const randomEfficiency = Math.floor(Math.random() * 30) + 70; // 70-100%
    const randomAccuracy = Math.floor(Math.random() * 15) + 85; // 85-100%
    const randomLastLocation = ['Sector Norte', 'Sector Sur', 'Sector Este', 'Sector Oeste'][Math.floor(Math.random() * 4)];
    const randomNextScheduled = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      efficiency: randomEfficiency,
      accuracy: randomAccuracy,
      lastLocation: randomLastLocation,
      nextScheduled: randomNextScheduled.toLocaleDateString('es-ES'),
      averageReadingsPerDay: Math.floor(reader.totalReadings / 30) + Math.floor(Math.random() * 5),
      totalRevenue: Math.floor(reader.totalReadings * 0.5) + Math.floor(Math.random() * 100)
    };
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return COLORS.green;
    if (efficiency >= 80) return COLORS.orange;
    return COLORS.red;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return COLORS.green;
    if (accuracy >= 90) return COLORS.orange;
    return COLORS.red;
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
          <FontAwesome name="user" size={ICON_SIZES.xl} color={COLORS.darkBlue} />
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: FONT_SIZES['2xl'], 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.darkBlue 
            }}>
              Gestión de Lectores
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.base, 
              color: COLORS.darkGray,
              marginTop: 2
            }}>
              Administra lectores y revisa su actividad
            </Text>
          </View>
        </View>
        
        {/* Estadísticas rápidas */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginTop: SPACING.base
        }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="users" size={ICON_SIZES.lg} color={COLORS.darkBlue} />
            <Text style={{ 
              fontSize: FONT_SIZES.xl, 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.darkBlue,
              marginTop: SPACING.xs
            }}>
              {dummyReaders.length}
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              color: COLORS.darkGray,
              textAlign: 'center'
            }}>
              Total Lectores
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="check-circle" size={ICON_SIZES.lg} color={COLORS.green} />
            <Text style={{ 
              fontSize: FONT_SIZES.xl, 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.green,
              marginTop: SPACING.xs
            }}>
              {dummyReaders.filter(r => r.status === 'active').length}
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              color: COLORS.darkGray,
              textAlign: 'center'
            }}>
              Lectores Activos
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="clock-o" size={ICON_SIZES.lg} color={COLORS.orange} />
            <Text style={{ 
              fontSize: FONT_SIZES.xl, 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.orange,
              marginTop: SPACING.xs
            }}>
              {dummyReaders.filter(r => r.status === 'inactive').length}
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              color: COLORS.darkGray,
              textAlign: 'center'
            }}>
              Lectores Inactivos
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <FontAwesome name="ban" size={ICON_SIZES.lg} color={COLORS.red} />
            <Text style={{ 
              fontSize: FONT_SIZES.xl, 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.red,
              marginTop: SPACING.xs
            }}>
              {dummyReaders.filter(r => r.status === 'suspended').length}
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              color: COLORS.darkGray,
              textAlign: 'center'
            }}>
              Lectores Suspendidos
            </Text>
          </View>
        </View>
      </View>
        {/* Filtros */}
        <View style={{ marginBottom: SPACING.xl }}>
          {/* Buscador */}
          <View style={{ position: 'relative', marginBottom: SPACING.lg }}>
            <AppInput
              label="Buscar lectores"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por nombre, código o email..."
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
          
          {/* Filtros de estado */}
          <View style={FILTER_STYLES.container}>
            {(['all', 'active', 'inactive', 'suspended'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                style={[
                  FILTER_STYLES.filter,
                  statusFilter === status ? FILTER_STYLES.activeFilter : FILTER_STYLES.inactiveFilter
                ]}
              >
                <Text style={{
                  color: statusFilter === status ? COLORS.white : COLORS.darkGray,
                  fontSize: FONT_SIZES.sm,
                  fontWeight: statusFilter === status ? FONT_WEIGHTS.semibold : FONT_WEIGHTS.medium
                }}>
                  {status === 'all' ? 'Todos' : getStatusText(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información de resultados */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base, paddingHorizontal: SPACING.xs }}>
          <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray }}>
            {filteredReaders.length} resultados
          </Text>
          {(searchQuery.length > 0 || statusFilter !== 'all') && (
            <FontAwesome name="filter" size={ICON_SIZES.base} color={COLORS.gray} />
          )}
        </View>

        {/* Lista de lectores filtrados */}
        {filteredReaders.length === 0 ? (
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
              No se encontraron lectores
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.base, 
              color: COLORS.gray, 
              marginTop: SPACING.sm, 
              textAlign: 'center' 
            }}>
              {searchQuery.length > 0 || statusFilter !== 'all'
                ? 'No hay lectores que coincidan con los filtros aplicados'
                : 'No hay lectores registrados'
              }
            </Text>
          </View>
        ) : (
          filteredReaders.map((reader: any) => {
            const stats = getReaderStats(reader);
            return (
              <View
                key={reader.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: BORDER_RADIUS.lg,
                  marginBottom: SPACING.lg,
                  ...SHADOWS.base,
                  overflow: 'hidden',
                }}
              >
                {/* Header del lector */}
                <View style={{
                  backgroundColor: getStatusColor(reader.status),
                  padding: SPACING.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.white, marginBottom: SPACING.xs }}>
                      {reader.name}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.white, opacity: 0.9 }}>
                      Código: {reader.code}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    paddingHorizontal: SPACING.base,
                    paddingVertical: SPACING.xs,
                    borderRadius: BORDER_RADIUS.xl,
                  }}>
                    <Text style={{ 
                      color: COLORS.white, 
                      fontSize: FONT_SIZES.sm, 
                      fontWeight: FONT_WEIGHTS.semibold 
                    }}>
                      {getStatusText(reader.status)}
                    </Text>
                  </View>
                </View>

                {/* Información del lector */}
                <View style={{ padding: SPACING.lg }}>
                  {/* Información de contacto */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    marginBottom: SPACING.lg 
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, marginBottom: SPACING.xs }}>
                        📧 Email
                      </Text>
                      <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkBlue }}>
                        {reader.email}
                      </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, marginBottom: SPACING.xs }}>
                        📱 Teléfono
                      </Text>
                      <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkBlue }}>
                        {reader.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Estadísticas principales */}
                  <View style={{
                    backgroundColor: '#f8fafc',
                    padding: SPACING.lg,
                    borderRadius: BORDER_RADIUS.base,
                    marginBottom: SPACING.lg,
                  }}>
                    <Text style={TEXT_STYLES.cardTitle}>
                      📊 Estadísticas Principales
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.base }}>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES['2xl'], 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: COLORS.darkBlue 
                        }}>
                          {reader.totalReadings}
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
                          {reader.totalChanges}
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Total Cambios
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES['2xl'], 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: COLORS.green 
                        }}>
                          {stats.averageReadingsPerDay}
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Promedio/Día
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Métricas de rendimiento */}
                  <View style={{
                    backgroundColor: '#f8fafc',
                    padding: SPACING.lg,
                    borderRadius: BORDER_RADIUS.base,
                    marginBottom: SPACING.lg,
                  }}>
                    <Text style={TEXT_STYLES.cardTitle}>
                      🎯 Métricas de Rendimiento
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.base }}>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES.xl, 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: getEfficiencyColor(stats.efficiency)
                        }}>
                          {stats.efficiency}%
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Eficiencia
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES.xl, 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: getAccuracyColor(stats.accuracy)
                        }}>
                          {stats.accuracy}%
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Precisión
                        </Text>
                      </View>
                      <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES.xl, 
                          fontWeight: FONT_WEIGHTS.bold, 
                          color: COLORS.orange 
                        }}>
                          ${stats.totalRevenue}
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.sm, 
                          color: COLORS.darkGray 
                        }}>
                          Ingresos
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Información adicional */}
                  <View style={{ 
                    backgroundColor: '#f8fafc',
                    padding: SPACING.lg,
                    borderRadius: BORDER_RADIUS.base,
                    marginBottom: SPACING.lg,
                  }}>
                    <Text style={TEXT_STYLES.cardTitle}>
                      📍 Información Adicional
                    </Text>
                    <View style={{ gap: SPACING.sm }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES.base, 
                          color: COLORS.darkGray 
                        }}>
                          🕒 Última actividad:
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.base, 
                          fontWeight: FONT_WEIGHTS.medium, 
                          color: COLORS.darkBlue 
                        }}>
                          {reader.lastActive}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES.base, 
                          color: COLORS.darkGray 
                        }}>
                          📍 Última ubicación:
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.base, 
                          fontWeight: FONT_WEIGHTS.medium, 
                          color: COLORS.darkBlue 
                        }}>
                          {stats.lastLocation}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ 
                          fontSize: FONT_SIZES.base, 
                          color: COLORS.darkGray 
                        }}>
                          📅 Próxima programada:
                        </Text>
                        <Text style={{ 
                          fontSize: FONT_SIZES.base, 
                          fontWeight: FONT_WEIGHTS.medium, 
                          color: COLORS.darkBlue 
                        }}>
                          {stats.nextScheduled}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Botón de acción */}
                  <TouchableOpacity 
                    onPress={() => handleViewHistory(reader)}
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
