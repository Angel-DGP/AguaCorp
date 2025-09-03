import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native';
import type { ClientStackParamList } from './ClientStack';
import { useAuth } from '@store/authContext';
import { updateCustomer, deleteCustomer } from '@services/mockApi';
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
  BUTTON_STYLES,
} from '../../constants/Styles';
import { AppInput } from '@components/ui/AppInput';
import { AppButton } from '@components/ui/AppButton';
import { AppCard } from '@components/ui/AppCard';

type ClientDataManagementNavigationProp = NativeStackNavigationProp<ClientStackParamList, 'ClientDataManagement'>;

export default function ClientDataManagement() {
  const navigation = useNavigation<ClientDataManagementNavigationProp>();
  const { currentCustomer, logout, refreshCurrentCustomer } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    address: '',
    phone: '',
    email: '',
    bankName: '',
    accountNumber: '',
    accountType: '',
    accountHolder: '',
  });

  useEffect(() => {
    if (currentCustomer) {
      setFormData({
        name: currentCustomer.name,
        cedula: currentCustomer.cedula,
        address: currentCustomer.address || '',
        phone: currentCustomer.phone || '',
        email: currentCustomer.email || '',
        bankName: currentCustomer.bankName || '',
        accountNumber: currentCustomer.accountNumber || '',
        accountType: currentCustomer.accountType || '',
        accountHolder: currentCustomer.accountHolder || '',
      });
    }
  }, [currentCustomer]);

  const handleSave = async () => {
    if (!currentCustomer) return;

    try {
      const updated = updateCustomer(currentCustomer.id, formData.name, formData.cedula);
      if (updated) {
        Alert.alert('Éxito', 'Datos actualizados correctamente');
        setIsEditing(false);
        // Refrescar datos del cliente en el contexto
        refreshCurrentCustomer();
      } else {
        Alert.alert('Error', 'No se pudieron actualizar los datos');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar los datos');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (!currentCustomer) return;
            
            try {
              const deleted = deleteCustomer(currentCustomer.id);
              if (deleted) {
                Alert.alert('Cuenta Eliminada', 'Tu cuenta ha sido eliminada exitosamente');
                logout();
              } else {
                Alert.alert('Error', 'No se pudo eliminar la cuenta');
              }
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al eliminar la cuenta');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (currentCustomer) {
      setFormData({
        name: currentCustomer.name,
        cedula: currentCustomer.cedula,
        address: currentCustomer.address || '',
        phone: currentCustomer.phone || '',
        email: currentCustomer.email || '',
        bankName: currentCustomer.bankName || '',
        accountNumber: currentCustomer.accountNumber || '',
        accountType: currentCustomer.accountType || '',
        accountHolder: currentCustomer.accountHolder || '',
      });
    }
    setIsEditing(false);
  };

  if (!currentCustomer) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg }}>
        <Text style={TEXT_STYLES.body}>No hay datos para mostrar.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.lightBackground }} contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.xl }}>
      {/* Header */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <View style={{ backgroundColor: COLORS.darkBlue, padding: SPACING.base, borderRadius: BORDER_RADIUS.base, marginRight: SPACING.base }}>
            <FontAwesome name="user" size={ICON_SIZES.lg} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>Gestión de Datos Personales</Text>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.gray, marginTop: SPACING.xs }}>Administra tu información personal</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={{ backgroundColor: COLORS.orange, padding: SPACING.sm, borderRadius: BORDER_RADIUS.base }}
            >
              <FontAwesome name="edit" size={ICON_SIZES.base} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </AppCard>

      {/* Información Personal */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <FontAwesome name="id-card" size={ICON_SIZES.lg} color={COLORS.darkBlue} style={{ marginRight: SPACING.base }} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Información Personal</Text>
        </View>

        <View style={{ gap: SPACING.lg }}>
          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Nombre Completo</Text>
            {isEditing ? (
              <AppInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ingresa tu nombre completo"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>{currentCustomer.name}</Text>
            )}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Cédula</Text>
            {isEditing ? (
              <AppInput
                value={formData.cedula}
                onChangeText={(text) => setFormData({ ...formData, cedula: text })}
                placeholder="Ingresa tu cédula"
                keyboardType="numeric"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>{currentCustomer.cedula}</Text>
            )}
          </View>
        </View>
      </AppCard>

      {/* Información de Contacto */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <FontAwesome name="phone" size={ICON_SIZES.lg} color={COLORS.darkBlue} style={{ marginRight: SPACING.base }} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Información de Contacto</Text>
        </View>

        <View style={{ gap: SPACING.lg }}>
          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Dirección</Text>
            {isEditing ? (
              <AppInput
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Ingresa tu dirección"
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>{currentCustomer.address || 'No especificada'}</Text>
            )}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Teléfono</Text>
            {isEditing ? (
              <AppInput
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Ingresa tu teléfono"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>{currentCustomer.phone || 'No especificado'}</Text>
            )}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Email</Text>
            {isEditing ? (
              <AppInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Ingresa tu email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>{currentCustomer.email || 'No especificado'}</Text>
            )}
          </View>
        </View>
      </AppCard>

      {/* Información del Medidor */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <FontAwesome name="tachometer" size={ICON_SIZES.lg} color={COLORS.darkBlue} style={{ marginRight: SPACING.base }} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Información del Medidor</Text>
        </View>

        <View style={{ gap: SPACING.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray }}>Número de Medidor</Text>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>{currentCustomer.meterNumber}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray }}>Estado</Text>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.green, fontWeight: FONT_WEIGHTS.medium }}>Activo</Text>
          </View>
        </View>
      </AppCard>

      {/* Información Bancaria */}
      <AppCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <FontAwesome name="credit-card" size={ICON_SIZES.lg} color={COLORS.darkBlue} style={{ marginRight: SPACING.base }} />
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Datos Bancarios</Text>
        </View>

        <View style={{ gap: SPACING.lg }}>
          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Banco</Text>
            {isEditing ? (
              <AppInput
                value={formData.bankName}
                onChangeText={(text) => setFormData({ ...formData, bankName: text })}
                placeholder="Nombre del banco"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>
                {currentCustomer.bankName || 'No especificado'}
              </Text>
            )}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Número de Cuenta</Text>
            {isEditing ? (
              <AppInput
                value={formData.accountNumber}
                onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                placeholder="Número de cuenta bancaria"
                keyboardType="numeric"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>
                {currentCustomer.accountNumber || 'No especificado'}
              </Text>
            )}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Tipo de Cuenta</Text>
            {isEditing ? (
              <AppInput
                value={formData.accountType}
                onChangeText={(text) => setFormData({ ...formData, accountType: text })}
                placeholder="Ahorros, Corriente, etc."
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>
                {currentCustomer.accountType || 'No especificado'}
              </Text>
            )}
          </View>

          <View>
            <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.medium, color: COLORS.darkGray, marginBottom: SPACING.sm }}>Titular de la Cuenta</Text>
            {isEditing ? (
              <AppInput
                value={formData.accountHolder}
                onChangeText={(text) => setFormData({ ...formData, accountHolder: text })}
                placeholder="Nombre del titular de la cuenta"
              />
            ) : (
              <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.medium }}>
                {currentCustomer.accountHolder || 'No especificado'}
              </Text>
            )}
          </View>
        </View>
      </AppCard>

      {/* Botones de Acción */}
      {isEditing ? (
        <View style={{ gap: SPACING.base, marginTop: SPACING.lg }}>
          <AppButton title="Guardar Cambios" onPress={handleSave} style={BUTTON_STYLES.primary} />
          <AppButton title="Cancelar" onPress={handleCancel} variant="secondary" />
        </View>
      ) : (
        <View style={{ gap: SPACING.base, marginTop: SPACING.lg }}>
          <AppButton 
            title="Eliminar Cuenta" 
            onPress={handleDelete} 
            style={{ ...BUTTON_STYLES.danger, marginTop: SPACING.base }}
          />
        </View>
      )}
    </ScrollView>
  );
}
