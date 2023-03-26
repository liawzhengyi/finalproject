import React, { useState } from "react";
import { Text, ScrollView, KeyboardAvoidingView, Keyboard, View, TextInput, TouchableOpacity, TouchableWithoutFeedback  } from "react-native";
import { styles } from './AddTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditNote = ({route,  navigation, ...props}) => {
    const {i, n} = route.params;
    const [newEdit, setNewEdit] = useState(n)

    function NotesEdited(){
        let edited = [...props.homeNote];
        edited[i] = newEdit;
        props.setHomeNote(edited);

        navigation.navigate('Tasks');

        AsyncStorage.setItem('storedNotes', JSON.stringify(edited)).then(() => {
            setHomeNote(edited)
          }).catch(error => console.log(error))
    }

    return(
        <ScrollView>
            <KeyboardAvoidingView>
            

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style = {{padding: 20, justifyContent: 'space-around'}}>

                        <TextInput style = {[styles.input]} placeholder='Type here...' 
                        multiline={true}
                        value= {newEdit.toString()} onChangeText = {(text) => setNewEdit(text)}
                        />

                        <TouchableOpacity style={styles.button} onPress={() => NotesEdited()}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default EditNote;