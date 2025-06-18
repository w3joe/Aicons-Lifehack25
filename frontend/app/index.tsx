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
  Linking,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { User } from "../models/User";

export default function Home() {
  type Topic = {
    id: string;
    name: string;
    description: string;
    icon?: any;
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

  const topicIcons: { [key: string]: any } = {
    math: require("../assets/images/math.png"),
    science: require("../assets/images/science.png"),
    programming: require("../assets/images/programming.png"),
    data_science_AI: require("../assets/images/programming.png"),
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const userJson = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!token);
      if (userJson) {
        const parsedUser: User = JSON.parse(userJson);
        setUser(parsedUser);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("/topics");
        const data = response.data;
        const topicsArray = Array.isArray(data.body) ? data.body : [];
        const normalizedTopics: Topic[] = topicsArray.map((topic: any) => ({
          id: topic.topic_id,
          name: topic.name,
          description: topic.description,
          icon: topicIcons[topic.name.toLowerCase()] || require("../assets/images/home.png"), // fallback

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

  const fetchCoursesByTopic = async (topicId: string) => {
    try {
      const response = await api.get(`/topics/${topicId}/courses`);
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

  const handleSeeMore = () => {
    router.push("/courses");
  };

  const handleCoursePressed = (course_id: string) => {
    router.push(`/courses/${course_id}`);
  };

  const handleTopicPress = (topicId: string) => {
    setSelectedTopicId(topicId);
    fetchCoursesByTopic(topicId);
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const filteredCourses = selectedTopicId
    ? courses.filter((course) => course.topicId === selectedTopicId)
    : courses;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
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

        {user?.role === "STUDENT" && (
          <Text style={styles.header}>Hello Student {user.username}!</Text>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleLoginLogout}>
          <Text style={styles.loginButtonText}>{isLoggedIn ? "Logout" : "Login"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBase}>
        <Text style={styles.sectionTitle}>🏷️ Topics</Text>
        <ScrollView nestedScrollEnabled horizontal showsHorizontalScrollIndicator={true}>
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.subcard,
                selectedTopicId === topic.id && styles.selectedButton,
              ]}
              onPress={() => handleTopicPress(topic.id)}
            >
              {topic.icon && (
                <Image source={topic.icon} style={styles.topicIcon} />
              )}
              <Text style={styles.cardTitle}>{topic.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cardBase}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📚 Courses</Text>
          <Text style={styles.clickablelink} onPress={handleSeeMore}>See More</Text>
        </View>

        {selectedTopicId !== null && (
          <TouchableOpacity
            onPress={() => {
              setSelectedTopicId(null);
              fetchAllCourses();
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
            <Text style={styles.cardDetail}>By {course.author || "..."}</Text>
            <Text style={styles.cardDetail}>Created on {course.date?.slice(0, 10) || "..."}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cardBase}>
        <Text style={styles.sectionTitle}>📞 Contact Us</Text>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactText}>support@aitutor.com</Text>
        </View>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>📱</Text>
          <Text style={styles.contactText}>+65 1234 5678</Text>
        </View>

        <View style={styles.contactItem}>
          <Text style={styles.contactIcon}>🕒</Text>
          <Text style={styles.contactText}>Mon-Fri, 9am-6pm</Text>
        </View>

        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => {
            const subject = encodeURIComponent("Feedback for AITUTOR");
            const body = encodeURIComponent("Hi AITUTOR Team,\n\nI'd like to share the following feedback...");
            const mailtoLink = `mailto:support@aitutor.com?subject=${subject}&body=${body}`;

            if (Platform.OS === "web") {
              window.location.href = mailtoLink;
            } else {
              Linking.openURL(mailtoLink);
            }
          }}
        >
          <Text style={styles.feedbackButtonText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
  },
  dashboardButton: {
    backgroundColor: "#2a9d8f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  dashboardButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#2a9d8f",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBase: {
    backgroundColor: "#d6efff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  subcard: {
    backgroundColor: "#fefefe",
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  topicIcon: {
    width: 80,
    height: 80,
    marginBottom: 6,
    alignSelf: "center",
  },
  selectedButton: {
    backgroundColor: "#2a9d8f",
    borderColor: "white",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDetail: {
    fontSize: 14,
    color: "#555",
  },
  clickablelink: {
    color: "#005f99",
    fontSize: 16,
    marginTop: 6,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
  },
  feedbackButton: {
    marginTop: 15,
    backgroundColor: "#2a9d8f",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  feedbackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
