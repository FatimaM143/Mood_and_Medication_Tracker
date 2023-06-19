import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Tracker</Text>
      <Button title="Add Medication" onPress={() => navigation.navigate('Add Medication')} />
      <Button title="Today" onPress={() => navigation.navigate('Today')} />
      <Button title="Analysis" onPress={() => navigation.navigate('Analysis')} />
      <Button title="Calendar" onPress={() => navigation.navigate('Calendar')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
