// app/topic/[topicName].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

const topics = [
  { id: 1, name: "Math" },
  { id: 2, name: "Computing" },
  { id: 3, name: "Science" },
];

export default function TopicPage() {
  const { topic_id } = useLocalSearchParams();

  // Convert topic_id to number
  const topic = topics.find((t) => t.id === Number(topic_id));

  if (!topic) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Topic not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Topic: {topic.name}</Text>
    </View>
  );
}