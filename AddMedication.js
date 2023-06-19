import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddMedication() {
  const [medicationList, setMedicationList] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    retrieveData();
  }, []);

  const handleMedicationAdd = async () => {
    if (medicationName === '') return;
    const medicationData = { name: medicationName, dosage, frequency };
    const newMedicationList = [...medicationList, medicationData];
    setMedicationList(newMedicationList);
    setMedicationName('');
    setDosage('');
    setFrequency('');
    await AsyncStorage.setItem('medicationData', JSON.stringify(newMedicationList));
  };

  const handleDelete = async (index) => {
    const updatedMedicationList = medicationList.filter((_, i) => i !== index);
    setMedicationList(updatedMedicationList);
    await AsyncStorage.setItem('medicationData', JSON.stringify(updatedMedicationList));
  };
  

  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('medicationData');
      if (value !== null) {
        setMedicationList(JSON.parse(value));
      }
    } catch (error) {
      
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add a new medication:</Text>
      <TextInput
        style={styles.input}
        value={medicationName}
        onChangeText={setMedicationName}
        placeholder="Medication name"
      />
      <TextInput
        style={styles.input}
        value={dosage}
        onChangeText={setDosage}
        placeholder="Dosage"
      />
      <TextInput
        style={styles.input}
        value={frequency}
        onChangeText={setFrequency}
        placeholder="Frequency"
      />
      <Button title="Add" onPress={handleMedicationAdd} />
      <FlatList
        data={medicationList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.medicationItem}>
            <View style={styles.medicationDetails}>
              <Text>{item.name}</Text>
              <Text>Dosage: {item.dosage}</Text>
              <Text>Frequency: {item.frequency}</Text>
            </View>
            <Button title="Delete" onPress={() => handleDelete(index)} />
          </View>
        )}
      />
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
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  
  medicationItem: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    marginBottom: 10,
    alignSelf: 'center',
  },
  medicationDetails: {
    alignItems: 'center', 
  },


});

