import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientDataManagement from './ClientDataManagement';
import ClientProfile from './ClientProfile';
import LogoutButton from '@components/ui/LogoutButton';

export type ClientDataStackParamList = {
  ClientDataManagement: undefined;
  ClientProfile: undefined;
};

const Stack = createNativeStackNavigator<ClientDataStackParamList>();

export default function ClientDataStack() {
  return (
    <Stack.Navigator screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen 
        name="ClientDataManagement" 
        component={ClientDataManagement} 
        options={{ 
          title: 'Mis Datos',
          headerRight: () => <LogoutButton variant="default" />
        }} 
      />
      <Stack.Screen name="ClientProfile" component={ClientProfile} options={{ title: 'Editar Perfil' }} />
    </Stack.Navigator>
  );
}
