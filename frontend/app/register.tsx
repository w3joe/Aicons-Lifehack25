import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api'; // adjust path as needed

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    // TODO: Add real authentication logic here
    else { 
        try {
      const response = await api.post('http://localhost:8080/api/users', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
      Alert.alert('Registration Successful', 'Please login to continue.');
      router.push('/login'); // navigate to login page
    } else {
      Alert.alert('Registration Failed', 'Unexpected server response.');
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed';
    Alert.alert('Register Failed', message);
  }
  };
}

    return (
        <View style={styles.container}>
              <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back to Home</Text>
              </TouchableOpacity>
        
              <View style={styles.titlecard}>
                <Text style={styles.appTitle}>First Time?</Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                autoCapitalize="none"
                keyboardType="default"
                onChangeText={setUsername}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
              />
        
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
        
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
                <Text style={styles.backButtonText}>Register</Text>
              </TouchableOpacity>
              </View>
            </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'lightblue',},
  appTitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 50, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  background: {
    flex: 1,              // takes up the entire screen
    width: '100%',
    height: '100%',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  
  backButton: {
  position: 'absolute',
  zIndex: 10,
  top: 40,
  left: 20,
  backgroundColor: '#007AFF',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  },

  backButtonText: {
  color: '#fff',
  fontWeight: '500',
  },

  loginButton : {
  marginBottom: 20,
  alignSelf: 'center',
  backgroundColor: '#007AFF',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8, 
  },

  titlecard: {
    padding: 10,
    borderRadius : 50,
    backgroundColor: '#E3E3E3',
    alignSelf: 'center',
    justifyContent: 'center',
    width : '80%',
    height : '60%',
    maxWidth : 400,
    maxHeight : 600,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 10,
  },

  clickablelink: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
    marginBottom: 20,
    marginLeft: 10,
  },
});