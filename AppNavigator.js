import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomePage from './HomePage';
import AddMedication from './AddMedication';
import Tracker from './Tracker';
import Analysis from './Analysis';
import CalendarView from './CalendarView';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Add Medication" component={AddMedication} />
        <Tab.Screen name="Today" component={Tracker} />
        <Tab.Screen name="Analysis" component={Analysis} />
        <Tab.Screen name="Calendar" component={CalendarView} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
