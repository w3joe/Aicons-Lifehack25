import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api/api';
import { Picker } from '@react-native-picker/picker';
import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Course } from '../models/Course'

export default function CreateCourse() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loadingTopics, setLoadingTopics] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);

  const [createdCourse, setCourse] = useState<Course[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        const response = await api.get('/topics');
        setTopics(response.data.body);
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoadingTopics(false);
      }
    };

    const fetchClassrooms = async () => {
      try {
      setLoadingClassrooms(true);

      const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user: User = JSON.parse(userString);
          const teacherId = user.user_id;

          const response = await api.get(`/teachers/${teacherId}/classrooms`);
          setClassrooms(response.data);
        } else {
            console.warn("No user found in AsyncStorage.");
          }
      } catch (error) {
      console.error('Failed to load classrooms:', error);
    } finally {
    setLoadingClassrooms(false);
    }
  };

    fetchTopics();
    fetchClassrooms();
  }, []);

  const handleCreate = async () => {
    if (!title || !author || !selectedTopic || !selectedClassroom) {
      showAlert('Error', 'All fields are required.');
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

      const response = await api.post('/courses', {
        user_id: teacherId,
        topic_id: selectedTopic,
        title: title,
        author: author,
        description: description,
      });

      const course_id = response.data.course_id;

      await api.put(`/classrooms/${selectedClassroom}/assign-course`, {
        course_id: course_id
      });

      showAlert('Success', 'Course created!');
      router.replace('../classroom/teacher');
    } catch (error: any) {
      console.error('API error response:', error.response?.data);
      showAlert('Error', error?.response?.data?.message || 'Failed to create course');
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Topic Picker */}
      <Text style={styles.label}>Select Topic</Text>
      {loadingTopics ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Picker
          selectedValue={selectedTopic}
          onValueChange={(itemValue) => setSelectedTopic(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a topic..." value="" />
          {topics.map((topic: any) => (
            <Picker.Item key={topic.topic_id} label={topic.name} value={topic.topic_id} />
          ))}
        </Picker>
      )}

      {/* Classroom Picker */}
      <Text style={styles.label}>Select Classroom</Text>
      {loadingClassrooms ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Picker
          selectedValue={selectedClassroom}
          onValueChange={(itemValue) => setSelectedClassroom(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a classroom..." value="" />
          {classrooms.map((classroom: any) => (
            <Picker.Item
              key={classroom.classroom_id}
              label={classroom.name}
              value={classroom.classroom_id}
            />
          ))}
        </Picker>
      )}

      <Button title="Create Course" onPress={handleCreate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f1faee',
    flexGrow: 1,
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
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#264653',
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
