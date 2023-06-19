import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [moodList, setMoodList] = useState([]);
  const [medicationTaken, setMedicationTaken] = useState(false);

  
  const formatDate = (date) => {
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());
    const year = String(date.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}-${month}-${day}`;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  

    AsyncStorage.getItem('moodData')
      .then((moodData) => {
        if (moodData) {
          const moods = JSON.parse(moodData);
          const moodForDate = moods.filter(mood => formatDate(new Date(mood.date)) === day.dateString);
          setMoodList(moodForDate.map(mood => mood.mood));
        }
      })
      .catch((error) => console.error(error));
  
    // Retrieve medication data for selected date
    AsyncStorage.getItem('medicationData')
      .then((medicationData) => {
        if (medicationData) {
          const meds = JSON.parse(medicationData);
          const medsForDate = meds.filter(med => formatDate(new Date(med.date)) === day.dateString);
          setMedicationTaken(medsForDate.some(med => med.taken));
        }
      })
      .catch((error) => console.error(error));
  };
  
  return (
    <View>
      <Calendar onDayPress={handleDayPress} />
      {selectedDate && (
        <View>
          <Text>Date: {selectedDate}</Text>
          {moodList.length > 0 ? (
            moodList.map((mood, index) => <Text key={index}>Mood: {mood}</Text>)
          ) : (
            <Text>Mood: None</Text>
          )}
          <Text>Medication Taken: {medicationTaken ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );
}
