import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Container, ButtonMenu } from './styles'; // a função desse botao é abrir o drawer

export default function Header() {

    const navigation = useNavigation();

    return (

        <Container>
            <ButtonMenu onPress={() => { navigation.toggleDrawer() }}>
                <Icon name='menu' color='#fff' size={30} />
            </ButtonMenu>
        </Container>

    );

}