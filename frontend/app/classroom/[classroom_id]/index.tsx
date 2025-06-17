// app/classroom/[id].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import api from "../../../api/api";

export default function ClassroomPage() {
  const { classroom_id } = useLocalSearchParams(); // dynamic route: [id].tsx
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/classrooms/${classroom_id}/students`);
        setStudents(response.data.body);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await api.get(`/classrooms/${classroom_id}/courses`);
        setCourses(response.data.body);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (classroom_id) {
      fetchStudents();
      fetchCourses();
    }
  }, [classroom_id]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Students Section */}
      <Text style={styles.title}>Students in Class</Text>
      
      {students.length > 0 ? (
        students.map((student: any) => (
          <View key={student.user_id} style={styles.studentCard}>
            <Text style={styles.studentName}>{student.username}</Text>
            <Text style={styles.studentEmail}>{student.email}</Text>
          </View>
        ))
      ) : (
        <Text>No students found in this class.</Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push(`/classroom/${[classroom_id]}/addstudent`)}>
        <Text style={styles.addButtonText}>+ Add New Student</Text>
      </TouchableOpacity>

      {/* Courses Section */}
      <Text style={[styles.title, { marginTop: 30 }]}>Class Courses</Text>
      {courses.length > 0 ? (
        courses.map((course: any) => (
          <View key={course.course_id} style={styles.courseCard}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDetail}>Description: {course.description}</Text>
          </View>
        ))
      ) : (
        <Text>No courses found for this class.</Text>
      )}
      {/* Add Course Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push(`/classroom/${[classroom_id]}/addcourse`)}>
        <Text style={styles.addButtonText}>+ Add New Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "lightblue"},
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  studentCard: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 12,
  },
  studentName: { fontSize: 16, fontWeight: "600" },
  studentEmail: { fontSize: 14, color: "#666" },
  courseCard: {
    padding: 15,
    backgroundColor: "#dfe6e9",
    borderRadius: 8,
    marginBottom: 12,
  },
  courseTitle: { fontSize: 16, fontWeight: "600", color: "#2d3436" },
  courseDetail: { fontSize: 14, color: "#636e72" },

  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  
  addButton: {
    marginTop: 25,
    backgroundColor: "#2a9d8f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
