import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export function Loader() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <ActivityIndicator size="large" color="#0ea5e9" />
    </View>
  );
}


