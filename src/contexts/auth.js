// contexto de autenticação

import React, { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { AsyncStorage } from 'react-native';

export const AuthContext = createContext({}); // valor padrao {}

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ loadingAuth, setLoadingAuth ] = useState(false);


    useEffect(() => { // executa essa função quando o app for inicializado

        async function loadStorage() {

            // verificando se há um usuario no local storage

            const storageUser = await AsyncStorage.getItem('Auth_user');

            if (storageUser) {

                setUser(JSON.parse(storageUser)); // convertendo dados para json
                setLoading(false);
            }

            setLoading(false);

        }

        loadStorage();

    }, []);

    // metodo de cadastrado de usuario

    async function signUp(email, password, nome) {

        setLoadingAuth(true);

         await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( async (value) => {

                let uid = value.user.uid;
                await firebase.database().ref('users').child(uid).set({
                    saldo: 0, // conta nova
                    nome: nome
                })
                    .then(() => {

                        let data = {

                            uid: uid,
                            nome: nome,
                            email: value.user.email

                        }

                        setUser(data); // salvado dados no state
                        storageUser(data); // salvando dados no storage
                        setLoadingAuth(false);

                    })

            })
            .catch(err => {

                alert(err.code);
                setLoadingAuth(false);
            })

    }

    // metodo de login para usuarios

    async function signIn(email, password) {

        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                
                let uid = value.user.uid;

                await firebase.database().ref('users').child(uid).once('value') // once - so uma vez
                    .then((snapshot) => {

                        let data = {

                            uid: uid,
                            nome: snapshot.val().nome,
                            email: value.user.email
                        }

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false); // parou de exibir o loading

                    })

            })
            .catch(err => {

                alert(err.code);
                setLoadingAuth(false);

            })

    }

    // metodo para deslogar usuario

    async function signOut() {

        await firebase.auth().signOut();

        await AsyncStorage.clear()
            .then(() => {

                setUser(null);
            })

    }

    // metodo para salvar dados no asyncstorage

    async function storageUser(data) {

        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));

    }

    return (
                                    // verificando se há usuarios logados
        <AuthContext.Provider value={{ signed: !!user, user, signUp, signIn, signOut, loading, loadingAuth}}>

            {children}

        </AuthContext.Provider>

        // todos que estiver em volta do AuthContext tem acesso ao user, signUp

    );
}

export default AuthProvider;