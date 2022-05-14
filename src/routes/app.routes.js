// configurações de rotas do login, dashboard, registros, perfil

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// importando as pages

import Home from '../pages/Home';
import Profile from '../pages/Profile';
import New from '../pages/New';
import CustomDrawer from '../components/CustomDrawer';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';


const AppDrawer = createDrawerNavigator();

function AppRoutes() {

    return (

        <AppDrawer.Navigator
            drawerContent={props => <CustomDrawer {...props}/>}
            screenOptions={{
                drawerActiveBackgroundColor: '#00b94a',
                drawerActiveTintColor: '#fff',
                drawerInactiveBackgroundColor: '#000',
                drawerInactiveTintColor: '#ddd',
                drawerLabelStyle: {fontWeight: 'bold'},
                drawerStyle: {backgroundColor: '#171717'},
                drawerItemStyle: {marginVertical: 5}
            
            }}
            
        >

            <AppDrawer.Screen name='Home' component={Home} />
            <AppDrawer.Screen name='Registrar' component={New} />
            <AppDrawer.Screen name='Perfil' component={Profile} />

        </AppDrawer.Navigator>

    );
}

export default AppRoutes;