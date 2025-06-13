import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CoursesScreen() {
  const router = useRouter();

  const courses = [
    { id: 1, name: 'Course 1', author: 'Alice', date: '2025-06-12', description: 'Detailed overview of Course 1' },
    { id: 2, name: 'Course 2', author: 'Bob', date: '2025-05-20', description: 'Master the basics of Course 2' },
    { id: 3, name: 'Course 3', author: 'Carol', date: '2025-04-15', description: 'In-depth learning with Course 3' },
  ];

  const handleCoursePress = (courseName: string) => {
    alert(`You selected ${courseName}`);
    // Optionally: router.push(`/courses/${id}`) if you later create dynamic pages
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>All Courses</Text>

      {courses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.courseCard}
          activeOpacity={0.9}
          onPress={() => handleCoursePress(course.name)}
        >
          <Text style={styles.courseTitle}>{course.name}</Text>
          <Text style={styles.courseMeta}>By {course.author} | {course.date}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },

  courseCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  courseTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },

  courseMeta: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },

  courseDescription: {
    fontSize: 15,
    color: '#444',
  },
});
