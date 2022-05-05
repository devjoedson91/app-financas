// contexto de autenticação

import React, { useState, createContext } from 'react';
import firebase from '../services/firebaseConnection';

export const AuthContext = createContext({}); // valor padrao {}

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    // metodo de cadastrado de usuario

    async function signUp(email, password, nome) {

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

                        setUser(data);

                    })

            })

    }

    return (
                                    // verificando se há usuarios logados
        <AuthContext.Provider value={{ signed: !!user, user, signUp}}>

            {children}

        </AuthContext.Provider>

        // todos que estiver em volta do contexto tenha acesso ao user

    );
}

export default AuthProvider;