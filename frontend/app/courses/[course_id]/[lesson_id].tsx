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
import { Lesson } from "@/models/Lesson";
import { getLessonById } from "@/services/lessonService";
import Ionicons from "@expo/vector-icons/build/Ionicons";

export default function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const router = useRouter();
  const { lesson_id } = useLocalSearchParams();

  // Dummy lesson data (replace with real API call)

  useEffect(() => {
    (async () => {
      try {
        const lessonId = lesson_id as string;
        const data = await getLessonById(lessonId);
        setLesson(data.body);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [lesson_id]);

  const handleBackPress = () => {
    router.back();
  };

  if (!lesson)
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
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Course details */}
      <View style={styles.content}>
        <Video
          source={{ uri: lesson.title }}
          style={styles.video}
          controls
          resizeMode="contain"
        />

        <Text style={styles.description}>
          {lesson.time_taken} • {lesson.description}
        </Text>

        <TouchableOpacity
          style={styles.quizButton}
          // onPress={() => router.push(`/quizzes/${lesson.quiz_id}`)}
          onPress={() => router.push(`/quizzes/rand`)}
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
    backgroundColor: "#4A90E2",
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
