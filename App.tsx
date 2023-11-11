/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './src/screens/home';

export default function App() {
  /* Check for the latest version */
  useEffect(() => {
    const checkLatestVersion = async () => {
      const res = await fetch('http://192.168.1.40:3000/api/latest-version');
      const {version} = await res.json();
      console.log('Version is:', version);
    };

    checkLatestVersion();
  }, []);

  useEffect(() => {
    const checkSavedVersion = async () => {
      try {
        const savedVersion = await AsyncStorage.getItem('version');

        if (savedVersion) {
          console.log('Saved Version:', savedVersion);
        } else {
          console.log('There is no saved version');
        }
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
      }
    };

    checkSavedVersion();
  }, []);

  useEffect(() => {
    const getLatestVersion = async () => {
      const res = await fetch('http://192.168.1.40:3000/api/latest-db');
      const {data} = await res.json();
      console.log(JSON.stringify(data, null, 2), '### Pooo');

      /* Save the data */
      console.log('Saving latest version...');
      await AsyncStorage.setItem('latestDB', JSON.stringify(data));
      console.log('Saved latest version.');
    };

    //getLatestVersion();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Home />
    </SafeAreaView>
  );
}
