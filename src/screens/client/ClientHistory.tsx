import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform, useWindowDimensions, TouchableOpacity } from 'react-native';
import { AppCard } from '@components/ui/AppCard';
import { useAuth } from '@store/authContext';
import { getHistory, formatMonth } from '@services/mockApi';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ClientReadingsStackParamList } from './ClientReadingsStack';
import { BarChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS, SHADOWS, ICON_SIZES } from '../../constants/Styles';

export default function ClientHistory() {
  const { currentCustomer } = useAuth();
  const nav = useNavigation<NativeStackNavigationProp<ClientReadingsStackParamList>>();
  const history = useMemo(() => (
    currentCustomer ? getHistory(currentCustomer.meterNumber) : []
  ), [currentCustomer]);

  const years = useMemo(() => {
    const set = new Set<number>();
    history.forEach((r) => set.add(new Date(r.date).getFullYear()));
    return Array.from(set).sort((a, b) => a - b);
  }, [history]);

  const latestYear = useMemo(() => (
    years.length > 0 ? years[years.length - 1] : new Date().getFullYear()
  ), [years]);

  const [selectedYear, setSelectedYear] = useState<number>(latestYear);
  useEffect(() => {
    setSelectedYear(latestYear);
  }, [latestYear]);

  const filtered = useMemo(() => history.filter((r) => new Date(r.date).getFullYear() === selectedYear), [history, selectedYear]);

  const valuesByMonth = useMemo(() => {
    const arr = new Array<number>(12).fill(0);
    filtered.forEach((r) => {
      const m = new Date(r.date).getMonth(); // 0-11
      arr[m] = r.diff;
    });
    return arr;
  }, [filtered]);

  if (!currentCustomer) {
    return (
      <View style={{ flex: 1, padding: SPACING.lg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.gray }}>No hay cliente autenticado.</Text>
      </View>
    );
  }

  const labels = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')), []);
  const values = valuesByMonth;
  const maxValue = Math.max(...values, 1);
  const anomalies = values.map((v) => (v > (maxValue * 0.8) ? COLORS.orange : COLORS.lightBlue));

  const textStyle = { fontFamily: Platform.select({ ios: 'Helvetica Neue', android: 'Roboto', default: 'System' }) } as const;
  const { width: windowWidth } = useWindowDimensions();
  const chartWidth = Math.max(240, Math.min(windowWidth - 64, 800));

  // Estadísticas calculadas
  const totalConsumption = filtered.reduce((sum, r) => sum + r.diff, 0);
  const totalAmount = filtered.reduce((sum, r) => sum + r.amount, 0);
  const averageConsumption = filtered.length > 0 ? totalConsumption / filtered.length : 0;
  const paidCount = filtered.filter(r => r.paid).length;
  const pendingCount = filtered.length - paidCount;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.lg, paddingBottom: SPACING.xl }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      {/* Header con selector de año */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <View style={{ backgroundColor: COLORS.darkBlue, padding: SPACING.sm, borderRadius: BORDER_RADIUS.base }}>
              <FontAwesome name="bar-chart" size={ICON_SIZES.lg} color={COLORS.white} />
            </View>
            <View>
              <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>Estadísticas de Consumo</Text>
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>Análisis detallado de tus lecturas</Text>
            </View>
          </View>
        </View>

        {/* Selector de año mejorado */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.lg }}>
          <TouchableOpacity
            onPress={() => setSelectedYear((y) => Math.max(years[0] ?? y - 1, y - 1))}
            disabled={years.length === 0 || selectedYear <= years[0]}
            style={{
              backgroundColor: years.length === 0 || selectedYear <= years[0] ? COLORS.gray : COLORS.darkBlue,
              padding: SPACING.sm,
              borderRadius: BORDER_RADIUS.base,
              opacity: years.length === 0 || selectedYear <= years[0] ? 0.5 : 1,
            }}
          >
            <FontAwesome name="chevron-left" size={ICON_SIZES.base} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={{ backgroundColor: COLORS.lightBlue, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.base }}>
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.white }}>{selectedYear}</Text>
          </View>
          
          <TouchableOpacity
            onPress={() => setSelectedYear((y) => Math.min(years[years.length - 1] ?? y + 1, y + 1))}
            disabled={years.length === 0 || selectedYear >= years[years.length - 1]}
            style={{
              backgroundColor: years.length === 0 || selectedYear >= years[years.length - 1] ? COLORS.gray : COLORS.darkBlue,
              padding: SPACING.sm,
              borderRadius: BORDER_RADIUS.base,
              opacity: years.length === 0 || selectedYear >= years[years.length - 1] ? 0.5 : 1,
            }}
          >
            <FontAwesome name="chevron-right" size={ICON_SIZES.base} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </AppCard>

      {/* Estadísticas resumen */}
      <View style={{ flexDirection: 'row', gap: SPACING.base }}>
        <View style={{ flex: 1, backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: BORDER_RADIUS.base, ...SHADOWS.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
            <FontAwesome name="tint" size={ICON_SIZES.base} color={COLORS.lightBlue} />
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>Total Consumo</Text>
          </View>
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>{totalConsumption} m³</Text>
        </View>
        
        <View style={{ flex: 1, backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: BORDER_RADIUS.base, ...SHADOWS.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
            <FontAwesome name="money" size={ICON_SIZES.base} color={COLORS.orange} />
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>Total Monto</Text>
          </View>
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>${totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: SPACING.base }}>
        <View style={{ flex: 1, backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: BORDER_RADIUS.base, ...SHADOWS.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
            <FontAwesome name="line-chart" size={ICON_SIZES.base} color={COLORS.green} />
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>Promedio</Text>
          </View>
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>{averageConsumption.toFixed(1)} m³</Text>
        </View>
        
        <View style={{ flex: 1, backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: BORDER_RADIUS.base, ...SHADOWS.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
            <FontAwesome name="check-circle" size={ICON_SIZES.base} color={COLORS.green} />
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>Pagados</Text>
          </View>
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>{paidCount}</Text>
        </View>
      </View>

      {/* Gráfico mejorado - Fuera del card */}
      <View style={{ marginBottom: SPACING.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg }}>
          <FontAwesome name="bar-chart" size={ICON_SIZES.lg} color={COLORS.darkBlue} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Consumo Mensual</Text>
        </View>
        
        {/* Contenedor con scroll horizontal */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ 
            paddingHorizontal: SPACING.base,
            paddingRight: SPACING.xl
          }}
          style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: BORDER_RADIUS.base,
            marginHorizontal: -SPACING.base
          }}
        >
          <BarChart
            data={{ 
              labels: labels.map((_, i) => {
                const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
                return monthNames[i] || `${i + 1}`;
              }), 
              datasets: [{ 
                data: values, 
                colors: values.map((v, i) => {
                  // Colores más suaves y responsivos
                  if (v === 0) return () => '#e2e8f0'; // Gris claro para valores cero
                  if (v > maxValue * 0.8) return () => '#f59e0b'; // Naranja suave para valores altos
                  return () => '#3b82f6'; // Azul suave para valores normales
                }) as any 
              }] 
            }}
            width={Math.max(windowWidth - 20, labels.length * 60)}
            height={220}
            fromZero
            withHorizontalLabels
            withInnerLines={false}
            withVerticalLabels
            yLabelsOffset={8}
            xLabelsOffset={-5}
            segments={4}
            yAxisLabel=""
            yAxisSuffix="m³"
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: () => COLORS.darkGray,
              barPercentage: 0.7,
              labelColor: () => COLORS.darkGray,
              decimalPlaces: 0,
              propsForLabels: { 
                ...textStyle, 
                fontSize: 12,
                fontWeight: '600'
              },
              propsForVerticalLabels: {
                ...textStyle,
                fontSize: 11,
                fontWeight: '500'
              },
              propsForHorizontalLabels: {
                ...textStyle,
                fontSize: 11,
                fontWeight: '600',
                transform: [{ rotate: '-45deg' }]
              },
              fillShadowGradient: '#3b82f6',
              fillShadowGradientOpacity: 0.15,
            }}
            withCustomBarColorFromData
            flatColor
            style={{ 
              borderRadius: BORDER_RADIUS.base,
              marginVertical: SPACING.base
            }}
            showValuesOnTopOfBars={false}
            showBarTops={false}
          />
        </ScrollView>
        
        {/* Leyenda personalizada - Fuera del scroll */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          gap: SPACING.lg, 
          marginTop: SPACING.base,
          flexWrap: 'wrap',
          paddingHorizontal: SPACING.base
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
            <View style={{ width: 14, height: 14, backgroundColor: '#3b82f6', borderRadius: 3 }} />
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, fontWeight: FONT_WEIGHTS.medium }}>Consumo Normal</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
            <View style={{ width: 14, height: 14, backgroundColor: '#f59e0b', borderRadius: 3 }} />
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray, fontWeight: FONT_WEIGHTS.medium }}>Consumo Alto</Text>
          </View>
        </View>
      </View>

      {/* Lista de lecturas mejorada */}
      <View style={{ gap: SPACING.base }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
          <FontAwesome name="list" size={ICON_SIZES.lg} color={COLORS.darkBlue} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Historial de Lecturas</Text>
        </View>
        
        {filtered.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((r) => (
          <TouchableOpacity key={r.id} onPress={() => nav.navigate('ClientReadingDetails', { readingId: r.id })}>
            <AppCard style={{ ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.base }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs }}>
                    <FontAwesome name="calendar" size={ICON_SIZES.sm} color={COLORS.darkBlue} />
                    <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>{formatMonth(r.date)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                    <FontAwesome name={r.paid ? "check-circle" : "clock-o"} size={ICON_SIZES.sm} color={r.paid ? COLORS.green : COLORS.orange} />
                    <Text style={{ fontSize: FONT_SIZES.sm, color: r.paid ? COLORS.green : COLORS.orange }}>{r.paid ? 'Pagado' : 'Pendiente'}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>${r.amount.toFixed(2)}</Text>
                  <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray }}>{r.diff} m³</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                  <FontAwesome name="tachometer" size={ICON_SIZES.sm} color={COLORS.darkGray} />
                  <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkGray }}>Lectura: {r.value} m³</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                  <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.darkBlue }}>Ver detalle</Text>
                  <FontAwesome name="chevron-right" size={ICON_SIZES.xs} color={COLORS.darkBlue} />
                </View>
              </View>
            </AppCard>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}


