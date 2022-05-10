import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import { Container, Nome, NewLink, NewText, Logout, LogoutText } from './style';

export default function Profile() {

    const navigation = useNavigation();
    const { user, signOut } = useContext(AuthContext);

    return(
        <Container>
            
            <Nome>{user && user.nome}</Nome>
            <NewLink onPress={() => navigation.navigate('Registrar') /* esse Registrar é o que esta definido la no arquivo app.routes no drawer.sreen */ }>

                <NewText>Registrar gastos</NewText>

            </NewLink>

            <Logout onPress={() => signOut() }>
                <LogoutText>Sair</LogoutText>
            </Logout>
          
        </Container>
    );
}