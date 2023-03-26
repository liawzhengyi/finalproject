import React from "react";
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { styles } from "./ToDoList";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeletedList = ({...props}) => {

    function permanentlyDelete(){
        Alert.alert(
            'Delete All',
            'Are you sure you want to delete?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        let emptyArray = [...props.deleteToBin];
                        emptyArray = [];
                        props.setDeleteToBin(emptyArray);

                        AsyncStorage.setItem('deletedNotes', JSON.stringify(emptyArray)).then(() => {
                            props.setDeleteToBin(emptyArray)
                        }).catch(error => console.log(error))
                    }
                }
            ]
        )
    }

    function undoDeletedItems() {
        let deletedNotes = [...props.deleteToBin];
        let homeNote = [...props.homeNote];
        deletedNotes.forEach((item, index) => {
            homeNote.push(item)
        })
        props.setDeleteToBin([]);
        props.setHomeNote(deletedNotes);

        AsyncStorage.setItem('storedNotes', JSON.stringify(homeNote)).then(() => {
            props.setHomeNote(homeNote)
        }).catch(error => console.log(error))

        AsyncStorage.setItem('deletedNotes', JSON.stringify([])).then(() => {
            props.setDeleteToBin([]);
        }).catch(error => console.log(error))
    }

    function undoNote(index){
        let retrieveNote = props.deleteToBin[index];
        let array = [retrieveNote, ...props.homeNote];
        props.setHomeNote(array);

        let newArray = [...props.deleteToBin];
        newArray.splice(index, 1);
        props.setDeleteToBin(newArray);

    }

    function permanentDeleteNote(index){
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        let newArray = [...props.deleteToBin];
                        newArray.splice(index, 1);
                        props.setDeleteToBin(newArray);

                        AsyncStorage.setItem('deletedNotes', JSON.stringify(newArray)).then(() => {
                            props.setDeleteToBin(newArray)
                        }).catch(error => console.log(error))
                    }
                }
            ]
        )
    }

    return (
        <ScrollView>

            <View style={[styles.notesContainer]}>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

                    <TouchableOpacity style={styles.emptyButton} onPress={() => undoDeletedItems()}>
                        <Text style={style.emptyButtonText}> Undo All</Text>
                    </TouchableOpacity>

                    <Text style={{fontWeight: '700', fontSize: 18, color: 'black'}}>
                        Total:{props.deleteToBin.length}
                    </Text>

                    <TouchableOpacity style={styles.emptyButton} onPress={() => permanentlyDelete()}>
                        <Text style={style.emptyButtonText}>Delete All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}></View>


                {props.deleteToBin.length === 0
                ?
            
            
                <View style = {styles.emptyNoteContainer}>
                    <Text style={styles.emptyNoteText}>No notes are deleted</Text>
                </View>
                :
                
                props.deleteToBin.map((item, index) => 
                    <View style={styles.item} key={index}>
                        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                            <View style={styles.note}>
                                <Text style={styles.index}>{index + 1}.</Text>
                                <Text style={styles.text}>{item}</Text>
                            </View>

                            <TouchableOpacity onPress={() => undoNote(index)}>
                                <Text style={styles.delete}>Undo</Text>
                            </TouchableOpacity>
                        </View>

                        <View style= {styles.dateContainer}>
                            <Text>Date: {props.date}</Text>

                            <TouchableOpacity onPress={() => permanentDeleteNote(index)}>
                                <Text style={styles.delete}>Delete</Text>
                            </TouchableOpacity>                      
                        </View>

                    </View>
                )}
            </View>

        </ScrollView>
    )
}

export const style = StyleSheet.create({
    emptyButton: {
        backgroundColor: 'grey',
        width: '25%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        marginBottom: '700'
    },
    emptyButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '700'
    }
})
export default DeletedList;