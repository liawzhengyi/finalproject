import React, {useEffect, useState} from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView, Image, Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const ToDoList = ({navigation, ...props}) => {

    const [searchList, setSearchList] = useState();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    function deleteNote(index){
        let newArray = [...props.homeNote];
        let goToBin = newArray.splice(index, 1);
        props.setHomeNote(newArray);
        props.setDeleteToBin(goToBin);

        let bin = [goToBin, ...props.deleteToBin];
        props.setDeleteToBin(bin);

        AsyncStorage.setItem('storedNotes', JSON.stringify(newArray)).then(() => {
            props.setHomeNote(newArray)
        }).catch(error => console.log(error))

        AsyncStorage.setItem('deletedNotes', JSON.stringify(bin)).then(() => {
            props.setDeleteToBin(bin)
        }).catch(error => console.log(error))
    }

    function search() {
        if(searchList === ''){
            Alert.alert('Type something in search box');
        }else if (searchList !== ''){
            props.homeNote.forEach((item, index) => {
                if(item.includes(searchList)){
                    let searchItem = [...props.homeNote];
                    let firstElOfArray = searchItem[0];
                    let index = [...props.note].indexOf(item);
                    searchItem[0] = item;
                    searchItem[index] = firstElOfArray;
                    props.setHomeNote(searchItem);
                }
            })
        }
        setSearchList('');

        Keyboard.dismiss(); 
    }

    function clearAllNotes(){
        Alert.alert(
            'Clear all notes',
            'Are you sure you want to clear all notes?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {     
                        let emptyArray = [...props.homeNote];
                        let deletedArray = [...props.deleteToBin];
                        emptyArray.forEach ((item, index) => {
                        deletedArray.push(item);
                        })
                        emptyArray = [];
                        props.setHomeNote(emptyArray);
                        props.setDeleteToBin(deletedArray);
                }
                }
            ]
        )
    }

    useEffect(() => {
        (async() => {
          let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              // the user has denied or auto deny
              setErrorMsg("Permission denied");
              return;
            }
    
            let loc = await Location.getCurrentPositionAsync({});
    
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=de2306108b0783ef27c0859416a1f6c6`, {
              method:"POST",
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then((response) => response.json())
            .then((json) => {
              console.log(json);
              setLocation(json);
              console.log(json);
            })
            .catch((error) => {
              console.log(error);
            }).finally(() => {
                setLoading(false)
            });
    
        })();
      }, []);

      
    

    return (
        <View style={[styles.notesContainer]}>

            <View style={styles.headingContainer}>

                <Text style={styles.heading}>Trackist</Text>

                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.weatherButton, {marginRight: 40}]}> 
                        {loading? <Text>loading</Text>:<Image source= {{ uri: `http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}} style={{width:50, height:50}} /> }
                    </View>
                    
                    <TouchableOpacity style={[styles.button, {marginLeft: 10}]} onPress={() => navigation.navigate('Bin')}>
                        <Text style={{fontWeight: '800', fontSize: 14}}>Bin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('Add Task')}>
                        <Text style={{fontWeight: '800', fontSize: 14}}>Add Task</Text>
                    </TouchableOpacity>
        
                </View>

            </View>

            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <Text style={{fontWeight: '700', fontSize: 18, color: 'grey'}}>
                    Total: {props.homeNote.length}
                </Text>

                <TouchableOpacity style={[styles.clearButton,  {marginLeft: 20}]} onPress= {() => clearAllNotes()}>
                    <Text>Clear all tasks</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.divider}></View>
            <View style={styles.searchContainer}>
                <TextInput placeholder="Search..." placeholderTextColor="black" style={[styles.input, {borderWidth: 5}]}
                value={searchList} onChangeText = {(text) => setSearchList(text)}/>

                <TouchableOpacity style={[styles.searchButton, {width: 100}]} onPress={() => search()}>
                    <Text style={{fontWeight: '800', fontSize: 14, color:"black"}}>Search</Text>
                </TouchableOpacity>

            </View>
       
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {props.homeNote.length === 0
                ?
                
                <View style={styles.emptyNoteContainer}>
                    <Text style={styles.emptyNoteText}>No task. Press "add task" to start adding.</Text>
                </View>
                :
                
                props.homeNote.map((item, index) => 

                    <View style={styles.item} key={index}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>


                        <View style={styles.note}>
                            <Text style={styles.index}>{index + 1}.</Text>
                            <Text style={styles.text}>{item}</Text>
                        </View>

                        <TouchableOpacity onPress={() => deleteNote(index)}>
                            <Text style={styles.delete}>X</Text>
                        </TouchableOpacity>
                        
                    </View>

                    <View style= {styles.dateContainer} >
                        <Text>Date: {props.date}</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Edit Task', {
                            i: index,
                            n: item
                        })}>
                            <Text style={styles.delete}>Edit</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                )}
            </ScrollView>
        </View>
    )
}

export const styles = StyleSheet.create({
    notesContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        marginBottom: 70,
        opacity: 0.9
    },
    heading: {
        fontSize: 30,
        fontWeight: '700',
        color: "#ADD8E6"
    },
    divider: {
        width: '100%',
        height: 5,
        backgroundColor: "#ADD8E6",
        marginTop: 5,
        marginBottom: 5
    },
    item: {
        marginBottom: 20,
        padding: 15,
        color: 'black',
        opacity: 0.8,
        marginTop: 10,
        backgroundColor: 'white',
        borderColor: '#ADD8E6',
        borderWidth: 2,
    },
    index: {
        fontSize: 20,
        fontWeight: '800',
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#90ee90',
        width: 60,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        height: 60,
        
    },
    weatherButton: {
        backgroundColor: '#ADD8E6',
        width: 60,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        height: 60
    },
    buttonText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '800'
    },
    scrollView: {
        marginBottom: 70
    },
    note: {
        flexDirection:'row',
        width: '75%'
    },
    text: {
        fontWeight: '700',
        fontSize: 17,
        alignSelf: 'center'
    },
    delete: {
        color: 'grey',
        fontWeight: '700',
        fontSize: 15
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        width: '60%',
        fontSize: 19,
        color: 'black',
        fontWeight: '600',
        backgroundColor: 'white',
        borderColor: '#ADD8E6',
        borderWidth: 2,
        borderRadius: 10
    },

    clearButton: {
        backgroundColor: '#FFCCCB',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        borderRadius: 5,
        height: 40,
        fontWeight: '700',
    },
    emptyNoteContainer: {
        alignItems: 'center',
        marginTop: 240
    },
    emptyNoteText: {
        color: 'grey',
        fontWeight: '600',
        fontSize: 15
    },
    dateContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:20
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },
    searchButton: {
        backgroundColor: '#ADD8E6',
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        borderRadius: 5,
        height: 40,
        marginRight: 40
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12
    }

})

export default ToDoList;