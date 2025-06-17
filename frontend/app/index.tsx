import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { User } from "../models/User";

export default function Home() {
  type Topic = {
    id: string;
    name: string;
    description: string;
  };

  type Course = {
    id: number;
    name: string;
    author: string;
    date: string;
    topicId: string;
  };

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);


  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const userJson = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!token);
      if (userJson) {
        const parsedUser: User = JSON.parse(userJson);
        setUser(parsedUser); //set the user here
      }
    };
    checkLoginStatus();
  }, []);

  // Fetch topics from backend on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("/topics");
        //const data = await response.json();
        const data = response.data;
        // Defensive: check if body is an array
        const topicsArray = Array.isArray(data.body) ? data.body : [];
        // Optional: map topic_id to id to keep consistent keys
        const normalizedTopics: Topic[] = topicsArray.map((topic: any) => ({
          id: topic.topic_id,
          name: topic.name,
          description: topic.description,
        }));

        setTopics(normalizedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
        showAlert("Error", "Unable to load topics.");
      }
    };

    fetchTopics();
    fetchAllCourses();
  }, []);

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
        topicId: course.topic_id,
      }));

      setCourses(normalizedCourses);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      showAlert("Error", "Unable to load all courses.");
    }
  };

  // Filter courses based on selected topic
  const filteredCourses = selectedTopicId
    ? courses.filter((course) => course.topicId === selectedTopicId)
    : courses;

  const fetchCoursesByTopic = async (topicId: string) => {
    try {
      const response = await api.get(`/topics/${topicId}/courses`);
      //const data = await response.json();
      const data = response.data;
      const courseArray = Array.isArray(data.body) ? data.body : [];
      const normalizedCourses: Course[] = courseArray.map((course: any) => ({
        id: course.course_id,
        name: course.title,
        author: course.author,
        date: course.created_at,
        topicId: course.topic_id,
      }));
      setCourses(normalizedCourses);
    } catch (error) {
      console.error("Error fetching courses for topic:", error);
      showAlert("Error", "Unable to load courses for selected topic.");
    }
  };

  // Check if user is logged in
  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      await AsyncStorage.removeItem("userToken");
      setIsLoggedIn(false);
      showAlert("AITUTOR", "Logged out");
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  // Directs to all courses page
  const handleSeeMore = () => {
    router.push("/courses");
  };

  const handleCoursePressed = (course_id: string) => {
    router.push(`/courses/${course_id}`);
  };

  // Make Topic ID == selected ID & filter courses based on selected ID
  const handleTopicPress = (topicId: string) => {
    setSelectedTopicId(topicId);
    fetchCoursesByTopic(topicId);
  };

  // Alert wrapper for web and app
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.topBar}>
        <Text style={styles.header}>AITUTOR</Text>

        {user?.role === "TEACHER" && (
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => router.push("../classroom/teacher")}
        >
          <Text style={styles.dashboardButtonText}>Teachers Dashboard</Text>
        </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginLogout}
        >
          <Text style={styles.loginButtonText}>
            {isLoggedIn ? "Logout" : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titlecard}>
        <Text style={styles.sectionTitle}>🏷️ Topics</Text>
        <ScrollView nestedScrollEnabled>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.subcard}
              onPress={() => handleTopicPress(topic.id)}
            >
              <Text style={styles.cardTitle}>{topic.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.titlecard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 Courses</Text>
          <Text style={styles.clickablelink} onPress={handleSeeMore}>
            See More
          </Text>
        </View>

        {selectedTopicId !== null && (
          <TouchableOpacity
            onPress={() => {
              setSelectedTopicId(null);
              fetchAllCourses(); // Fetch all courses when showing all
            }}
          >
            <Text style={styles.clickablelink}>Show All Courses</Text>
          </TouchableOpacity>
        )}

        {filteredCourses.slice(0, 5).map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.subcard}
            onPress={() => handleCoursePressed(String(course.id))}
          >
            <Text style={styles.cardTitle}>{course.name}</Text>
            <Text style={styles.cardDetail}>By {course.author}</Text>
            <Text style={styles.cardDetail}>Created on {course.date}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.titlecard}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 20,
    backgroundColor: "lightblue",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  dashboardButton: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#2a9d8f",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  dashboardButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
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
