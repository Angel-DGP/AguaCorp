import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { AppCard } from '@components/ui/AppCard';
import { getHistory, formatMonth } from '@services/mockApi';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReaderStackParamList } from './ReaderStack';

export default function ReaderHistory() {
  const route = useRoute<RouteProp<ReaderStackParamList, 'ReaderHistory'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ReaderStackParamList>>();
  const { meterNumber, customerName } = route.params;
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-render
  
  // Usar useFocusEffect para refrescar datos cuando se regrese a la pantalla
  useFocusEffect(
    useCallback(() => {
      // Forzar actualización de datos cuando la pantalla vuelve a estar en foco
      setRefreshKey(prev => prev + 1);
    }, [])
  );
  
  const history = useMemo(() => getHistory(meterNumber), [meterNumber, refreshKey]);
  
  // Debug logging
  useEffect(() => {
    console.log('ReaderHistory - meterNumber:', meterNumber);
    console.log('ReaderHistory - customerName:', customerName);
    console.log('ReaderHistory - history length:', history.length);
    console.log('ReaderHistory - history data:', history);
    console.log('ReaderHistory - refreshKey:', refreshKey);
  }, [meterNumber, customerName, history, refreshKey]);
  
  const years = useMemo(() => {
    const set = new Set<number>();
    history.forEach((r) => set.add(new Date(r.date).getFullYear()));
    const yearsArray = Array.from(set).sort((a, b) => a - b);
    console.log('ReaderHistory - available years:', yearsArray);
    return yearsArray;
  }, [history]);

  const filtered = useMemo(() => {
    const filteredData = history.filter((r) => new Date(r.date).getFullYear() === selectedYear);
    console.log('ReaderHistory - filtered data for year', selectedYear, ':', filteredData.length);
    return filteredData;
  }, [history, selectedYear]);

  const sortedHistory = useMemo(() => 
    filtered.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [filtered]
  );

  const handleEditReading = (reading: any) => {
    navigation.navigate('ReaderEditReading', {
      readingId: reading.id,
      meterNumber,
      customerName
    });
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <FontAwesome name="tachometer" size={20} color={COLORS.darkBlue} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.darkBlue }}>
            {customerName}
          </Text>
        </View>
        <Text style={{ color: COLORS.darkGray }}>Medidor: {meterNumber}</Text>
        <Text style={{ color: COLORS.darkGray, marginTop: 4 }}>Total de lecturas: {history.length}</Text>
        <Text style={{ color: COLORS.darkGray }}>Año seleccionado: {selectedYear}</Text>
        <Text style={{ color: COLORS.darkGray }}>Lecturas filtradas: {filtered.length}</Text>
        {refreshKey > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <FontAwesome name="refresh" size={14} color={COLORS.green} />
            <Text style={{ color: COLORS.green, fontSize: 12, fontWeight: '600' }}>
              Datos actualizados
            </Text>
          </View>
        )}
      </AppCard>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="calendar" size={20} color={COLORS.orange} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.orange }}>
            Historial {selectedYear}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable 
            onPress={() => setSelectedYear((y) => Math.max(years[0] ?? y - 1, y - 1))} 
            disabled={years.length === 0 || selectedYear <= years[0]}
          >
            <Text style={{ 
              color: years.length === 0 || selectedYear <= years[0] ? COLORS.gray : COLORS.darkBlue 
            }}>
              ‹ {years.length ? Math.max(years[0], selectedYear - 1) : ''}
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => setSelectedYear((y) => Math.min(years[years.length - 1] ?? y + 1, y + 1))} 
            disabled={years.length === 0 || selectedYear >= years[years.length - 1]}
          >
            <Text style={{ 
              color: years.length === 0 || selectedYear >= years[years.length - 1] ? COLORS.gray : COLORS.darkBlue 
            }}>
              {years.length ? Math.min(years[years.length - 1], selectedYear + 1) : ''} ›
            </Text>
          </Pressable>
        </View>
      </View>

      {sortedHistory.length === 0 ? (
        <AppCard>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <FontAwesome name="info-circle" size={32} color={COLORS.gray} />
            <Text style={{ color: COLORS.gray, marginTop: 8 }}>No hay lecturas para este año</Text>
            <Text style={{ color: COLORS.darkGray, marginTop: 4, fontSize: 12 }}>
              Años disponibles: {years.join(', ') || 'Ninguno'}
            </Text>
          </View>
        </AppCard>
      ) : (
        <View style={{ gap: 12 }}>
          {sortedHistory.map((r) => (
            <AppCard key={r.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome name="calendar" size={14} color={COLORS.darkBlue} />
                  <Text style={{ fontWeight: '600', color: COLORS.darkBlue }}>
                    {formatMonth(r.date)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome name={r.paid ? "check-circle" : "clock-o"} size={14} color={r.paid ? COLORS.green : COLORS.orange} />
                  <Text style={{ color: r.paid ? COLORS.green : COLORS.orange }}>
                    {r.paid ? 'Pagado' : 'Pendiente'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome name="tachometer" size={14} color={COLORS.darkGray} />
                  <Text style={{ color: COLORS.darkGray }}>Lectura</Text>
                </View>
                <Text style={{ fontWeight: '600', color: COLORS.darkBlue }}>{r.value}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome name="tint" size={14} color={COLORS.lightBlue} />
                  <Text style={{ color: COLORS.darkGray }}>Consumo</Text>
                </View>
                <Text style={{ fontWeight: '600', color: COLORS.lightBlue }}>{r.diff}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome name="money" size={14} color={COLORS.orange} />
                  <Text style={{ color: COLORS.darkGray }}>Monto</Text>
                </View>
                <Text style={{ fontWeight: '700', color: COLORS.orange }}>
                  ${r.amount.toFixed(2)}
                </Text>
              </View>
              
              {/* Edit button for editable readings */}
              {r.isEditable && (
                <Pressable
                  onPress={() => handleEditReading(r)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    backgroundColor: COLORS.lightBlue,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    marginTop: 8
                  }}
                >
                  <FontAwesome name="edit" size={14} color={COLORS.white} />
                  <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 12 }}>
                    Editar
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
