import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getCourseById } from "@/services/courseService";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Video from "react-native-video";
import { Ionicons } from "@expo/vector-icons";
import { Course } from "@/models/Course";

export default function CourseDetailScreen(course_id: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await getCourseById("7DrKhURbwdILpTbAwIQf");
        setCourse(data.body);
      } catch (err) {
        console.error(err);
      }
    })();
  }, ["7DrKhURbwdILpTbAwIQf"]);

  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  if (!course)
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
        <Text style={styles.headerTitle}>Course Details</Text>
        <View style={{ width: 24 }} /> {/* For alignment */}
      </View>

      {/* Course thumbnail */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        }}
        style={styles.thumbnail}
      />

      {/* Course details */}
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailItem}>{course.topic_id}</Text>
        </View>

        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.description}>{course.description}</Text>
        <TouchableOpacity
          style={styles.quizButton}
          onPress={() =>
            router.push(
              `../courses/${course_id}/${course?.lessons?.at(0)?.lesson_id}`
            )
          }
        >
          <Text style={styles.quizButtonText}>Resume</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Curriculum</Text>
        {course?.lessons?.map((lesson, index) => (
          <View key={lesson.lesson_id} style={styles.lessonItemContainer}>
            <TouchableOpacity
              onPress={() =>
                setExpandedLessonIndex(
                  expandedLessonIndex === index ? null : index
                )
              }
              style={styles.lessonItem}
            >
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.lessonContent}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDuration}>{lesson.time_taken}</Text>
              </View>
            </TouchableOpacity>

            {expandedLessonIndex === index && (
              <View style={styles.expandedContent}>
                <Text style={styles.courseDescription}>
                  {lesson.description} blah blah alkajsdf adjsf klasdj flkajsd
                  kl;f jasdkl;fj kl;asdj fkl;adjs klf jasdklf jaklsj fkladsj
                  fkl;
                </Text>
              </View>
            )}
          </View>
        ))}
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
  thumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  instructor: {
    fontSize: 16,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    fontSize: 14,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginBottom: 8,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  lessonNumberText: {
    color: "#1976d2",
    fontWeight: "bold",
    fontSize: 14,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 13,
    color: "#888",
  },
  lessonItemContainer: {
    marginBottom: 10,
  },

  expandedContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    margin: 16,
    elevation: 2,
    marginTop: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: "#333",
  },
  quizButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  quizButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
