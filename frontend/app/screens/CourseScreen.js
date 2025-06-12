import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const topics = ['Topic 1', 'Topic 2', 'Topic 3'];

  const handleTopicPress = (topic) => {
    Alert.alert('Topic Selected', `You tapped on ${topic}`);
    // Or navigate to topic detail screen here if you have navigation
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Topics</Text>
      {topics.map((topic, index) => (
        <TouchableOpacity
          key={index}
          style={styles.topicCard}
          activeOpacity={0.7}
          onPress={() => handleTopicPress(topic)}
        >
          <Text style={styles.topicText}>📚 {topic}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  topicCard: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 30,
    borderRadius: 10,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    // elevation for Android
    elevation: 8,
  },
  topicText: { fontSize: 18 },
});
