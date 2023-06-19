import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Button, StyleSheet, Text, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Gives each mood and medication a unique id so they can be deleted individually
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function Today() {
  const [moodList, setMoodList] = useState([]);
  const [medicationTaken, setMedicationTaken] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState([]);
  const [medicationList, setMedicationList] = useState([]);

  useEffect(() => {
    retrieveData();
  }, [selectedDate]);
  const handleMoodChange = async (newMood) => {
    setSelectedMood((prevSelectedMood) => {
      if (prevSelectedMood.includes(newMood)) {
        return prevSelectedMood.filter((mood) => mood !== newMood);
      } else {
        return [...prevSelectedMood, newMood];
      }
    });
  
    const newMoodData = {
      id: uuidv4(),
      mood: newMood,
      date: formatDate(selectedDate),
    };
  
    setMoodList((prevMoodList) => {
      const existingMoodIndex = prevMoodList.findIndex((item) => item.date === formatDate(selectedDate));
      let newMoodList;
  
      if (existingMoodIndex !== -1) {
        newMoodList = [...prevMoodList];
        newMoodList.splice(existingMoodIndex, 1, newMoodData);
      } else {
        newMoodList = [...prevMoodList, newMoodData];
      }
  
      AsyncStorage.setItem('moodData', JSON.stringify(newMoodList))
        .then(() => setMoodList(newMoodList))
        .catch((error) => console.error('Error storing mood data:', error));
  
      return newMoodList;
    });
  };
  


  const handleMedicationToggle = async (value) => {
    const existingMedIndex = medicationList.findIndex(item => item.date === formatDate(selectedDate));
    let newMedicationList;

    if (existingMedIndex !== -1) {
      newMedicationList = [...medicationList];
      newMedicationList.splice(existingMedIndex, 1);
    } else {
      const medicationData = { id: uuidv4(), taken: value, date: formatDate(selectedDate) };
      newMedicationList = [...medicationList, medicationData];
    }

    setMedicationTaken(value);
    setMedicationList(newMedicationList);
    await AsyncStorage.setItem('medicationData', JSON.stringify(newMedicationList));
  };

  const retrieveData = async () => {
    try {
      const moodValue = await AsyncStorage.getItem('moodData');
      if (moodValue !== null) {
        setMoodList(JSON.parse(moodValue));
  
        const selectedMoodData = JSON.parse(moodValue).filter(
          (item) => item.date === formatDate(selectedDate)
        );
        setSelectedMood(selectedMoodData.map((item) => item.mood));
      } else {
        setSelectedMood([]);
        setMoodList([]);
      }

      const medicationValue = await AsyncStorage.getItem('medicationData');
      if (medicationValue !== null) {
        setMedicationList(JSON.parse(medicationValue));
        const todayMedication = JSON.parse(medicationValue).find(item => item.date === formatDate(selectedDate));
        if (todayMedication) {
          setMedicationTaken(todayMedication.taken);
        } else {
          setMedicationTaken(false);
        }
      } else {
        setMedicationTaken(false);
      }
    } catch (error) {
      
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={(event, date) => {
          setSelectedDate(date);
        }}
      />

      <Text>How are you feeling today?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={selectedMood.includes('Happy') ? styles.selectedButton : styles.button}
          onPress={() => handleMoodChange('Happy')}>
          <Text style={styles.buttonText}>Happy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedMood.includes('Sad') ? styles.selectedButton : styles.button}
          onPress={() => handleMoodChange('Sad')}>
          <Text style={styles.buttonText}>Sad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedMood.includes('Worried') ? styles.selectedButton : styles.button}
          onPress={() => handleMoodChange('Worried')}>
          <Text style={styles.buttonText}>Worried</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedMood.includes('Excited') ? styles.selectedButton : styles.button}
          onPress={() => handleMoodChange('Excited')}>
          <Text style={styles.buttonText}>Excited</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Text>Have you taken your medication today?</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={medicationTaken ? styles.selectedButton : styles.button}
            onPress={() => handleMedicationToggle(true)}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={!medicationTaken ? styles.selectedButton : styles.button}
            onPress={() => handleMedicationToggle(false)}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50, 
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
  },
  selectedButton: {
    padding: 10,
    backgroundColor: '#aaf',
  },

  buttonText: {
    fontSize: 18,
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
});
