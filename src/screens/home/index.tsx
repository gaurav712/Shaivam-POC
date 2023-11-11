import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
//import {data} from '../../data';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getLatestVersion = async () => {
      const savedData = await AsyncStorage.getItem('latestDB');
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    };

    getLatestVersion();
  }, []);

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
      <View style={styles.fab}>
        <Text style={styles.textFab}>Update</Text>
      </View>
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
