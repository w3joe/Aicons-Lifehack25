import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getUser } from "@/services/userAsyncService";
import { User } from "@/models/User";
import { updateProgressTracker } from "@/services/progressTrackerService";
import { ProgressTracker } from "@/models/ProgressTracker";
import { getIdFromQuizId } from "@/services/quizService";
import { getCurrentLessonPackage } from "@/services/lessonService";
import { LessonPackage } from "@/models/LessonPackage";

export default function ResultScreen() {
  const router = useRouter();
  const { quiz_id, quiz_score, proficiency_score } = useLocalSearchParams();
  const [progressTracker, setProgressTracker] =
    useState<ProgressTracker | null>(null);
  const [lessonPackage, setLessonPackage] = useState<LessonPackage | null>(
    null
  );

  const getProficiencyLabel = (score: number) => {
    if (score >= 86) return "Expert";
    if (score >= 66) return "Intermediate";
    if (score >= 33) return "Beginner";
    return "Try Again";
  };

  const getColor = (score: number) => {
    if (score >= 86) return "#4caf50";
    if (score >= 66) return "#8bc34a";
    if (score >= 33) return "#ffc107";
    return "#f44336";
  };

  const proficiencyLabel = getProficiencyLabel(Number(proficiency_score));
  const scoreColor = getColor(Number(proficiency_score));

  const [user, setUser] = useState<User | null>(null);

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
    if (!user) return;
    const fetchLessonPackage = async () => {
      try {
        const ids = await getIdFromQuizId(String(quiz_id));
        const data = await getCurrentLessonPackage(
          ids.body.course_id,
          user.user_id
        );
        setLessonPackage(data.body);
      } catch (err) {
        console.error("Error fetching lesson package:", err);
      }
    };
    fetchLessonPackage();
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const studentProgressData = {
          user_id: user?.user_id!,
          quiz_id: quiz_id,
          quiz_score: Number(quiz_score),
          proficiency_score: Number(proficiency_score),
        };
        console.log(studentProgressData);
        const response: ProgressTracker =
          await updateProgressTracker(studentProgressData);

        setProgressTracker(response);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user]);

  return (
    <View style={styles.container}>
      <Ionicons name="trophy" size={72} color="#ffd700" />
      <Text style={styles.title}>Quiz Completed!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Quiz Score</Text>
        <Text style={styles.score}>{quiz_score} pts</Text>

        <Text style={styles.label}>Proficiency</Text>
        <Text style={[styles.proficiency, { color: scoreColor }]}>
          {proficiency_score} ({proficiencyLabel})
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push(
              `/courses/${lessonPackage?.lessonDetails.course_id}/${lessonPackage?.lessonDetails.lesson_id}`
            )
          }
        >
          <Text style={styles.buttonText}>
            {Number(proficiency_score) <= 33
              ? "Restart Lesson"
              : "Continue to Next Lesson"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() =>
            router.push(`/courses/${lessonPackage?.lessonDetails.course_id}`)
          }
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>
            Return to Course
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#333",
  },
  card: {
    width: "85%",
    backgroundColor: "#F2FDFF",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    color: "#666",
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  score: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2196f3",
    marginTop: 4,
  },
  proficiency: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 32,
    width: "85%",
    gap: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryText: {
    color: "#2196f3",
  },
});
