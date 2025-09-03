import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { AppCard } from '@components/ui/AppCard';
import { AppInput } from '@components/ui/AppInput';
import { AppButton } from '@components/ui/AppButton';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AdminStackParamList } from './AdminStack';
import { getHistory, updateReading } from '../../services/mockApi';

export default function AdminEditReading() {
  const route = useRoute<RouteProp<AdminStackParamList, 'AdminEditReading'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { readingId, meterNumber, customerName, customerCedula } = route.params;
  
  const [reading, setReading] = useState<{
    id: string;
    date: string;
    value: number;
    diff: number;
    amount: number;
    paid: boolean;
    isEditable: boolean;
  } | null>(null);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    try {
      // Buscar la lectura específica
      const history = getHistory(meterNumber);
      const foundReading = history.find(r => r.id === readingId);
      if (foundReading) {
        setReading(foundReading);
        setNewValue(foundReading.value.toString());
      } else {
        console.error('Reading not found:', { readingId, meterNumber });
        Alert.alert('Error', 'No se encontró la lectura especificada');
      }
    } catch (error) {
      console.error('Error loading reading:', error);
      Alert.alert('Error', 'No se pudo cargar la información de la lectura');
    }
  }, [readingId, meterNumber]);

  const handleSave = async () => {
    if (!reading || !newValue.trim()) {
      Alert.alert('Error', 'Por favor ingresa un valor válido');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Por favor ingresa el motivo de la edición');
      return;
    }

    const newValueNum = parseFloat(newValue.trim());
    if (isNaN(newValueNum) || newValueNum < 0) {
      Alert.alert('Error', 'El valor debe ser un número positivo válido');
      return;
    }

    if (newValueNum === reading.value) {
      Alert.alert('Error', 'El nuevo valor debe ser diferente al valor actual');
      return;
    }

    setIsLoading(true);
    try {
      // Actualizar la lectura
      const updatedReading = updateReading(readingId, newValueNum);
      
      if (!updatedReading) {
        throw new Error('No se pudo actualizar la lectura');
      }
      
      console.log('Reading updated by admin:', updatedReading);
      console.log('Reason:', reason);
      
      Alert.alert(
        'Éxito', 
        `Lectura actualizada correctamente por administrador\n\nNuevo valor: ${newValueNum} m³\nNuevo consumo: ${updatedReading.diff} m³\nNuevo monto: $${updatedReading.amount.toFixed(2)}\nMotivo: ${reason}`,
        [
          {
            text: 'Ver Historial',
            onPress: () => navigation.navigate('AdminUserHistory', { 
              meterNumber, 
              customerName,
              customerCedula
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error updating reading:', error);
      Alert.alert('Error', 'No se pudo actualizar la lectura. Verifica que la lectura existe y es editable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!reading) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustsScrollIndicatorInsets
      >
        <AppCard>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <FontAwesome name="exclamation-triangle" size={32} color={COLORS.orange} />
            <Text style={{ color: COLORS.orange, marginTop: 8, textAlign: 'center' }}>
              No se encontró la lectura
            </Text>
          </View>
        </AppCard>
      </ScrollView>
    );
  }

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
      </AppCard>

      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FontAwesome name="edit" size={20} color={COLORS.orange} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.orange }}>
            Editar Lectura (Admin)
          </Text>
        </View>
        
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.darkGray }}>Fecha:</Text>
            <Text style={{ fontWeight: '600', color: COLORS.darkBlue }}>
              {new Date(reading.date).toLocaleDateString('es-ES')}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.darkGray }}>Valor actual:</Text>
            <Text style={{ fontWeight: '600', color: COLORS.darkBlue }}>
              {reading.value} m³
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.darkGray }}>Consumo:</Text>
            <Text style={{ fontWeight: '600', color: COLORS.lightBlue }}>
              {reading.diff} m³
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.darkGray }}>Monto:</Text>
            <Text style={{ fontWeight: '700', color: COLORS.orange }}>
              ${reading.amount.toFixed(2)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.darkGray }}>Estado:</Text>
            <Text style={{ 
              fontWeight: '600', 
              color: reading.paid ? COLORS.green : COLORS.orange 
            }}>
              {reading.paid ? 'Pagado' : 'Pendiente'}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.darkGray }}>Editable:</Text>
            <Text style={{ 
              fontWeight: '600', 
              color: reading.isEditable ? COLORS.green : COLORS.red 
            }}>
              {reading.isEditable ? 'Sí' : 'No'}
            </Text>
          </View>
        </View>
      </AppCard>

      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <FontAwesome name="pencil" size={20} color={COLORS.darkBlue} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.darkBlue }}>
            Nuevo Valor
          </Text>
        </View>
        
        <AppInput
          label="Nuevo valor (m³)"
          value={newValue}
          onChangeText={setNewValue}
          placeholder="Ingresa el nuevo valor"
          keyboardType="numeric"
          editable={!isLoading}
        />
        
        <AppInput
          label="Motivo de la edición"
          value={reason}
          onChangeText={setReason}
          placeholder="Ingresa el motivo de la edición"
          editable={!isLoading}
          multiline
          numberOfLines={3}
        />
        
        <Text style={{ color: COLORS.darkGray, fontSize: 12, marginTop: 8 }}>
          Como administrador, puedes editar cualquier lectura. Esta acción quedará registrada.
        </Text>
      </AppCard>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <AppButton
          title="Cancelar"
          onPress={handleCancel}
          variant="secondary"
          style={{ flex: 1 }}
          disabled={isLoading}
        />
        <AppButton
          title="Guardar Cambios"
          onPress={handleSave}
          style={{ flex: 1 }}
          disabled={isLoading || !newValue.trim() || !reason.trim() || newValue.trim() === reading?.value.toString()}
        />
      </View>
    </ScrollView>
  );
}

