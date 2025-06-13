import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Later: authenticate user here
    alert('Logged in!');
    router.replace('/'); // or router.back() to return home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
