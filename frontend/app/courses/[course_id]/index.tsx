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
import { Ionicons } from "@expo/vector-icons";
import { Course } from "@/models/Course";
import { Topic } from "@/models/Topic";
import { getTopicById } from "@/services/topicService";
import { getUser } from "@/services/userAsyncService";
import { User } from "@/models/User";
import { createProgressTracker } from "@/services/progressTrackerService";
import { ProgressTracker } from "@/models/ProgressTracker";
import { useLocalSearchParams } from "expo-router/build/hooks";

export default function CourseDetailScreen() {
  const { course_id } = useLocalSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressTracker | null>(null);
  const [expandedLessonIndex, setExpandedLessonIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const courseData = await getCourseById(String(course_id));
        const topicData = await getTopicById(courseData.body.topic_id);
        setCourse(courseData.body);
        setTopic(topicData.body);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [String(course_id)]);

  useEffect(() => {
    (async () => {
      try {
        const progressTracker = {
          user_id: user?.user_id!,
          course_id: course?.course_id!,
        };
        const response = await createProgressTracker(progressTracker);
        setProgress(response);
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [course?.course_id]);

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
          <Text style={styles.detailItem}>{topic?.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.description}>{course.description}</Text>
        {/* Button opens current lesson the user is at for this course based on progress tracker */}
        {progress?.current_lesson_number! > course.lessons?.length! ? (
          <View style={styles.courseCompleteContainer}>
            <Text style={styles.courseCompleteText}>Course Completed!</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() =>
              router.push(
                `../courses/${course_id}/${course?.lessons?.at(progress?.current_lesson_number! - 1)?.lesson_id}`
              )
            }
          >
            <Text style={styles.startButtonText}>
              {progress?.current_lesson_number == 1 ? "Start" : "Resume"}
            </Text>
          </TouchableOpacity>
        )}

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
              {/* Green tick icon */}
              {index + 1 < progress?.current_lesson_number! && (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              )}
              {index + 1 === progress?.current_lesson_number! && (
                <Ionicons name="play-circle" size={24} color="dodgerblue" />
              )}
            </TouchableOpacity>

            {expandedLessonIndex === index && (
              <View style={styles.expandedContent}>
                <View style={styles.lessonProgressContainer}>
                  {index + 1 < progress?.current_lesson_number! && (
                    <>
                      <Ionicons
                        name="refresh"
                        size={18}
                        color="#888"
                        style={styles.lockIcon}
                      />
                      <Text style={styles.lockedText}>Attempted before</Text>
                    </>
                  )}
                  {index + 1 === progress?.current_lesson_number! && (
                    <>
                      <Ionicons
                        name="radio-button-on"
                        size={18}
                        color="#888"
                        style={styles.lockIcon}
                      />
                      <Text style={styles.lockedText}>In progress</Text>
                    </>
                  )}
                  {index + 1 > progress?.current_lesson_number! && (
                    <>
                      <Ionicons
                        name="lock-closed"
                        size={18}
                        color="#888"
                        style={styles.lockIcon}
                      />
                      <Text style={styles.lockedText}>Lesson not unlocked</Text>
                    </>
                  )}
                </View>
                <Text style={styles.courseDescription}>
                  Description: {lesson.description}
                </Text>

                {index + 1 < progress?.current_lesson_number! && (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() =>
                      router.push(`../courses/${course_id}/${lesson.lesson_id}`)
                    }
                  >
                    <Text style={styles.startButtonText}>Retake Lesson</Text>
                  </TouchableOpacity>
                )}
                {index + 1 === progress?.current_lesson_number! && (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() =>
                      router.push(`../courses/${course_id}/${lesson.lesson_id}`)
                    }
                  >
                    <Text style={styles.startButtonText}>Resume Lesson</Text>
                  </TouchableOpacity>
                )}
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
  courseCompleteContainer: {
    alignItems: "center",
  },
  courseCompleteText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
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
  startButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  lessonProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  lockIcon: {
    marginRight: 6,
  },
  lockedText: {
    fontSize: 14,
    color: "#888",
  },
});
