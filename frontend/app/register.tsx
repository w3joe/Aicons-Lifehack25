import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api'; // adjust path as needed

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);

    const showAlert = (title: string, message: string) => {
        if (Platform.OS === 'web') {
          alert(`${title}: ${message}`);
        } else {
          Alert.alert(title, message);
        }
      };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Missing fields', 'Please enter both email and password.');
      return;
    }

    // TODO: Add real authentication logic here
    else { 
      try {
      const response = await api.post('/users', {
        username,
        email,
        password,
        role: isTeacher ? "TEACHER" : "STUDENT",
      });

      if (response.status === 201) {
      showAlert('Registration Successful', 'Please login to continue.');
      router.push('/login'); // navigate to login page
    } else {
      showAlert('Registration Failed', 'Unexpected server response.');
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed';
    showAlert('Register Failed', message);
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

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setIsTeacher(!isTeacher)}
                  style={styles.checkbox}
                >
                  <Text style={styles.checkboxText}>{isTeacher ? "☑" : "☐"}</Text>
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Registering as a Teacher</Text>
              </View>
        
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
  checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  },
  checkbox: {
  marginRight: 8,
  },
  checkboxText: {
  fontSize: 20,
  },
  checkboxLabel: {
  fontSize: 16,
  },
});