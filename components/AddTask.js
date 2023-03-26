import React from "react";
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, Keyboard, TouchableOpacity, Alert, Platform } from 'react-native';

const AddTask = ({navigation, ...props}) => {
    return (
        <ScrollView>
            <KeyboardAvoidingView> 
            
                
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style = {{padding: 20, justifyContent: 'space-around'}}>
                        <TextInput style = {[styles.input]} placeholder='Type here...' 
                        multiline={true} 
                        value={props.note} onChangeText={(text) => props.setNote(text)}/>

                        <TouchableOpacity style={styles.button} onPress={() => {
                            if(props.note === '') {
                                Alert.alert('Please type something');
                            } else{
                                props.writeNote();
                                navigation.navigate('Tasks')
                            }
                        }}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}


export const styles = StyleSheet.create({
    buttonText: {
        color:'white',
        fontSize: 20,
        fontWeight: '700'
    },
    button: {
        backgroundColor: 'grey',
        width: '40%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        alignSelf: 'flex-end',
        marginTop: 20
    },
    input: {
        padding: 20,
        paddingTop: 20,
        width: '100%',
        fontSize: 19, 
        color: 'black',
        fontWeight: '600',
        // opacity: 0.8,
        // shadowColor: 'grey',
        // shadowOpacity: 0.4,
        // shadowOffset: {width:0, height:4},
        // shadowRadius: 8,
        // elevation: 5,
        backgroundColor: 'white',
        borderColor: '#ADD8E6',
        borderWidth: 2,
        borderRadius: 5,
        height: 300
    },
    addNoteContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default AddTask;