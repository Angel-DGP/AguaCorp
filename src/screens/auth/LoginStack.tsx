import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SecondAuthScreen from './SecondAuthScreen';

export type LoginStackParamList = {
  Login: undefined;
  SecondAuth: {
    meterCode: string;
    userType: 'Lector' | 'Admin';
  };
};

const Stack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SecondAuth" component={SecondAuthScreen} />
    </Stack.Navigator>
  );
}
