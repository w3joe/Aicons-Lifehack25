import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";

export default function TabTwoScreen() {
  // Dummy course data
  const course = {
    id: "1",
    title: "Introduction to React Native",
    instructor: "Jane Smith",
    description:
      "Learn how to build mobile apps with React Native. This course covers the fundamentals and advanced topics to get you started with cross-platform mobile development.",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.7,
    students: 1250,
    lessons: [
      {
        id: "1",
        title: "Getting Started with React Native",
        duration: "15 min",
      },
      { id: "2", title: "Components and Props", duration: "22 min" },
      { id: "3", title: "State and Lifecycle", duration: "18 min" },
      { id: "4", title: "Styling in React Native", duration: "25 min" },
      { id: "5", title: "Navigation", duration: "30 min" },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Details</Text>
        <View style={{ width: 24 }} /> {/* For alignment */}
      </View>

      {/* Course thumbnail */}
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />

      {/* Course details */}
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>

        <View style={styles.metaContainer}>
          <Text style={styles.instructor}>By {course.instructor}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {course.rating} ({course.students}+ students)
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailItem}>{course.duration}</Text>
          <Text style={styles.detailItem}>{course.level}</Text>
        </View>

        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.description}>{course.description}</Text>

        <Text style={styles.sectionTitle}>Curriculum</Text>
        {course.lessons.map((lesson, index) => (
          <View key={lesson.id} style={styles.lessonItem}>
            <View style={styles.lessonNumber}>
              <Text style={styles.lessonNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.lessonContent}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
          </View>
        ))}

        {/* Enroll button */}
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  enrollButton: {
    backgroundColor: "#1976d2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  enrollButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
