import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { User } from "../../models/User";
import { Course } from "../../models/Course";
import api from "../../api/api"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TeacherDashboard() {
  type Classroom = {
    classroom_id: number;
    teacher_id: string;
    name: string;
  };

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassroom] = useState<Classroom[]>([]);

  useEffect(() => {
  //load user upon opening teacher page
  const loadUserAndClassrooms  = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const parsedUser: User = JSON.parse(userJson);

        // Check for teacher role
        if (parsedUser.role !== "TEACHER") {
          router.replace("/"); // Redirect to home
          return;
        }

        setUser(parsedUser);

        // Fetch classrooms for this teacher
        const response = await api.get(`/teachers/${parsedUser.user_id}/classrooms`);
        setClassroom(response.data); // Assuming response.data is array of classrooms

      } else {
        router.replace("/login"); // Not logged in
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      router.replace("/login"); // Error loading user
    }
  };

  loadUserAndClassrooms ();
}, []);


  // Sample data for display
  const stats = [
    { label: "Courses", value: 12 },
    { label: "Students", value: 340 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText} onPress={() => router.push('/')}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher's Dashboard</Text>
      </View>

      {/* Welcome */}
      <Text style={styles.welcomeText}>
        {user ? `Welcome back, ${user.username}!` : "Welcome back, Teacher!"}
      </Text>

      {/* Stats 
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>*/}

      {/* Classroom List */}
      <Text style={styles.sectionTitle}>My Classrooms</Text>
      <View>
      {classrooms.map((classroom) => (
        <TouchableOpacity key={classroom.classroom_id} style={styles.courseCard}
          onPress={() => router.push(`../classroom/${classroom.classroom_id}?name=${encodeURIComponent(classroom.name)}`)}
        >
          <Text style={styles.courseTitle}>{classroom.name}</Text>
        </TouchableOpacity>
      ))}
      </View>

      {/* Add Classroom Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/addclassroom")}>
        <Text style={styles.addButtonText}>+ Add New Classroom</Text>
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
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
