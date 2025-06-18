import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) =>
    `${course.name} ${course.author}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAllCourses();
  }, []);

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

      <Text style={styles.header}>📘 All Courses</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search courses..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredCourses.map((course) => (
        <TouchableOpacity
          key={course.id}
          style={styles.courseCard}
          activeOpacity={0.9}
          onPress={() => handleCoursePress(course.id)}
        >
          <Text style={styles.courseTitle}>{course.name}</Text>
          <Text style={styles.courseMeta}>
            By {course.author} | {course.date ? course.date.slice(0, 10) : "N/A"}
          </Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    padding: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#2a9d8f",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  courseCard: {
    backgroundColor: "#fefefe",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },

  courseMeta: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },

  courseDescription: {
    fontSize: 15,
    color: "#333",
  },
});
