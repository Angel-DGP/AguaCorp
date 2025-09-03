import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { customers, readers, readerAuditLogs } from '@services/mockAdmin';
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
  TAB_STYLES
} from '../../constants/Styles';

const { width } = Dimensions.get('window');

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalReaders = readers.length;
    const activeReaders = readers.filter(r => r.status === 'active').length;
    const totalReadings = readers.reduce((sum, r) => sum + r.totalReadings, 0);
    const totalChanges = readers.reduce((sum, r) => sum + r.totalChanges, 0);
    
    // Estadísticas de auditoría
    const totalAuditLogs = readerAuditLogs.length;
    const readingUpdates = readerAuditLogs.filter(log => log.action === 'reading_updated').length;
    const readingCreations = readerAuditLogs.filter(log => log.action === 'reading_created').length;
    const readingDeletions = readerAuditLogs.filter(log => log.action === 'reading_deleted').length;
    
    // Calcular métricas adicionales
    const averageReadingsPerReader = totalReadings / totalReaders;
    const averageChangesPerReader = totalChanges / totalReaders;
    const systemEfficiency = ((totalReadings - totalChanges) / totalReadings) * 100;
    
    // Generar datos de tendencias
    const weeklyTrend = [45, 52, 48, 61, 58, 55, 62];
    const monthlyTrend = [180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345];
    
    return {
      totalCustomers,
      totalReaders,
      activeReaders,
      totalReadings,
      totalChanges,
      totalAuditLogs,
      readingUpdates,
      readingCreations,
      readingDeletions,
      averageReadingsPerReader,
      averageChangesPerReader,
      systemEfficiency,
      weeklyTrend,
      monthlyTrend
    };
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle, trend, trendValue }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
  }) => (
    <View style={{
      backgroundColor: COLORS.white,
      padding: SPACING.base,
      borderRadius: BORDER_RADIUS.base,
      marginBottom: SPACING.sm,
      ...SHADOWS.sm,
      flex: 1,
      minHeight: 140,
    }}>
      {/* Fila del icono */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: SPACING.sm 
      }}>
        <View style={{
          backgroundColor: `${color}20`,
          padding: SPACING.sm,
          borderRadius: BORDER_RADIUS.sm,
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
        }}>
          <FontAwesome name={icon as any} size={ICON_SIZES.sm} color={color} />
        </View>
      </View>
      
      {/* Fila del valor */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: SPACING.xs 
      }}>
        <Text style={{ 
          fontSize: FONT_SIZES.xl, 
          fontWeight: FONT_WEIGHTS.bold, 
          color: color, 
          lineHeight: 24,
        }}>
          {value}
        </Text>
      </View>
      
      {/* Fila del título */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: SPACING.xs 
      }}>
        <Text style={{ 
          fontSize: FONT_SIZES.sm, 
          color: COLORS.darkGray, 
          fontWeight: FONT_WEIGHTS.medium,
          lineHeight: 16,
          textAlign: 'center',
          flexWrap: 'wrap',
        }}>
          {title}
        </Text>
      </View>
      
      {/* Fila del subtítulo */}
      {subtitle && (
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginBottom: SPACING.xs 
        }}>
          <Text style={{ 
            fontSize: FONT_SIZES.xs, 
            color: COLORS.gray, 
            lineHeight: 14,
            textAlign: 'center',
            flexWrap: 'wrap',
          }}>
            {subtitle}
          </Text>
        </View>
      )}
      
      {/* Fila del porcentaje/trend */}
      {trend && (
        <View style={{ 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: SPACING.xs,
          marginTop: SPACING.xs
        }}>
          <FontAwesome 
            name={trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'minus'} 
            size={ICON_SIZES.xs} 
            color={trend === 'up' ? COLORS.green : trend === 'down' ? COLORS.red : COLORS.gray} 
          />
          <Text style={{ 
            fontSize: FONT_SIZES.xs, 
            color: trend === 'up' ? COLORS.green : trend === 'down' ? COLORS.red : COLORS.gray,
            fontWeight: FONT_WEIGHTS.semibold,
            lineHeight: 12,
            textAlign: 'center',
          }}>
            {trendValue}
          </Text>
        </View>
      )}
    </View>
  );

  const ReportSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: SPACING.lg }}>
      <Text style={{
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.darkBlue,
        marginBottom: SPACING.base,
        paddingHorizontal: SPACING.base
      }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const PeriodSelector = () => (
    <View style={TAB_STYLES.container}>
      {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => setSelectedPeriod(period)}
          style={[
            TAB_STYLES.tab,
            selectedPeriod === period ? TAB_STYLES.activeTab : TAB_STYLES.inactiveTab
          ]}
        >
          <Text style={{
            color: selectedPeriod === period ? COLORS.white : COLORS.darkGray,
            fontSize: FONT_SIZES.base,
            fontWeight: selectedPeriod === period ? FONT_WEIGHTS.semibold : FONT_WEIGHTS.medium
          }}>
            {period === 'week' ? 'Semana' : 
             period === 'month' ? 'Mes' : 
             period === 'quarter' ? 'Trimestre' : 'Año'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const TrendChart = ({ data, title, color }: { data: number[], title: string, color: string }) => (
    <View style={{ backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: BORDER_RADIUS.base, marginBottom: SPACING.base, ...SHADOWS.base }}>
      <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue, marginBottom: SPACING.lg }}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: SPACING.xs }}>
        {data.map((value, index) => {
          const maxValue = Math.max(...data);
          const height = (value / maxValue) * 60;
          return (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{
                backgroundColor: color,
                width: 14,
                height: height,
                borderRadius: BORDER_RADIUS.base,
                opacity: 0.8,
              }} />
              <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.darkGray, marginTop: SPACING.xs }}>
                {value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING.lg }}>
      {/* Header scrolleable */}
      <View style={{ 
        backgroundColor: COLORS.white, 
        borderRadius: BORDER_RADIUS.base, 
        padding: SPACING.base,
        marginBottom: SPACING.base,
        ...SHADOWS.sm
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
          <FontAwesome name="bar-chart" size={ICON_SIZES.xl} color={COLORS.darkBlue} />
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: FONT_SIZES.xl, 
              fontWeight: FONT_WEIGHTS.bold, 
              color: COLORS.darkBlue 
            }}>
              Reportes y Estadísticas
            </Text>
            <Text style={{ 
              fontSize: FONT_SIZES.sm, 
              color: COLORS.darkGray,
              marginTop: 2
            }}>
              Análisis completo del sistema y actividad de usuarios
            </Text>
          </View>
        </View>
        
        {/* Selector de período */}
        <PeriodSelector />
      </View>
        {/* Resumen General */}
        <ReportSection title="📊 Resumen General">
          <View style={{ paddingHorizontal: SPACING.base }}>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: SPACING.sm
            }}>
              <View style={{ width: '48%' }}>
                <StatCard
                  title="Total Clientes Registrados en el Sistema"
                  value={stats.totalCustomers}
                  icon="users"
                  color={COLORS.darkBlue}
                  subtitle="Usuarios activos con servicios"
                  trend="up"
                  trendValue="+12% este mes"
                />
              </View>
              <View style={{ width: '48%' }}>
                <StatCard
                  title="Total Lectores de Medidores"
                  value={stats.totalReaders}
                  icon="user"
                  color={COLORS.orange}
                  subtitle={`${stats.activeReaders} lectores activos trabajando`}
                  trend="stable"
                  trendValue="Sin cambios recientes"
                />
              </View>
              <View style={{ width: '48%' }}>
                <StatCard
                  title="Total Lecturas Realizadas"
                  value={stats.totalReadings}
                  icon="tachometer"
                  color={COLORS.green}
                  subtitle="Mediciones completadas por lectores"
                  trend="up"
                  trendValue="+8% esta semana"
                />
              </View>
              <View style={{ width: '48%' }}>
                <StatCard
                  title="Eficiencia del Sistema"
                  value={`${stats.systemEfficiency.toFixed(1)}%`}
                  icon="bar-chart"
                  color={COLORS.red}
                  subtitle="Precisión en mediciones y reportes"
                  trend="up"
                  trendValue="+2.5% mejora"
                />
              </View>
            </View>
          </View>
        </ReportSection>

        {/* Métricas de Rendimiento */}
        <ReportSection title="🎯 Métricas de Rendimiento">
          <View style={{ paddingHorizontal: SPACING.base }}>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: SPACING.sm
            }}>
              <View style={{ width: '48%' }}>
                <StatCard
                  title="Promedio de Lecturas por Lector"
                  value={stats.averageReadingsPerReader.toFixed(1)}
                  icon="calculator"
                  color={COLORS.darkBlue}
                  subtitle="Número promedio de mediciones realizadas por cada lector en el período seleccionado"
                />
              </View>
              <View style={{ width: '48%' }}>
                <StatCard
                  title="Promedio de Cambios por Lector"
                  value={stats.averageChangesPerReader.toFixed(1)}
                  icon="edit"
                  color={COLORS.orange}
                  subtitle="Número promedio de modificaciones realizadas por cada lector en las lecturas"
                />
              </View>
            </View>
          </View>
        </ReportSection>

        {/* Actividad de Lectores */}
        <ReportSection title="📈 Actividad de Lectores">
          <View style={{ paddingHorizontal: SPACING.base }}>
            <View style={{
              backgroundColor: COLORS.white,
              padding: SPACING.xl,
              borderRadius: BORDER_RADIUS.lg,
              ...SHADOWS.base,
            }}>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue, marginBottom: SPACING.lg }}>
                Distribución de Actividades
              </Text>
              
              <View style={{ gap: SPACING.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.base }}>
                    <View style={{ 
                      backgroundColor: COLORS.green, 
                      padding: SPACING.base, 
                      borderRadius: BORDER_RADIUS.base 
                    }}>
                      <FontAwesome name="plus" size={ICON_SIZES.base} color={COLORS.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray, fontWeight: FONT_WEIGHTS.semibold }}>
                        Lecturas Creadas
                      </Text>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>
                        Nuevas lecturas registradas
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: FONT_SIZES['2xl'], fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>
                      {stats.readingCreations}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.green }}>
                      +15% vs mes anterior
                    </Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.base }}>
                    <View style={{ 
                      backgroundColor: COLORS.orange, 
                      padding: SPACING.base, 
                      borderRadius: BORDER_RADIUS.base 
                    }}>
                      <FontAwesome name="edit" size={ICON_SIZES.base} color={COLORS.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray, fontWeight: FONT_WEIGHTS.semibold }}>
                        Lecturas Actualizadas
                      </Text>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>
                        Correcciones realizadas
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: FONT_SIZES['2xl'], fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>
                      {stats.readingUpdates}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.orange }}>
                      +8% vs mes anterior
                    </Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.base }}>
                    <View style={{ 
                      backgroundColor: COLORS.red, 
                      padding: SPACING.base, 
                      borderRadius: BORDER_RADIUS.base 
                    }}>
                      <FontAwesome name="trash" size={ICON_SIZES.base} color={COLORS.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray, fontWeight: FONT_WEIGHTS.semibold }}>
                        Lecturas Eliminadas
                      </Text>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>
                        Registros duplicados removidos
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: FONT_SIZES['2xl'], fontWeight: FONT_WEIGHTS.bold, color: COLORS.red }}>
                      {stats.readingDeletions}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.red }}>
                      -5% vs mes anterior
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ReportSection>

        {/* Tendencias */}
        <ReportSection title="📊 Tendencias">
          <View style={{ paddingHorizontal: SPACING.base }}>
            <TrendChart 
              data={stats.weeklyTrend} 
              title="Tendencia Semanal de Lecturas" 
              color={COLORS.green} 
            />
            <TrendChart 
              data={stats.monthlyTrend.slice(0, 7)} 
              title="Tendencia Mensual de Actividad" 
              color={COLORS.orange} 
            />
          </View>
        </ReportSection>

        {/* Estado de Lectores */}
        <ReportSection title="👥 Estado de Lectores">
          <View style={{ paddingHorizontal: SPACING.base }}>
            <View style={{
              backgroundColor: COLORS.white,
              padding: SPACING.xl,
              borderRadius: BORDER_RADIUS.lg,
              ...SHADOWS.base,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: COLORS.green,
                    padding: SPACING.xl,
                    borderRadius: BORDER_RADIUS['2xl'],
                    marginBottom: SPACING.base
                  }}>
                    <FontAwesome name="check-circle" size={ICON_SIZES['3xl']} color={COLORS.white} />
                  </View>
                  <Text style={{ fontSize: FONT_SIZES['3xl'], fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>
                    {stats.activeReaders}
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>
                    Activos
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.green, marginTop: SPACING.xs }}>
                    +2 este mes
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: COLORS.orange,
                    padding: SPACING.xl,
                    borderRadius: BORDER_RADIUS['2xl'],
                    marginBottom: SPACING.base
                  }}>
                    <FontAwesome name="pause-circle" size={ICON_SIZES['3xl']} color={COLORS.white} />
                  </View>
                  <Text style={{ fontSize: FONT_SIZES['3xl'], fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>
                    {stats.totalReaders - stats.activeReaders}
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>
                    Inactivos
                  </Text>
                  <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.orange, marginTop: SPACING.xs }}>
                    -1 este mes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ReportSection>

        {/* Acciones Rápidas */}
        <ReportSection title="⚡ Acciones Rápidas">
          <View style={{ paddingHorizontal: SPACING.base, marginBottom: SPACING.lg }}>
            <View style={{ flexDirection: 'row', gap: SPACING.base }}>
              <TouchableOpacity style={{
                flex: 1,
                backgroundColor: COLORS.darkBlue,
                padding: SPACING.xl,
                borderRadius: BORDER_RADIUS.lg,
                alignItems: 'center',
                ...SHADOWS.lg,
              }}>
                <FontAwesome name="download" size={ICON_SIZES['2xl']} color={COLORS.white} />
                <Text style={{ color: COLORS.white, fontWeight: FONT_WEIGHTS.semibold, marginTop: SPACING.base, fontSize: FONT_SIZES.lg }}>
                  Exportar Reporte
                </Text>
                <Text style={{ color: COLORS.white, opacity: 0.8, marginTop: SPACING.xs, fontSize: FONT_SIZES.sm }}>
                  PDF, Excel, CSV
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={{
                flex: 1,
                backgroundColor: COLORS.orange,
                padding: SPACING.xl,
                borderRadius: BORDER_RADIUS.lg,
                alignItems: 'center',
                ...SHADOWS.lg,
              }}>
                <FontAwesome name="refresh" size={ICON_SIZES['2xl']} color={COLORS.white} />
                <Text style={{ color: COLORS.white, fontWeight: FONT_WEIGHTS.semibold, marginTop: SPACING.base, fontSize: FONT_SIZES.lg }}>
                  Actualizar Datos
                </Text>
                <Text style={{ color: COLORS.white, opacity: 0.8, marginTop: SPACING.xs, fontSize: FONT_SIZES.sm }}>
                  En tiempo real
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={{
              backgroundColor: COLORS.green,
              padding: SPACING.xl,
              borderRadius: BORDER_RADIUS.lg,
              alignItems: 'center',
              marginTop: SPACING.base,
              ...SHADOWS.lg,
            }}>
              <FontAwesome name="bar-chart" size={ICON_SIZES['2xl']} color={COLORS.white} />
              <Text style={{ color: COLORS.white, fontWeight: FONT_WEIGHTS.semibold, marginTop: SPACING.base, fontSize: FONT_SIZES.lg }}>
                Generar Análisis Avanzado
              </Text>
              <Text style={{ color: COLORS.white, opacity: 0.8, marginTop: SPACING.xs, fontSize: FONT_SIZES.sm }}>
                IA y Machine Learning
              </Text>
            </TouchableOpacity>
          </View>
        </ReportSection>
    </ScrollView>
  );
}
