import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Video from "react-native-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getAttemptedLessonPackage,
  getCurrentLessonPackage,
  getLessonById,
} from "@/services/lessonService";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { LessonPackage } from "@/models/LessonPackage";
import { User } from "@/models/User";
import { getUser } from "@/services/userAsyncService";

export default function LessonPage() {
  const [user, setUser] = useState<User | null>(null);
  const [lessonPackage, setLessonPackage] = useState<LessonPackage | null>(
    null
  );

  const router = useRouter();
  const { lesson_id, reattempt } = useLocalSearchParams();
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    };

    fetchUser();
  }, []);

  // Fetch lesson package only after user is available
  useEffect(() => {
    if (!user) return;

    const fetchLessonPackage = async () => {
      try {
        const lessonId = lesson_id as string;
        let data;

        if (reattempt === "1") {
          data = await getAttemptedLessonPackage(lessonId, user.user_id);
        } else {
          const lessonData = await getLessonById(lessonId);
          data = await getCurrentLessonPackage(
            lessonData.body.course_id,
            user.user_id
          );
        }

        setLessonPackage(data.body);
      } catch (err) {
        console.error("Error fetching lesson package:", err);
      }
    };

    fetchLessonPackage();
  }, [user, lesson_id, reattempt]);

  const handleBackPress = () => {
    router.back();
  };

  if (!lessonPackage)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBackPress()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {lessonPackage.lessonDetails.title}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Course details */}
      {lessonPackage.resources?.resource_type == "VIDEO"}
      <View style={styles.content}>
        <Video
          source={{ uri: lessonPackage.resources?.url_or_content }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
        {lessonPackage.resources?.url_or_content}

        <Text style={styles.description}>
          {lessonPackage.lessonDetails.description}
        </Text>

        <TouchableOpacity
          style={styles.quizButton}
          onPress={() =>
            router.push(`/quizzes/${lessonPackage.lessonDetails.quiz_id}`)
          }
        >
          <Text style={styles.quizButtonText}>Take Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  video: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#000",
    position: "relative",
  },
  loadingOverlay: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginVertical: 16,
  },
  quizButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  quizButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
