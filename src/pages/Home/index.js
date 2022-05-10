import React, { useContext } from 'react';
import { View, Text, StatusBar, Button } from 'react-native';

import { AuthContext } from '../../contexts/auth';

export default function Home() {

  const { user, signOut } = useContext(AuthContext);

  return (
    <View>
      <StatusBar backgroundColor="#131313" barStyle="light-content" />
      <Text>Home</Text>
      <Text>{ user && user.nome }</Text>
      <Button title='Sair da conta' onPress={() => signOut()}/>
    </View>
  );
}