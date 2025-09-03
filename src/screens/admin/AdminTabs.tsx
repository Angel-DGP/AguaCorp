import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { SPACING, SHADOWS, ICON_SIZES } from '../../constants/Styles';
import AdminHome from './AdminHome';
import AdminReaders from './AdminReaders';
import AdminReports from './AdminReports';

export type AdminTabsParamList = {
  AdminHome: undefined;
  AdminReaders: undefined;
  AdminReports: undefined;
};

const Tab = createBottomTabNavigator<AdminTabsParamList>();

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.darkBlue,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray,
          paddingBottom: SPACING.sm,
          paddingTop: SPACING.sm,
          height: 70,
          ...SHADOWS.lg,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: SPACING.xs,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHome}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={ICON_SIZES.lg} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminReaders"
        component={AdminReaders}
        options={{
          tabBarLabel: 'Lectores',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={ICON_SIZES.lg} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminReports"
        component={AdminReports}
        options={{
          tabBarLabel: 'Reportes',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={ICON_SIZES.lg} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
