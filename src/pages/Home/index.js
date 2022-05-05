import React from 'react';
import { View, Text, StatusBar } from 'react-native';

export default function Home() {
  return (
    <View>
      <StatusBar backgroundColor="#131313" barStyle="light-content" />
      <Text>Home</Text>
    </View>
  );
}