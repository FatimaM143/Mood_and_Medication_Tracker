import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#ffffff',
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};


function Analysis() {
  const [data, setData] = useState({
    labels: [], // days of the week
    datasets: [
      {
        data: [], // mood data
      },
      {
        data: [], // medication data
      },
    ],
  });

  const moodValues = {
    Sad: 1,
    Worried: 2,
    Happy: 3,
    Excited: 4,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moodData = JSON.parse(await AsyncStorage.getItem('moodData'));
        const medicationData = JSON.parse(await AsyncStorage.getItem('medicationData'));

        // Filter data for the last 7 days
        const today = new Date();
        const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

        const filteredMoodData = moodData.filter(
          (item) => new Date(item.date) >= weekAgo && new Date(item.date) < today
        );

        const filteredMedicationData = medicationData.filter(
          (item) => new Date(item.date) >= weekAgo && new Date(item.date) < today
        );

        // Process data for chart
        const labels = filteredMoodData.map((item) => new Date(item.date).toLocaleDateString());
        const moodDataset = filteredMoodData.map((item) => moodValues[item.mood]);
        const medicationDataset = filteredMedicationData.map((item) => (item.taken ? 1 : 0));

        setData({
          labels,
          datasets: [
            { data: moodDataset },
            { data: medicationDataset },
          ],
        });
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <LineChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
    />
  );
}

export default Analysis;
