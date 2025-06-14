import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    // TODO: Add real authentication logic here
    if (email === 'test@gmail.com' && password === 'password') {
      await AsyncStorage.setItem('userToken', 'mock-token'); // Store token
      Alert.alert('Login Successful');
      router.replace('/'); // Navigate to home screen
    } else {
      Alert.alert('Login Failed', 'Incorrect email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>

      <View style={styles.titlecard}>
        <Text style={styles.title}>Login</Text>

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
        <Text style={styles.backButtonText}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'lightblue',},
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
});