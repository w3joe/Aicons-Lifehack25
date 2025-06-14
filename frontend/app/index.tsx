import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on load
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus(); // to call the function upon startup
  }, []); // [] means it does not run again unless page refreshed

  // Handle Login/Logout button
  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      await AsyncStorage.removeItem("userToken");
      setIsLoggedIn(false);
      Alert.alert("Logged out");
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  const courses = [
    { id: 1, name: "Course 1", author: "Alice", date: "2025-06-12" },
    { id: 2, name: "Course 2", author: "Bob", date: "2025-05-20" },
    { id: 3, name: "Course 3", author: "Carol", date: "2025-04-15" },
  ];

  const handleSeeMore = () => {
    router.push("/courses"); // Navigate to full courses page
  };

  const handleTopicPress = (courseName: string) => {
    Alert.alert("Course Selected", `You tapped on ${courseName}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.topBar}>
        <Text style={styles.header}>LEETFUTURE</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginLogout}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titlecard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 Courses</Text>
          <Text style={styles.clickablelink} onPress={handleSeeMore}>
            See More
          </Text>
        </View>

        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
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

      <View style={styles.titlecard}>
        <Text style={styles.sectionTitle}>📥 Saved Courses</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "lightblue" },
  header: { fontSize: 30, fontWeight: "bold", marginBottom: 20, marginTop: 20 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titlecard: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 10,
  },

  subcard: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between", // puts space between header and button
    alignItems: "center", // vertical center
    marginBottom: 20,
    marginTop: 20,
  },

  loginButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  cardDetail: {
    fontSize: 14,
    color: "#555",
  },

  clickablelink: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
    marginBottom: 20,
    marginTop: 10,
  },
});
