import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { useRouter } from 'expo-router';
import { User } from '../models/User';

export default function CreateClassroom() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const router = useRouter();

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleCreateClassroom = async () => {
    if (!name) {
      showAlert('Missing Fields', 'Please enter classroom name.');
      return;
    }

    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) {
        showAlert('Error', 'User not found. Please login again.');
        return;
      }

      const user: User = JSON.parse(userString);
      const teacherId = user.user_id;

      await api.post('/classrooms', {
        name: name,
        teacher_id: teacherId,
      });

      showAlert('Success', 'Classroom created successfully!');
      router.replace('/classroom/teacher');
    } catch (error: any) {
      console.error(error);
      showAlert('Error', error.response?.data?.message || 'Failed to create classroom.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Classroom</Text>

      <TextInput
        style={styles.input}
        placeholder="Classroom Name (e.g., Grade 10 - Math)"
        value={name}
        onChangeText={setName}
      />

      <Button title="Create Classroom" onPress={handleCreateClassroom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f1faee',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1d3557',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
