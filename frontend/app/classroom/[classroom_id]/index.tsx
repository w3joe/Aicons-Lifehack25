// app/classroom/[id].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import api from "../../../api/api";

export default function ClassroomPage() {
  const { classroom_id, name } = useLocalSearchParams(); // dynamic route: [id].tsx
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classroomName, setClassroomName] = useState<string>("");


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

      <Text style={styles.classroomNameHeader}>{name}</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{students.length}</Text>
          <Text style={styles.summaryLabel}>Students</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{courses.length}</Text>
          <Text style={styles.summaryLabel}>Courses</Text>
        </View>
      </View>

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
  classroomNameHeader: {
  fontSize: 32,
  fontWeight: 'bold',
  marginTop: 24,
  marginBottom: 16,
  color: 'white',
  backgroundColor: '#2a9d8f',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignSelf: 'flex-start',
  },
  summaryContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 20,
  marginBottom: 20,
},
summaryCard: {
  backgroundColor: "#2a9d8f",
  padding: 20,
  borderRadius: 12,
  flex: 1,
  alignItems: "center",
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},
summaryNumber: {
  fontSize: 32,
  fontWeight: "bold",
  color: "white",
},
summaryLabel: {
  fontSize: 16,
  color: "white",
  marginTop: 4,
},
  addButton: {
  marginTop: 20,
  backgroundColor: "#2a9d8f",
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: "center",
  elevation: 2,
},
addButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
  textTransform: "uppercase",
  letterSpacing: 1,
},
});
