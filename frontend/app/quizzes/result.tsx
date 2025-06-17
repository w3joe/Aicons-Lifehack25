import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getUser } from "@/services/userAsyncService";
import { User } from "@/models/User";
import { updateProgressTracker } from "@/services/progressTrackerService";
import { ProgressTracker } from "@/models/ProgressTracker";

export default function ResultScreen() {
  const router = useRouter();
  const { quiz_id, quiz_score, proficiency_score } = useLocalSearchParams();

  const getProficiencyLabel = (score: number) => {
    if (score >= 0.77) return "Expert";
    if (score >= 0.4) return "Proficient";
    if (score >= 0.3) return "Intermediate";
    return "Beginner";
  };

  const getColor = (score: number) => {
    if (score >= 0.9) return "#4caf50";
    if (score >= 0.7) return "#8bc34a";
    if (score >= 0.5) return "#ffc107";
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
    (async () => {
      try {
        const studentProgressData = {
          user_id: user?.user_id!,
          course_id: "5D4cR7rnYtNQNHIyfU5A",
          quiz_score: Number(quiz_score),
          latest_proficiency_score: Number(proficiency_score),
        };
        const response:ProgressTracker = await updateProgressTracker(studentProgressData);
        console.log(response);
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
          onPress={() => router.push("/courses")}
        >
          <Text style={styles.buttonText}>Continue to Next Lesson</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          //   onPress={() => router.push("/lessons/next")}
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
