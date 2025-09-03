import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native-stack';
import type { AdminStackParamList } from './AdminStack';
import { getReaderAuditLogs, getReaderById } from '@services/mockAdmin';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

type AdminReaderHistoryRouteProp = RouteProp<AdminStackParamList, 'AdminReaderHistory'>;

export default function AdminReaderHistory() {
  const route = useRoute<AdminReaderHistoryRouteProp>();
  const { readerId, readerName, readerCode } = route.params;
  
  const [actionFilter, setActionFilter] = useState<'all' | 'reading_updated' | 'reading_created' | 'reading_deleted' | 'customer_updated'>('all');
  
  // Obtener información del lector y sus logs
  const reader = useMemo(() => getReaderById(readerId), [readerId]);
  const allLogs = useMemo(() => getReaderAuditLogs(readerId), [readerId]);
  
  // Filtrar logs por acción
  const filteredLogs = useMemo(() => {
    if (actionFilter === 'all') return allLogs;
    return allLogs.filter(log => log.action === actionFilter);
  }, [allLogs, actionFilter]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'reading_updated': return 'edit';
      case 'reading_created': return 'plus';
      case 'reading_deleted': return 'trash';
      case 'customer_updated': return 'user-edit';
      default: return 'question';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'reading_updated': return COLORS.orange;
      case 'reading_created': return COLORS.green;
      case 'reading_deleted': return COLORS.red;
      case 'customer_updated': return COLORS.darkBlue;
      default: return COLORS.gray;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'reading_updated': return 'Lectura Actualizada';
      case 'reading_created': return 'Lectura Creada';
      case 'reading_deleted': return 'Lectura Eliminada';
      case 'customer_updated': return 'Cliente Actualizado';
      default: return 'Acción Desconocida';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Header del lector */}
      <View style={{
        backgroundColor: COLORS.darkBlue,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center'
      }}>
        <FontAwesome name="user-tie" size={48} color={COLORS.white} />
        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.white, marginTop: 12 }}>
          {readerName}
        </Text>
        <Text style={{ fontSize: 16, color: COLORS.white, marginTop: 4 }}>
          Código: {readerCode}
        </Text>
        {reader && (
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            width: '100%', 
            marginTop: 16,
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 12,
            borderRadius: 8
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.white }}>
                {reader.totalReadings}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.white }}>
                Total Lecturas
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.white }}>
                {reader.totalChanges}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.white }}>
                Total Cambios
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.white }}>
                {allLogs.length}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.white }}>
                Registros
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Filtros de acción */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: COLORS.darkGray }}>
          Filtrar por tipo de acción:
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {(['all', 'reading_updated', 'reading_created', 'reading_deleted', 'customer_updated'] as const).map((action) => (
            <TouchableOpacity
              key={action}
              onPress={() => setActionFilter(action)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: actionFilter === action ? getActionColor(action) : COLORS.lightGray,
                borderWidth: 1,
                borderColor: actionFilter === action ? getActionColor(action) : COLORS.gray,
              }}
            >
              <Text style={{
                color: actionFilter === action ? COLORS.white : COLORS.darkGray,
                fontSize: 11,
                fontWeight: '600'
              }}>
                {action === 'all' ? 'Todas' : getActionText(action)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Información de resultados */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4
      }}>
        <Text style={{ fontSize: 14, color: COLORS.darkGray }}>
          {filteredLogs.length} registro{filteredLogs.length !== 1 ? 's' : ''} encontrado{filteredLogs.length !== 1 ? 's' : ''}
        </Text>
        {actionFilter !== 'all' && (
          <Text style={{ fontSize: 12, color: COLORS.gray }}>
            Filtro: {getActionText(actionFilter)}
          </Text>
        )}
      </View>

      {/* Lista de logs de auditoría */}
      {filteredLogs.length === 0 ? (
        <View style={{
          backgroundColor: '#fff',
          padding: 32,
          borderRadius: 8,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <FontAwesome name="history" size={48} color={COLORS.gray} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.darkGray, marginTop: 16 }}>
            No hay registros de actividad
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.gray, marginTop: 8, textAlign: 'center' }}>
            {actionFilter !== 'all'
              ? `No hay registros de tipo "${getActionText(actionFilter)}"`
              : 'Este lector no ha realizado ninguna actividad registrada'
            }
          </Text>
        </View>
      ) : (
        filteredLogs.map((log) => (
          <View
            key={log.id}
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              borderLeftWidth: 4,
              borderLeftColor: getActionColor(log.action),
            }}
          >
            {/* Header del log */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <FontAwesome 
                    name={getActionIcon(log.action) as any} 
                    size={16} 
                    color={getActionColor(log.action)} 
                  />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: getActionColor(log.action) }}>
                    {getActionText(log.action)}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: COLORS.darkGray, marginTop: 4 }}>
                  {log.description}
                </Text>
              </View>
              <Text style={{ fontSize: 10, color: COLORS.gray, textAlign: 'right' }}>
                {formatTimestamp(log.timestamp)}
              </Text>
            </View>

            {/* Detalles del cambio */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, color: COLORS.darkGray }}>
                📊 Medidor: {log.meterNumber}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.darkGray, marginTop: 2 }}>
                👤 Cliente: {log.customerName}
              </Text>
              {log.ipAddress && (
                <Text style={{ fontSize: 12, color: COLORS.darkGray, marginTop: 2 }}>
                  🌐 IP: {log.ipAddress}
                </Text>
              )}
            </View>

            {/* Valores antes y después */}
            {log.oldValue && (
              <View style={{ 
                backgroundColor: COLORS.lightGray, 
                padding: 8, 
                borderRadius: 6, 
                marginBottom: 8 
              }}>
                <Text style={{ fontSize: 11, color: COLORS.darkGray, fontWeight: '600' }}>
                  Valor Anterior:
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.darkGray }}>
                  {log.oldValue}
                </Text>
              </View>
            )}
            
            {log.newValue && (
              <View style={{ 
                backgroundColor: COLORS.lightGray, 
                padding: 8, 
                borderRadius: 6 
              }}>
                <Text style={{ fontSize: 11, color: COLORS.darkGray, fontWeight: '600' }}>
                  Valor Nuevo:
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.darkGray }}>
                  {log.newValue}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

