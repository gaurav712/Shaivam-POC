import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {data as embeddedData} from '../../data';

export default function Home() {
  const [data, setData] = useState(embeddedData);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading ...');

  /* Get latest DB from the disk */
  const getSavedVersion = async () => {
    const savedData = await AsyncStorage.getItem('latestDB');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  };

  useEffect(() => {
    getSavedVersion();
  }, []);

  /* Get latest DB from the server */
  const getLatestVersion = async () => {
    const res = await fetch('http://192.168.1.40:3000/api/latest-db');
    const {data} = await res.json();

    /* Refresh the UI */
    setData(data);

    /* Save the data */
    console.log('Saving latest version...');
    await AsyncStorage.setItem('latestDB', JSON.stringify(data));
    console.log('Saved latest version.');
  };

  /* To compare two versions */
  const compareStr = (a: string, b: string) => {
    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
  };

  /* Callback for the update button */
  const handleFetchUpdate = async () => {
    setLoading(true);
    let updateAvailable = false;

    /* Check the latest version */
    const res = await fetch('http://192.168.1.40:3000/api/latest-version');
    const {version} = await res.json();

    /* Check existing version */
    const savedVersion = await AsyncStorage.getItem('version');
    if (savedVersion) {
      console.log('Saved Version:', savedVersion);
      console.log('Latest Version:', version);
      setLoadingText(`Latest: ${version}, Saved: ${savedVersion}`);
      /* Check if a later version is available */
      if (compareStr(savedVersion, version) === -1) {
        updateAvailable = true;
      }
    } else {
      console.log('There is no saved version');
      updateAvailable = true;
    }

    if (updateAvailable) {
      setLoadingText('Fetching latest version ...');
      await getLatestVersion();
      await AsyncStorage.setItem('version', version);
    }
    setLoading(false);
    setLoadingText('Loading ...');
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.container}>
      <View style={styles.elemContainer}>
        <Text style={styles.label}>Alias Model Name:</Text>
        <Text style={styles.text}>{item.AliasModelName}</Text>
      </View>

      <View style={styles.elemContainer}>
        <Text style={styles.label}>Make ID:</Text>
        <Text style={styles.text}>{item.MakeId}</Text>
      </View>

      <View style={styles.elemContainer}>
        <Text style={styles.label}>Make Name:</Text>
        <Text style={styles.text}>{item.MakeName}</Text>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList data={data} renderItem={renderItem} />
      <TouchableOpacity style={styles.fab} onPress={handleFetchUpdate}>
        <Text style={styles.textFab}>Update</Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={'large'} />
          <Text style={styles.textLoading}>{loadingText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffffdd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLoading: {
    fontSize: 16,
    marginTop: 10,
  },
  elemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
  },
  fab: {
    backgroundColor: 'teal',
    position: 'absolute',
    right: 30,
    bottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  textFab: {
    color: 'white',
    fontSize: 20,
  },
});
