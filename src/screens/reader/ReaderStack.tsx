import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReaderHome from './ReaderHome';
import ReaderHistory from './ReaderHistory';
import ReaderEditReading from './ReaderEditReading';
import LogoutButton from '@components/ui/LogoutButton';

export type ReaderStackParamList = {
  ReaderHome: undefined;
  ReaderHistory: { meterNumber: string; customerName: string };
  ReaderEditReading: { readingId: string; meterNumber: string; customerName: string };
};

const Stack = createNativeStackNavigator<ReaderStackParamList>();

export default function ReaderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen 
        name="ReaderHome" 
        component={ReaderHome} 
        options={{ 
          title: 'Lector',
          headerRight: () => <LogoutButton />
        }} 
      />
      <Stack.Screen name="ReaderHistory" component={ReaderHistory} options={{ title: 'Historial del Cliente' }} />
      <Stack.Screen name="ReaderEditReading" component={ReaderEditReading} options={{ title: 'Editar Lectura' }} />
    </Stack.Navigator>
  );
}


