import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabs from './AdminTabs';
import AdminUserHistory from './AdminUserHistory';
import AdminEditReading from './AdminEditReading';
import AdminReaderHistory from './AdminReaderHistory';
import LogoutButton from '@components/ui/LogoutButton';

export type AdminStackParamList = {
  AdminTabs: undefined;
  AdminUserHistory: {
    meterNumber: string;
    customerName: string;
    customerCedula: string;
  };
  AdminEditReading: {
    readingId: string;
    meterNumber: string;
    customerName: string;
    customerCedula: string;
  };
  AdminReaderHistory: {
    readerId: string;
    readerName: string;
    readerCode: string;
  };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{
          title: 'Administrador',
          headerRight: () => <LogoutButton />
        }}
      />
      <Stack.Screen
        name="AdminUserHistory"
        component={AdminUserHistory}
        options={{ title: 'Historial del Cliente' }}
      />
      <Stack.Screen
        name="AdminEditReading"
        component={AdminEditReading}
        options={{ title: 'Editar Lectura' }}
      />
      <Stack.Screen
        name="AdminReaderHistory"
        component={AdminReaderHistory}
        options={{ title: 'Historial del Lector' }}
      />
    </Stack.Navigator>
  );
}


