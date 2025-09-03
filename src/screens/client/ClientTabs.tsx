import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { ICON_SIZES } from '../../constants/Styles';
import ClientReadingsStack from './ClientReadingsStack';
import ClientDataStack from './ClientDataStack';
import ClientHistoryTab from './ClientHistoryTab';

export type ClientTabsParamList = {
  ClientReadingsStack: undefined;
  ClientHistoryTab: undefined;
  ClientDataStack: undefined;
};

const Tab = createBottomTabNavigator<ClientTabsParamList>();

export default function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.darkBlue,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="ClientReadingsStack"
        component={ClientReadingsStack}
        options={{
          title: 'Lecturas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tachometer" size={size || ICON_SIZES.base} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ClientHistoryTab"
        component={ClientHistoryTab}
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={size || ICON_SIZES.base} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ClientDataStack"
        component={ClientDataStack}
        options={{
          title: 'Mis Datos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size || ICON_SIZES.base} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
