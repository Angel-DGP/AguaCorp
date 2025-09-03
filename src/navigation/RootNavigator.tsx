import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientStack from '@screens/client/ClientStack';
import ReaderStack from '@screens/reader/ReaderStack';
import AdminStack from '@screens/admin/AdminStack';
import LoginStack from '@screens/auth/LoginStack';
import { useAuth } from '@store/authContext';

export type RootStackParamList = {
  AuthStack: undefined;
  Client: undefined;
  Reader: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, role } = useAuth();
  
  console.log('RootNavigator - Current state:', { isAuthenticated, role });
  console.log('RootNavigator - State type check:', typeof isAuthenticated, typeof role);
  
  if (!isAuthenticated) {
    console.log('RootNavigator - User not authenticated, showing LoginStack');
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthStack" component={LoginStack} />
      </Stack.Navigator>
    );
  }

  // Usuario autenticado - mostrar stack según rol
  console.log('RootNavigator - User authenticated, showing stack for role:', role);
  console.log('RootNavigator - Role comparison:', {
    'role === Cliente': role === 'Cliente',
    'role === Lector': role === 'Lector',
    'role === Admin': role === 'Admin'
  });
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'Cliente' && (
        <Stack.Screen name="Client" component={ClientStack} />
      )}
      {role === 'Lector' && (
        <Stack.Screen name="Reader" component={ReaderStack} />
      )}
      {role === 'Admin' && (
        <Stack.Screen name="Admin" component={AdminStack} />
      )}
    </Stack.Navigator>
  );
}


