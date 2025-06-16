import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { Platform } from 'react-native';
import { User } from "../models/User";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Change depending on platform
  const API_BASE = Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api' // Android emulator
    : 'http://localhost:8080/api'; // iOS simulator or web

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = () => {
    router.push("/register"); // Navigate to register page
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Missing fields', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      const user: User  = response.data.body; // user object from backend

      //store in local storage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      showAlert('AITUTOR', 'Login Successful');
      router.replace('/'); // navigate to home
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      showAlert('AITUTOR', 'Login Failed: ' + errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>

      <View style={styles.titlecard}>
        <Text style={styles.appTitle}>AITUTOR</Text>

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
      
      <Text style={styles.clickablelink} onPress={handleRegister}>New Here?</Text>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} >
        <Text style={styles.backButtonText}>Login</Text>
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