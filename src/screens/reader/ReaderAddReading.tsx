import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { AppCard } from '@components/ui/AppCard';
import { AppInput } from '@components/ui/AppInput';
import { AppButton } from '@components/ui/AppButton';
import { AppSelect } from '@components/ui/AppSelect';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS, ICON_SIZES } from '../../constants/Styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReaderStackParamList } from './ReaderStack';
import * as ImagePicker from 'expo-image-picker';

type ReaderStackParamList = {
  ReaderHome: undefined;
  ReaderAddReading: {
    meterNumber: string;
    customerName: string;
    customerCedula: string;
    lastReading?: number;
  };
  ReaderEditReading: {
    readingId: string;
    meterNumber: string;
    customerName: string;
    customerCedula: string;
  };
  ReaderHistory: undefined;
};

export default function ReaderAddReading() {
  const route = useRoute<RouteProp<ReaderStackParamList, 'ReaderAddReading'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ReaderStackParamList>>();
  const { meterNumber, customerName, customerCedula, lastReading = 0 } = route.params;
  
  const [currentReading, setCurrentReading] = useState('');
  const [notes, setNotes] = useState('');
  const [meterStatus, setMeterStatus] = useState('Normal');
  const [verificationCode, setVerificationCode] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const meterStatusOptions = [
    { label: 'Normal', value: 'Normal' },
    { label: 'Defectuoso', value: 'Defectuoso' },
    { label: 'Requiere Mantenimiento', value: 'Requiere Mantenimiento' },
    { label: 'Sellado', value: 'Sellado' },
  ];

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const selectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
  };

  const calculateConsumption = () => {
    const current = parseFloat(currentReading);
    if (isNaN(current)) {
      return 0;
    }
    
    // Si la lectura actual es menor que la anterior, asumimos que el medidor se reinició
    // En este caso, el consumo sería la lectura actual (ya que empezó de 0)
    if (current < lastReading) {
      return current;
    }
    
    // Cálculo normal: lectura actual - lectura anterior
    return current - lastReading;
  };

  const handleSave = async () => {
    if (!currentReading.trim()) {
      Alert.alert('Error', 'Por favor ingresa el valor de la lectura actual');
      return;
    }

    const currentValue = parseFloat(currentReading.trim());
    if (isNaN(currentValue) || currentValue < 0) {
      Alert.alert('Error', 'El valor de la lectura debe ser un número positivo válido');
      return;
    }

    // Validar si la lectura actual es menor que la anterior
    if (currentValue < lastReading) {
      Alert.alert(
        'Medidor Reiniciado',
        `La lectura actual (${currentValue} m³) es menor que la anterior (${lastReading} m³).\n\nEsto puede indicar que el medidor se reinició. ¿Deseas continuar?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Continuar',
            onPress: () => {
              // Continuar con el guardado
              saveReading();
            }
          }
        ]
      );
      return;
    }

    // Función auxiliar para guardar la lectura
    const saveReading = async () => {
      if (!verificationCode.trim()) {
        Alert.alert('Error', 'Por favor genera un código de verificación');
        return;
      }

      setIsLoading(true);
      try {
        const consumption = calculateConsumption();
        const amount = consumption * 0.5; // Tarifa por m³

        const newReading = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          value: currentValue,
          diff: consumption,
          amount: amount,
          paid: false,
          isEditable: true,
          notes: notes.trim(),
          meterStatus,
          verificationCode: verificationCode.trim(),
          photo: photo,
          readerId: 'current-reader', // En una app real, esto vendría del contexto de autenticación
        };

        console.log('New reading created:', newReading);
        
        Alert.alert(
          'Éxito', 
          `Lectura registrada correctamente\n\nValor: ${currentValue} m³\nConsumo: ${consumption} m³\nMonto: $${amount.toFixed(2)}\nCódigo: ${verificationCode}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } catch (error) {
        console.error('Error saving reading:', error);
        Alert.alert('Error', 'No se pudo guardar la lectura');
      } finally {
        setIsLoading(false);
      }
    };

    // Ejecutar el guardado
    saveReading();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING.xl }}
    >
      {/* Header */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
          <FontAwesome name="plus-circle" size={ICON_SIZES.lg} color={COLORS.green} />
          <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>
            Nueva Lectura
          </Text>
        </View>
        
        <View style={{ gap: SPACING.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
            <FontAwesome name="user" size={ICON_SIZES.sm} color={COLORS.darkGray} />
            <Text style={{ color: COLORS.darkGray }}>{customerName}</Text>
          </View>
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
            <Text style={{ color: COLORS.darkGray }}>Última lectura: {lastReading} m³</Text>
          </View>
        </View>
      </AppCard>

      {/* Lectura Actual */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="tachometer" size={ICON_SIZES.base} color={COLORS.darkBlue} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>
            Lectura Actual
          </Text>
        </View>
        
        <AppInput
          label="Valor del medidor (m³)"
          value={currentReading}
          onChangeText={setCurrentReading}
          placeholder="Ingresa el valor actual del medidor"
          keyboardType="numeric"
          editable={!isLoading}
        />
        
        {currentReading && !isNaN(parseFloat(currentReading)) && (
          <View style={{ 
            backgroundColor: COLORS.lightBlue + '20', 
            padding: SPACING.sm, 
            borderRadius: BORDER_RADIUS.sm,
            marginTop: SPACING.sm
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.xs }}>
              <FontAwesome name="calculator" size={ICON_SIZES.sm} color={COLORS.darkBlue} />
              <Text style={{ color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.sm }}>
                Consumo Calculado
              </Text>
            </View>
            <Text style={{ color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.base }}>
              {calculateConsumption()} m³
            </Text>
            {parseFloat(currentReading) < lastReading && (
              <Text style={{ color: COLORS.orange, fontSize: FONT_SIZES.xs, marginTop: SPACING.xs, fontStyle: 'italic' }}>
                ⚠️ Medidor reiniciado (lectura menor que la anterior)
              </Text>
            )}
          </View>
        )}
      </AppCard>

      {/* Estado del Medidor */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="cog" size={ICON_SIZES.base} color={COLORS.orange} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.orange }}>
            Estado del Medidor
          </Text>
        </View>
        
        <Text style={{ 
          fontSize: FONT_SIZES.sm, 
          fontWeight: FONT_WEIGHTS.semibold, 
          color: COLORS.darkGray, 
          marginBottom: SPACING.sm 
        }}>
          Estado actual
        </Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          {meterStatusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setMeterStatus(option.value)}
              style={{
                paddingHorizontal: SPACING.base,
                paddingVertical: SPACING.sm,
                borderRadius: BORDER_RADIUS.sm,
                backgroundColor: meterStatus === option.value ? COLORS.darkBlue : '#f1f5f9',
                borderWidth: 1,
                borderColor: meterStatus === option.value ? COLORS.darkBlue : COLORS.gray,
                minWidth: 100,
                alignItems: 'center',
                ...SHADOWS.sm
              }}
            >
              <Text style={{
                color: meterStatus === option.value ? COLORS.white : COLORS.darkGray,
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                textAlign: 'center'
              }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {meterStatus && (
          <View style={{ 
            marginTop: SPACING.sm,
            padding: SPACING.sm,
            backgroundColor: COLORS.lightBlue + '20',
            borderRadius: BORDER_RADIUS.sm
          }}>
            <Text style={{ 
              color: COLORS.darkBlue, 
              fontSize: FONT_SIZES.xs,
              textAlign: 'center'
            }}>
              Estado seleccionado: {meterStatus}
            </Text>
          </View>
        )}
      </AppCard>

      {/* Notas y Observaciones */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="sticky-note" size={ICON_SIZES.base} color={COLORS.green} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>
            Notas y Observaciones
          </Text>
        </View>
        
        <AppInput
          label="Anomalías detectadas"
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe cualquier anomalía: medidor dañado, acceso difícil, posible fuga, etc."
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />
      </AppCard>

      {/* Foto del Medidor */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="camera" size={ICON_SIZES.base} color={COLORS.purple} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.purple }}>
            Evidencia Fotográfica
          </Text>
        </View>
        
        {photo ? (
          <View style={{ alignItems: 'center', gap: SPACING.sm }}>
            <Image 
              source={{ uri: photo }} 
              style={{ 
                width: 200, 
                height: 150, 
                borderRadius: BORDER_RADIUS.sm,
                backgroundColor: COLORS.lightGray
              }} 
            />
            <TouchableOpacity 
              onPress={removePhoto}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: SPACING.xs,
                padding: SPACING.sm,
                backgroundColor: COLORS.red + '20',
                borderRadius: BORDER_RADIUS.sm
              }}
            >
              <FontAwesome name="trash" size={ICON_SIZES.sm} color={COLORS.red} />
              <Text style={{ color: COLORS.red, fontWeight: FONT_WEIGHTS.semibold }}>
                Eliminar foto
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <TouchableOpacity 
              onPress={takePhoto}
              style={{ 
                flex: 1, 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: SPACING.sm,
                padding: SPACING.base,
                backgroundColor: COLORS.darkBlue + '20',
                borderRadius: BORDER_RADIUS.sm,
                borderWidth: 2,
                borderColor: COLORS.darkBlue,
                borderStyle: 'dashed'
              }}
            >
              <FontAwesome name="camera" size={ICON_SIZES.base} color={COLORS.darkBlue} />
              <Text style={{ color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.semibold }}>
                Tomar Foto
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={selectPhoto}
              style={{ 
                flex: 1, 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: SPACING.sm,
                padding: SPACING.base,
                backgroundColor: COLORS.green + '20',
                borderRadius: BORDER_RADIUS.sm,
                borderWidth: 2,
                borderColor: COLORS.green,
                borderStyle: 'dashed'
              }}
            >
              <FontAwesome name="image" size={ICON_SIZES.base} color={COLORS.green} />
              <Text style={{ color: COLORS.green, fontWeight: FONT_WEIGHTS.semibold }}>
                Galería
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </AppCard>

      {/* Código de Verificación */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base }}>
          <FontAwesome name="shield" size={ICON_SIZES.base} color={COLORS.red} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.red }}>
            Código de Verificación
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <AppInput
              label="Código generado"
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Código de verificación"
              editable={false}
            />
          </View>
          <AppButton
            title="Generar"
            onPress={generateVerificationCode}
            variant="secondary"
            style={{ paddingHorizontal: SPACING.base }}
          />
        </View>
        
        <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.sm, marginTop: SPACING.xs }}>
          Este código garantiza la autenticidad de la lectura
        </Text>
      </AppCard>

      {/* Botones de Acción */}
      <View style={{ flexDirection: 'row', gap: SPACING.base, marginTop: SPACING.lg }}>
        <AppButton
          title="Cancelar"
          onPress={handleCancel}
          variant="secondary"
          style={{ flex: 1 }}
          disabled={isLoading}
        />
        <AppButton
          title="Guardar Lectura"
          onPress={handleSave}
          style={{ flex: 1 }}
          disabled={isLoading || !currentReading.trim() || !verificationCode.trim()}
        />
      </View>
    </ScrollView>
  );
}
