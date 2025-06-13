import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const courses = [
  { id: 1, name: 'Course 1', author: 'Alice', date: '2025-06-12' },
  { id: 2, name: 'Course 2', author: 'Bob', date: '2025-05-20' },
  { id: 3, name: 'Course 3', author: 'Carol', date: '2025-04-15' },
];

  const handleSeeMore = () => {
    navigation.navigate('Courses'); // navigates to CourseScreen via stack
  };

  const handleTopicPress = (courses) => {
    Alert.alert('Course Selected', `You tapped on ${courses}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>LEETFUTURE</Text>

      <View
        style={styles.titlecard}
      >
      <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>📚 Courses</Text>
      <Text style={styles.seeMore} onPress={() => Alert.alert('See More Courses')}>See More</Text>
      </View>

      {courses.map((course, index) => (
        <TouchableOpacity
          key={index}
          style={styles.subcard}
          activeOpacity={0.8}
          onPress={() => handleTopicPress(course.name)}
        >
          <Text style={styles.cardTitle}>{course.name}</Text>
          <Text style={styles.cardDetail}>By {course.author}</Text>
          <Text style={styles.cardDetail}>Created on {course.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View
        style={styles.titlecard}
      >
        <Text style={styles.sectionTitle}>📊 Quizzes</Text>
      </View>

      <View
        style={styles.titlecard}
      >
        <Text style={styles.sectionTitle}>📥 Offline Downloads</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 10},

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titlecard: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    marginBottom: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    // Android elevation
    elevation: 10,
  },

  subcard: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    // Android elevation
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  cardDetail: {
    fontSize: 14,
    color: '#555',
  },

  seeMore: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
    marginBottom: 20,
    marginTop: 10,
  },
});
