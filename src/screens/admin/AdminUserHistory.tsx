import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { AppCard } from '@components/ui/AppCard';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AdminStackParamList } from './AdminStack';
import { getHistory, formatMonth } from '@services/mockApi';

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
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustsScrollIndicatorInsets
    >
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <FontAwesome name="user" size={20} color={COLORS.darkBlue} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.darkBlue }}>
            {customerName}
          </Text>
        </View>
        <Text style={{ color: COLORS.darkGray }}>Cédula: {customerCedula}</Text>
        <Text style={{ color: COLORS.darkGray }}>Medidor: {meterNumber}</Text>
        <Text style={{ color: COLORS.darkGray, marginTop: 4 }}>Total de lecturas: {history.length}</Text>
        <Text style={{ color: COLORS.darkGray }}>Año seleccionado: {selectedYear}</Text>
        <Text style={{ color: COLORS.darkGray }}>Lecturas filtradas: {filtered.length}</Text>
        
        {/* Botón de refresh */}
        <Pressable
          onPress={handleRefresh}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: COLORS.lightBlue,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            marginTop: 12
          }}
        >
          <FontAwesome name="refresh" size={14} color={COLORS.white} />
          <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 12 }}>
            Actualizar Datos
          </Text>
        </Pressable>
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
                <Text style={{ fontWeight: '600', color: COLORS.darkBlue }}>{r.value} m³</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <FontAwesome name="tint" size={14} color={COLORS.lightBlue} />
                  <Text style={{ color: COLORS.darkGray }}>Consumo</Text>
                </View>
                <Text style={{ fontWeight: '600', color: COLORS.lightBlue }}>{r.diff} m³</Text>
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
              
              {/* Información adicional para admin */}
              <View style={{ 
                backgroundColor: COLORS.lightBlue + '20', 
                padding: 8, 
                borderRadius: 4, 
                marginTop: 8 
              }}>
                <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
                  ID: {r.id} | Creado: {new Date(r.createdAt).toLocaleDateString('es-ES')}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
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
                    gap: 6,
                    backgroundColor: COLORS.orange,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    marginTop: 8
                  }}
                >
                  <FontAwesome name="edit" size={14} color={COLORS.white} />
                  <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 12 }}>
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
