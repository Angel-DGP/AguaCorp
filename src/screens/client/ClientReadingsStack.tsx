import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientWelcome from './ClientWelcome';
import ClientHistory from './ClientHistory';
import ClientReadingDetails from './ClientReadingDetails';
import LogoutButton from '@components/ui/LogoutButton';

export type ClientReadingsStackParamList = {
  ClientWelcome: undefined;
  ClientHistory: undefined;
  ClientReadingDetails: { readingId: string };
};

const Stack = createNativeStackNavigator<ClientReadingsStackParamList>();

export default function ClientReadingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen 
        name="ClientWelcome" 
        component={ClientWelcome} 
        options={{ 
          title: 'Lecturas',
          headerRight: () => <LogoutButton variant="default" />
        }} 
      />
      <Stack.Screen name="ClientHistory" component={ClientHistory} options={{ title: 'Historial' }} />
      <Stack.Screen name="ClientReadingDetails" component={ClientReadingDetails} options={{ title: 'Detalle de lectura' }} />
    </Stack.Navigator>
  );
}
