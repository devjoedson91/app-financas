import React, { useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { format, isPast } from 'date-fns';

import HistoricoList from '../../components/HistoricoList';

import { Background, Container, Nome, Saldo, Title, List } from './styles';

export default function Home() {

  const [ historico, setHistorico ] = useState([]);
  const [ saldo, setSaldo ] = useState(0);

  const { user } = useContext(AuthContext);

  const uid = user && user.uid; // uid do usuario logado

  // useEffect vai executar uma função quando app for iniciado

  useEffect(() => {

        async function loadList() {

            // obtendo o saldo do dia

            await firebase.database().ref('users').child(uid).on('value', snapshot => {

                setSaldo(snapshot.val().saldo);

            })

            // obtendo o historico

            await firebase.database().ref('historico') // pegue o nó/tabela historico
                .child(uid)
                .orderByChild('date')
                .equalTo(format(new Date(), 'dd/MM/yy'))
                .limitToLast(10).on('value', snapshot => {

                    setHistorico([]);

                    snapshot.forEach(childItem => {

                        let list = {

                            key: childItem.key,
                            tipo: childItem.val().tipo,
                            valor: childItem.val().valor,
                            date: childItem.val().date

                        }

                        setHistorico(oldArray => [...oldArray, list].reverse());

                    });

                })

        }

        loadList();

  }, []);

  function handleDelete(data) {

        if (isPast(new Date(data.date))) { // verificando se a data ja passou

            alert('Voce não pode excluir um registro antigo');
            return;

        }

        Alert.alert(
            'Cuidado Atenção',
            `Voce deseja excluir ${data.tipo} - valor: ${data.valor}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Continuar',
                    onPress: () => handleDeleteSuccess(data)
                }
            ]
        );

  }

  async function handleDeleteSuccess(data) {

        await firebase.database().ref('historico')
            .child(uid).child(data.key).remove()
                .then(async () => {

                    let saldoAtual = saldo;
                    data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor);

                    await firebase.database().ref('users').child(uid)
                        .child('saldo').set(saldoAtual);

                })
                .catch(error => console.log(error))

  }

  return (

      <Background>
          <Container>
                <Nome>{user && user.nome}</Nome>
                <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} </Saldo>
          </Container>

          <Title>Ultimas movimentações</Title>

          <List 
              showsVerticalScrollIndicator={false /* barra de rolagem lateral */}
              data={historico}
              keyExtractor={item => item.key}
              renderItem={({ item }) => ( <HistoricoList data={item} deleteItem={handleDelete} /> )}
          
          />


      </Background>

  );
}