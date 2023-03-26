import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ToDoList from './components/ToDoList';
import AddTask from './components/AddTask';
import DeletedList from './components/Bin';
import EditNote from './components/EditTask';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

export default function App() {

  const [note, setNote] = useState();
  const [homeNote, setHomeNote] = useState([]);
  const [date, setDate] = useState(new Date().toUTCString());
  const [deleteToBin, setDeleteToBin] = useState([]);

  function writeNote() {
    let newNote = note;
    let newNotes = [newNote, ...homeNote];
    setHomeNote(newNotes);
    setNote('');

    AsyncStorage.setItem('storedNotes', JSON.stringify(newNotes)).then(() => {
      setHomeNote(newNotes)
    }).catch(error => console.log(error))

    AsyncStorage.setItem('date',JSON.stringify(date)).then(() => {
      setDate(date);
    })
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    AsyncStorage.getItem('storedNotes').then(data => {
      if(data !== null){
        setHomeNote(JSON.parse(data));
      }
    }).catch((error) => console.log(error))

    AsyncStorage.getItem('deletedNotes').then(data => {
      if(data !== null){
        setDeleteToBin(JSON.parse(data));
      }
    }).catch((error) => console.log(error))

    AsyncStorage.getItem('date');
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Tasks">
          {props => <ToDoList {...props} homeNote={homeNote} setHomeNote={setHomeNote} note={note} setNote={setNote} date={date} setDate={setDate} deleteToBin={deleteToBin} setDeleteToBin={setDeleteToBin}/>}
        </Stack.Screen>

        <Stack.Screen name="Add Task">
          {props => <AddTask {...props} note={note} setNote={setNote} writeNote={writeNote}/>}
        </Stack.Screen>

        <Stack.Screen name="Bin">
          {props => <DeletedList {...props} deleteToBin={deleteToBin} setDeleteToBin={setDeleteToBin} homeNote={homeNote} setHomeNote={setHomeNote} date={date}/>}
        </Stack.Screen>

        <Stack.Screen name="Edit Task">
          {props => < EditNote {...props} homeNote={homeNote} setHomeNote={setHomeNote}/>}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

