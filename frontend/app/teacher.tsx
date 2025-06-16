import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function TeacherDashboard() {
  const router = useRouter();

  // Sample data for display
  const stats = [
    { label: "Courses", value: 12 },
    { label: "Students", value: 340 },
    { label: "Pending Approvals", value: 5 },
  ];

  const courses = [
    { id: 1, title: "React Native Basics", students: 40 },
    { id: 2, title: "Advanced JavaScript", students: 25 },
    { id: 3, title: "UI/UX Fundamentals", students: 18 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText} onPress={() => router.back()}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher's Dashboard</Text>
      </View>

      {/* Welcome */}
      <Text style={styles.welcomeText}>Welcome back, Teacher!</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Courses List */}
      <Text style={styles.sectionTitle}>Your Courses</Text>
      {courses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDetail}>{course.students} students enrolled</Text>
        </View>
      ))}

      {/* Add Course Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => alert("Add Course pressed!")}>
        <Text style={styles.addButtonText}>+ Add New Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "lightblue",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#264653",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    color: "#2a9d8f",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#e9ecef",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#264653",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#264653",
  },
  courseCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1d3557",
  },
  courseDetail: {
    fontSize: 14,
    color: "#555",
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
