import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api/api';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateCourse() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loadingTopics, setLoadingTopics] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        const response = await api.get('/topics');
        setTopics(response.data.body); // check `response.data` if wrapped
        setLoadingTopics(false);
      } catch (error) {
        console.error('Failed to load topics:', error);
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  const handleCreate = async () => {
    if (!title || !author) {
      showAlert('Error', 'All fields are required.');
      return;
    }

    try {
      await api.post('/courses', {
        topic_id: selectedTopic,
        title: title,
        author: author,
        description: description,
      });

      showAlert('Success', 'Course created!');
      router.replace('/teacher');
    } catch (error: any) {
      console.error('API error response:', error.response?.data);
      showAlert('Error', error?.response?.data?.message || 'Failed to create course');
    }
  };

    // Alert wrapper for web and app
    const showAlert = (title: string, message: string) => {
      if (Platform.OS === "web") {
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
