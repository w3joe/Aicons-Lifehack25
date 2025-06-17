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
import api from '../../../api/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { User } from '../../../models/User';

export default function CreateClassroom() {
  const { classroom_id } = useLocalSearchParams(); // dynamic route: [id].tsx
  const [studentID, setStudentID] = useState('');
  const router = useRouter();

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleCreateClassroom = async () => {
    if (!studentID) {
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

      await api.put(`/classrooms/${classroom_id}/assign-student`, {
        student_id: studentID,
      });

      showAlert('Success', 'Student added successfully!');
      router.replace('/classroom/teacher');
    } catch (error: any) {
      console.error(error);
      showAlert('Error', error.response?.data?.message || 'Failed to create student.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Student ID</Text>

      <TextInput
        style={styles.input}
        placeholder="Student ID"
        value={studentID}
        onChangeText={setStudentID}
      />

      <Button title="Add Student" onPress={handleCreateClassroom} />
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
