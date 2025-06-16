import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Video from "react-native-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Lesson } from "@/models/Lesson";
import { getLessonById } from "@/services/lessonService";

export default function LessonPage() {
  const [isLoading, setIsLoading] = useState(true);
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
  }, ["7DrKhURbwdILpTbAwIQf"]);

  if (!lesson)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Video
        source={{ uri: lesson.title }}
        style={styles.video}
        controls
        resizeMode="contain"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />

      <Text style={styles.description}>
        {lesson.time_taken} • 
        {/* {lesson.description} */}
      </Text>

      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => router.push(`/quizzes/${lesson.quiz_id}`)}
      >
        <Text style={styles.quizButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
    loadingContainer: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
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
