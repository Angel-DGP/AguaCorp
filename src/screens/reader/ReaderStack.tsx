import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReaderHome from './ReaderHome';
import ReaderHistory from './ReaderHistory';
import ReaderEditReading from './ReaderEditReading';
import ReaderAddReading from './ReaderAddReading';
import LogoutButton from '@components/ui/LogoutButton';

export type ReaderStackParamList = {
  ReaderHome: undefined;
  ReaderHistory: { meterNumber: string; customerName: string };
  ReaderEditReading: { readingId: string; meterNumber: string; customerName: string };
  ReaderAddReading: { 
    meterNumber: string; 
    customerName: string; 
    customerCedula: string; 
    lastReading?: number; 
  };
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
      <Stack.Screen name="ReaderAddReading" component={ReaderAddReading} options={{ title: 'Nueva Lectura' }} />
    </Stack.Navigator>
  );
}


