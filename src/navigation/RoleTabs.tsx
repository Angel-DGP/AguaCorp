import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClientStack from '@screens/client/ClientStack';
import ReaderStack from '@screens/reader/ReaderStack';
import AdminStack from '@screens/admin/AdminStack';
import { useAuth } from '@store/authContext';

export type RoleTabsParamList = {
  Cliente: undefined;
  Lector: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<RoleTabsParamList>();

export default function RoleTabs() {
  const { role } = useAuth();
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {(role === 'Cliente' || role === 'Admin') && (
        <Tab.Screen name="Cliente" component={ClientStack} />
      )}
      {(role === 'Lector' || role === 'Admin') && (
        <Tab.Screen name="Lector" component={ReaderStack} />
      )}
      {role === 'Admin' && <Tab.Screen name="Admin" component={AdminStack} />}
    </Tab.Navigator>
  );
}


