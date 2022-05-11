import React, { useState } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { Background, Input, SubmitButton, SubmitText } from './style';
import Picker  from '../../components/Picker';

export default function New() {

    const [ valor, setValor ] = useState('');
    const [ tipo, setTipo ] = useState('Receita');
    

    return(

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss() }>
            <Background>

                <SafeAreaView style={{alignItems: 'center'}}>

                    <Input 
                        placeholder='Valor desejado'
                        keyboardType='numeric'
                        returnKeyType='next'
                        onSubmitEditing={() => Keyboard.dismiss() }
                        value={valor}
                        onChangeText={ (text) => setValor(text) }
                    
                    />

                    <Picker 
                        onChange={setTipo}
                        tipo={tipo}
                    />

                    <SubmitButton>

                        <SubmitText>Registrar</SubmitText>

                    </SubmitButton>

                </SafeAreaView>
              
            </Background>
        </TouchableWithoutFeedback>

    );


}