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

export default function Home() {
  type Topic = {
    id: number;
    name: string;
    description: string;
  };

  type Course = {
    id: number;
    name: string;
    author: string;
    date: string;
    topicId: number;
  };

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  const courses: Course[] = [
    { id: 1, name: "Course 1", author: "Alice", date: "2025-06-12", topicId: 1 },
    { id: 2, name: "Course 2", author: "Bob", date: "2025-05-20", topicId: 2 },
    { id: 3, name: "Course 3", author: "Carol", date: "2025-04-15", topicId: 1 },
  ];

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  // Fetch topics from backend on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/topics");
        const data = await response.json();
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
  }, []);

  const filteredCourses = selectedTopicId
    ? courses.filter((course) => course.topicId === selectedTopicId)
    : courses;

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

  const handleSeeMore = () => {
    router.push("/courses");
  };

  const handleTopicPress = (topicId: number) => {
    setSelectedTopicId(topicId);
  };

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

        <TouchableOpacity style={styles.loginButton} onPress={handleLoginLogout}>
          <Text style={styles.loginButtonText}>{isLoggedIn ? "Logout" : "Login"}</Text>
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
          <TouchableOpacity onPress={() => setSelectedTopicId(null)}>
            <Text style={styles.clickablelink}>Show All Courses</Text>
          </TouchableOpacity>
        )}

        {filteredCourses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.subcard}>
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
