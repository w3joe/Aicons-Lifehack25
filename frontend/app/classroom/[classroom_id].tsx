// app/classroom/[id].tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import api from "../../api/api";

export default function ClassroomPage() {
  const { classroom_id } = useLocalSearchParams(); // this is classroom_id
  const router = useRouter();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/classrooms/${classroom_id}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [classroom_id]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  backButton: { fontSize: 16, color: "#007AFF", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  studentCard: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 12,
  },
  studentName: { fontSize: 16, fontWeight: "600" },
  studentEmail: { fontSize: 14, color: "#666" },
});
