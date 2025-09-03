import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { ClientReadingsStackParamList } from './ClientReadingsStack';
import { getHistory, getBankInfo } from '@services/mockApi';
import { useAuth } from '@store/authContext';
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
} from '../../constants/Styles';
import * as Clipboard from 'expo-clipboard';

export default function ClientReadingDetails() {
  const route = useRoute<RouteProp<ClientReadingsStackParamList, 'ClientReadingDetails'>>();
  const { currentCustomer, role } = useAuth();
  const bank = getBankInfo();

  const reading = useMemo(() => {
    if (!currentCustomer || !route.params) return undefined;
    const all = getHistory(currentCustomer.meterNumber);
    return all.find((r) => r.id === route.params.readingId);
  }, [currentCustomer, route.params]);

  const previousReading = useMemo(() => {
    if (!currentCustomer || !reading) return undefined;
    const all = getHistory(currentCustomer.meterNumber);
    const idx = all.findIndex(r => r.id === reading.id);
    if (idx > 0) return all[idx - 1];
    return undefined;
  }, [currentCustomer, reading]);

  const Row = ({ icon, label, value, copy }: { icon: string; label: string; value: string; copy?: boolean }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 }}>
        <FontAwesome name={icon as any} size={ICON_SIZES.base} color={COLORS.darkGray} />
        <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.base }}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
        <Text style={{ color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.semibold }}>{value}</Text>
        {copy && (
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(value);
              Alert.alert('Copiado', `${label} copiado al portapapeles`);
            }}
            style={{ backgroundColor: COLORS.darkBlue, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.base }}
          >
            <FontAwesome name="copy" size={ICON_SIZES.sm} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!currentCustomer || !reading) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No hay datos para mostrar.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} contentContainerStyle={{ padding: SPACING.lg }}>
      <View style={{ ...CARD_STYLES.base }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <View style={{ backgroundColor: COLORS.darkBlue, padding: SPACING.base, borderRadius: BORDER_RADIUS.base, marginRight: SPACING.base }}>
            <FontAwesome name="info-circle" size={ICON_SIZES.lg} color={COLORS.white} />
          </View>
          <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.darkBlue }}>Detalle de lectura</Text>
        </View>

        <View style={{ backgroundColor: '#f8fafc', padding: SPACING.lg, borderRadius: BORDER_RADIUS.base }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.base }}>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>Número de medidor</Text>
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>{currentCustomer.meterNumber}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.base }}>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>Valor</Text>
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>{reading.value} m³</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.base }}>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>Consumo</Text>
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.orange }}>{reading.diff} m³</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray }}>Monto</Text>
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.green }}>${reading.amount.toFixed(2)}</Text>
          </View>
        </View>

        {previousReading && (
          <View style={{
            marginTop: SPACING.lg,
            padding: SPACING.lg,
            borderRadius: BORDER_RADIUS.base,
            backgroundColor: 'rgba(51,65,85,0.06)',
          }}>
            <Text style={{ fontSize: FONT_SIZES.base, color: COLORS.darkGray, marginBottom: SPACING.sm }}>
              Comparativo con lectura anterior
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs }}>
              <Text style={{ color: COLORS.gray }}>Lectura anterior</Text>
              <Text style={{ color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.semibold }}>{previousReading.value} m³</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs }}>
              <Text style={{ color: COLORS.gray }}>Consumo período</Text>
              <Text style={{ color: COLORS.orange, fontWeight: FONT_WEIGHTS.semibold }}>{reading.value - previousReading.value} m³</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: COLORS.gray }}>A pagar</Text>
              <Text style={{ color: COLORS.green, fontWeight: FONT_WEIGHTS.bold }}>${reading.amount.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>

      {role === 'Cliente' && (
      <View style={{ ...CARD_STYLES.base }}>
        <View style={{ alignItems: 'center', marginBottom: SPACING.base }}>
          <Image
            source={require('../../img/logo.jpeg')}
            style={{ width: 220, height: 70, resizeMode: 'contain', borderRadius: BORDER_RADIUS.sm }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg }}>
          <View style={{ backgroundColor: COLORS.darkBlue, padding: SPACING.base, borderRadius: BORDER_RADIUS.base, marginRight: SPACING.base }}>
            <FontAwesome name="credit-card" size={ICON_SIZES.lg} color={COLORS.white} />
          </View>
          <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.darkBlue }}>Datos bancarios</Text>
        </View>

        <Row icon="building" label="Banco" value={bank.bank} />
        <Row icon="user" label="Titular" value={bank.accountName} />
        <Row icon="credit-card" label="Número de cuenta" value={bank.accountNumber} copy />
        
        {/* Instrucciones de pago en dos filas separadas */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 }}>
            <FontAwesome name="info" size={ICON_SIZES.base} color={COLORS.darkGray} />
            <Text style={{ color: COLORS.darkGray, fontSize: FONT_SIZES.base }}>Instrucciones de pago</Text>
          </View>
        </View>
        <View style={{ marginBottom: SPACING.base }}>
          <Text style={{ color: COLORS.darkBlue, fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.base, lineHeight: 20 }}>
            {bank.instructions}
          </Text>
        </View>
      </View>
      )}
    </ScrollView>
  );
}
