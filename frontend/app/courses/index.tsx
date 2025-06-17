import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import api from "../../api/api";

export default function CoursesScreen() {
  const router = useRouter();

  type Course = {
    id: string;
    name: string;
    author: string;
    date: string;
    description: string;
    topicId: string;
  };

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Alert wrapper for web and app
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleCoursePress = (course_id: string) => {
    router.push(`/courses/${course_id}`);
  };

  const fetchAllCourses = async () => {
    try {
      const response = await api.get(`/courses`);
      //const data = await response.json();
      const data = response.data;
      const courseArray = Array.isArray(data.body) ? data.body : [];
      const normalizedCourses: Course[] = courseArray.map((course: any) => ({
        id: course.course_id,
        name: course.title,
        author: course.author,
        date: course.created_at,
        description: course.description,
        topicId: course.topic_id,
      }));

      setCourses(normalizedCourses);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      showAlert("Error", "Unable to load all courses.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TouchableOpacity
        onPress={() => router.push("/")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.header}>All Courses</Text>

      {courses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.courseCard}
          activeOpacity={0.9}
          onPress={() => handleCoursePress(course.id)}
        >
          <Text style={styles.courseTitle}>{course.name}</Text>
          <Text style={styles.courseMeta}>
            By {course.author} | {course.date}
          </Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "lightblue" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },

  courseCard: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  courseTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },

  courseMeta: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },

  courseDescription: {
    fontSize: 15,
    color: "#444",
  },

  backButton: {
    marginBottom: 10,
    marginTop: 20,
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});
