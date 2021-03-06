import React, { useContext, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Platform } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { format, isBefore } from 'date-fns';

import HistoricoList from '../../components/HistoricoList';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

import { Background, Container, Nome, Saldo, Title, List, Area } from './styles';

export default function Home() {

  const [ historico, setHistorico ] = useState([]);
  const [ saldo, setSaldo ] = useState(0);

  const { user } = useContext(AuthContext);

  const uid = user && user.uid; // uid do usuario logado

  const [newDate, setNewDate ] = useState(new Date());
  const [show, setShow] = useState(false);

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
                .equalTo(format(newDate, 'dd/MM/yyyy'))
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

        // criando configuração para exibir dados conforme a data informada

  }, [newDate]);

  function handleDelete(data) {

        // pegando data do item

        const [diaItem, mesItem, anoItem] = data.date.split('/');
        const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);

        // pegando data de hoje

        const formatDiaHoje = format(new Date(), 'dd/MM/yyyy');
        const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split('/');
        const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);

        if (isBefore(dateItem, dateHoje)) { // isbefora compara se a primeira data é anterior a segunda

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

  // metodo para mostrar calendario no picker

  function handleShowPicker() {

      setShow(true);

  }

  function handleClose() {
    
        setShow(false);

  }

  const onChange = (date) => {

        setShow(Platform.OS === 'ios');
        setNewDate(date);

  }

  return (

      <Background>
          <Container>
                <Nome>{user && user.nome}</Nome>
                <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} </Saldo>
          </Container>

          <Area>

                <TouchableOpacity onPress={handleShowPicker}>

                    <Icon name='event' color='#fff' size={30} />
                </TouchableOpacity>
          
                <Title>Ultimas movimentações</Title>
          
          </Area>

          <List 
              showsVerticalScrollIndicator={false /* barra de rolagem lateral */}
              data={historico}
              keyExtractor={item => item.key}
              renderItem={({ item }) => ( <HistoricoList data={item} deleteItem={handleDelete} /> )}
          
          />

          {
              show && (
                 <DatePicker 
                    onClose={handleClose}
                    date={newDate}
                    onChange={onChange}
                 />
              )
          }


      </Background>

  );
}