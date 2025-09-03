import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { AppCard } from '@components/ui/AppCard';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS, ICON_SIZES } from '../../constants/Styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AdminStackParamList } from './AdminStack';
import { getHistory, formatMonth } from '../../services/mockApi';

export default function AdminUserHistory() {
  const route = useRoute<RouteProp<AdminStackParamList, 'AdminUserHistory'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { meterNumber, customerName, customerCedula } = route.params;
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0);
  
  const history = useMemo(() => getHistory(meterNumber), [meterNumber, refreshKey]);
  
  // Debug logging
  useEffect(() => {
    console.log('AdminUserHistory - meterNumber:', meterNumber);
    console.log('AdminUserHistory - customerName:', customerName);
    console.log('AdminUserHistory - history length:', history.length);
    console.log('AdminUserHistory - history data:', history);
  }, [meterNumber, customerName, history]);
  
  const years = useMemo(() => {
    const set = new Set<number>();
    history.forEach((r) => set.add(new Date(r.date).getFullYear()));
    const yearsArray = Array.from(set).sort((a, b) => a - b);
    console.log('AdminUserHistory - available years:', yearsArray);
    return yearsArray;
  }, [history]);

  const filtered = useMemo(() => {
    const filteredData = history.filter((r) => new Date(r.date).getFullYear() === selectedYear);
    console.log('AdminUserHistory - filtered data for year', selectedYear, ':', filteredData.length);
    return filteredData;
  }, [history, selectedYear]);

  const sortedHistory = useMemo(() => 
    filtered.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [filtered]
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEditReading = (reading: any) => {
    navigation.navigate('AdminEditReading', {
      readingId: reading.id,
      meterNumber,
      customerName,
      customerCedula
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING.xl }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      {/* Header con información del cliente */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="user" size={ICON_SIZES.lg} color={COLORS.darkBlue} />
          <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>
            {customerName}
          </Text>
        </View>
        
        <View style={{ gap: SPACING.xs, marginBottom: SPACING.base }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <FontAwesome name="id-card" size={ICON_SIZES.sm} color={COLORS.darkGray} />
            <Text style={{ color: COLORS.darkGray }}>Cédula: {customerCedula}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <FontAwesome name="tachometer" size={ICON_SIZES.sm} color={COLORS.darkGray} />
            <Text style={{ color: COLORS.darkGray }}>Medidor: {meterNumber}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <FontAwesome name="history" size={ICON_SIZES.sm} color={COLORS.darkGray} />
            <Text style={{ color: COLORS.darkGray }}>Total de lecturas: {history.length}</Text>
          </View>
        </View>
        
        {/* Botón de refresh */}
        <Pressable
          onPress={handleRefresh}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING.xs,
            backgroundColor: COLORS.lightBlue,
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.base,
            borderRadius: BORDER_RADIUS.sm,
            ...SHADOWS.sm
          }}
        >
          <FontAwesome name="refresh" size={ICON_SIZES.sm} color={COLORS.white} />
          <Text style={{ color: COLORS.white, fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.sm }}>
            Actualizar Datos
          </Text>
        </Pressable>
      </AppCard>

      {/* Selector de año */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <FontAwesome name="calendar" size={ICON_SIZES.base} color={COLORS.orange} />
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>
              Historial {selectedYear}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.base }}>
            <Pressable 
              onPress={() => setSelectedYear((y) => Math.max(years[0] ?? y - 1, y - 1))} 
              disabled={years.length === 0 || selectedYear <= years[0]}
              style={{
                paddingHorizontal: SPACING.sm,
                paddingVertical: SPACING.xs,
                borderRadius: BORDER_RADIUS.sm,
                backgroundColor: years.length === 0 || selectedYear <= years[0] ? COLORS.lightGray : COLORS.lightBlue + '20'
              }}
            >
              <Text style={{ 
                color: years.length === 0 || selectedYear <= years[0] ? COLORS.gray : COLORS.darkBlue,
                fontWeight: FONT_WEIGHTS.semibold
              }}>
                ‹ {years.length ? Math.max(years[0], selectedYear - 1) : ''}
              </Text>
            </Pressable>
            <Pressable 
              onPress={() => setSelectedYear((y) => Math.min(years[years.length - 1] ?? y + 1, y + 1))} 
              disabled={years.length === 0 || selectedYear >= years[years.length - 1]}
              style={{
                paddingHorizontal: SPACING.sm,
                paddingVertical: SPACING.xs,
                borderRadius: BORDER_RADIUS.sm,
                backgroundColor: years.length === 0 || selectedYear >= years[years.length - 1] ? COLORS.lightGray : COLORS.lightBlue + '20'
              }}
            >
              <Text style={{ 
                color: years.length === 0 || selectedYear >= years[years.length - 1] ? COLORS.gray : COLORS.darkBlue,
                fontWeight: FONT_WEIGHTS.semibold
              }}>
                {years.length ? Math.min(years[years.length - 1], selectedYear + 1) : ''} ›
              </Text>
            </Pressable>
          </View>
        </View>
        
        {filtered.length > 0 && (
          <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm, marginTop: SPACING.sm }}>
            {filtered.length} lectura{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </Text>
        )}
      </AppCard>

      {sortedHistory.length === 0 ? (
        <AppCard>
          <View style={{ alignItems: 'center', padding: SPACING.xl }}>
            <FontAwesome name="info-circle" size={ICON_SIZES['2xl']} color={COLORS.gray} />
            <Text style={{ color: COLORS.gray, marginTop: SPACING.sm, fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold }}>
              No hay lecturas para este año
            </Text>
            <Text style={{ color: COLORS.darkGray, marginTop: SPACING.xs, fontSize: FONT_SIZES.sm, textAlign: 'center' }}>
              Años disponibles: {years.join(', ') || 'Ninguno'}
            </Text>
          </View>
        </AppCard>
      ) : (
        <View style={{ gap: SPACING.base }}>
          {sortedHistory.map((r) => (
            <AppCard key={r.id}>
              {/* Header de la lectura */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                  <FontAwesome name="calendar" size={ICON_SIZES.sm} color={COLORS.darkBlue} />
                  <Text style={{ fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue, fontSize: FONT_SIZES.base }}>
                    {formatMonth(r.date)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                  <FontAwesome name={r.paid ? "check-circle" : "clock-o"} size={ICON_SIZES.sm} color={r.paid ? COLORS.green : COLORS.orange} />
                  <Text style={{ color: r.paid ? COLORS.green : COLORS.orange, fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.sm }}>
                    {r.paid ? 'Pagado' : 'Pendiente'}
                  </Text>
                </View>
              </View>
              
              {/* Datos de la lectura */}
              <View style={{ gap: SPACING.xs, marginBottom: SPACING.sm }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                    <FontAwesome name="tachometer" size={ICON_SIZES.sm} color={COLORS.darkGray} />
                    <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>Lectura</Text>
                  </View>
                  <Text style={{ fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue, fontSize: FONT_SIZES.base }}>
                    {r.value} m³
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                    <FontAwesome name="tint" size={ICON_SIZES.sm} color={COLORS.lightBlue} />
                    <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>Consumo</Text>
                  </View>
                  <Text style={{ fontWeight: FONT_WEIGHTS.semibold, color: COLORS.lightBlue, fontSize: FONT_SIZES.base }}>
                    {r.diff} m³
                  </Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                    <FontAwesome name="money" size={ICON_SIZES.sm} color={COLORS.orange} />
                    <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm }}>Monto</Text>
                  </View>
                  <Text style={{ fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange, fontSize: FONT_SIZES.base }}>
                    ${r.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
              
              {/* Información adicional para admin */}
              <View style={{ 
                backgroundColor: COLORS.lightBlue + '15', 
                padding: SPACING.sm, 
                borderRadius: BORDER_RADIUS.sm, 
                marginBottom: SPACING.sm
              }}>
                <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.darkGray, marginBottom: SPACING.xs }}>
                  ID: {r.id} | Creado: {new Date(r.createdAt).toLocaleDateString('es-ES')}
                </Text>
                <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.darkGray }}>
                  Editable: {r.isEditable ? 'Sí' : 'No'}
                </Text>
              </View>
              
              {/* Botón de edición para admin (solo si es editable) */}
              {r.isEditable && (
                <Pressable
                  onPress={() => handleEditReading(r)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: SPACING.xs,
                    backgroundColor: COLORS.orange,
                    paddingVertical: SPACING.sm,
                    paddingHorizontal: SPACING.base,
                    borderRadius: BORDER_RADIUS.sm,
                    ...SHADOWS.sm
                  }}
                >
                  <FontAwesome name="edit" size={ICON_SIZES.sm} color={COLORS.white} />
                  <Text style={{ color: COLORS.white, fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.sm }}>
                    Editar como Admin
                  </Text>
                </Pressable>
              )}
            </AppCard>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
