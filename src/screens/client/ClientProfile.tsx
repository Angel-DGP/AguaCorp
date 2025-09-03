import React, { useMemo, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@store/authContext';
import { updateCustomer } from '@services/mockApi';
import { AppInput } from '@components/ui/AppInput';
import { AppButton } from '@components/ui/AppButton';
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
  TEXT_STYLES,
  BUTTON_STYLES
} from '../../constants/Styles';

export default function ClientProfile() {
  const { currentCustomer, isAuthenticated } = useAuth();

  const [name, setName] = useState(currentCustomer?.name ?? '');
  const [cedula, setCedula] = useState(currentCustomer?.cedula ?? '');
  const [saving, setSaving] = useState(false);

  const isValid = useMemo(() => {
    return name.trim().length >= 3 && cedula.trim().length >= 8;
  }, [name, cedula]);

  const handleSave = () => {
    if (!currentCustomer) return;
    if (!isValid) {
      Alert.alert('Datos inválidos', 'Verifica nombre y cédula.');
      return;
    }
    try {
      setSaving(true);
      const updated = updateCustomer(currentCustomer.id, { name: name.trim(), cedula: cedula.trim() });
      Alert.alert('Perfil actualizado', `Se guardaron los cambios para ${updated.name}.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo actualizar.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !currentCustomer) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: COLORS.darkGray }}>No hay cliente autenticado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={CARD_STYLES.header}>
        <Text style={TEXT_STYLES.title}>Perfil del Cliente</Text>
        <Text style={TEXT_STYLES.subtitle}>Actualiza tus datos personales</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, ...SHADOWS.base }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
            <View style={{ backgroundColor: COLORS.darkBlue, padding: SPACING.base, borderRadius: BORDER_RADIUS.base, marginRight: SPACING.base }}>
              <FontAwesome name="user" size={ICON_SIZES.lg} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>Medidor</Text>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>
                {currentCustomer.meterNumber}
              </Text>
            </View>
          </View>

          <AppInput
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />
          <View style={{ height: SPACING.base }} />
          <AppInput
            label="Cédula"
            value={cedula}
            onChangeText={setCedula}
            placeholder="Tu cédula"
            keyboardType="numeric"
          />

          <View style={{ height: SPACING.lg }} />
          <AppButton title={saving ? 'Guardando...' : 'Guardar cambios'} onPress={handleSave} disabled={!isValid || saving} />
        </View>
      </ScrollView>
    </View>
  );
}

 