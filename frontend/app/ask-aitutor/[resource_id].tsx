import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Message, Sender } from "@/models/Message";
import { Query } from "@/models/Query";
import { askAITutor } from "@/services/aiService";

export default function ChatbotUI() {
  const router = useRouter();
  const [inputHeight, setInputHeight] = useState(40); // default height
  const MAX_HEIGHT = 200;
  const { resource_id } = useLocalSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      message_id: 0,
      sender: Sender.BOT,
      text: "Hi, I'm AI Tutor, feel free to ask me a question! \nTry to be clear and specific. \n\nFor example:\ \nExplain photosynthesis step by step.\nHow do I solve quadratic equations?\nWhat are tips for improving my writing skills? \n\nThe clearer your question, the better I can help!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    setMessages((messages) => [
      ...messages,
      { message_id: messages.length, sender: Sender.USER, text: inputValue },
    ]);
    console.log(messages);
    handleQuestion();
  };

  const handleQuestion = async () => {
    try {
      setLoading(true);
      const query: Query = {
        resource_id: String(resource_id),
        prompt: inputValue,
      };
      console.log(query);
      const result = await askAITutor(query);
      setMessages((messages) => [
        ...messages,
        {
          message_id: messages.length,
          sender: Sender.BOT,
          text: result.body.answer,
        },
      ]);
      setInputValue("");
    } catch (err) {
      console.error("Error asking AI Tutor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Graphic */}
      <View style={styles.backgroundGraphic} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ask a Question</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Messages */}
      <FlatList
        data={
          loading
            ? [
                ...messages,
                {
                  message_id: "loading",
                  sender: "bot",
                  text: "AITutor is thinking...",
                },
              ]
            : messages
        }
        keyExtractor={(item) => String(item.message_id)}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "user" ? styles.userText : styles.botText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputValue}
          placeholder="Chat with AITutor"
          placeholderTextColor="#A9A9A9"
          multiline
          onChangeText={(text) => setInputValue(text)}
          onContentSizeChange={(e) => {
            const height = e.nativeEvent.contentSize.height;
            setInputHeight(Math.min(MAX_HEIGHT, height));
          }}
          style={[
            styles.input,
            {
              height: inputHeight,
            },
          ]}
          scrollEnabled={inputHeight >= MAX_HEIGHT}
        />

        <TouchableOpacity
          onPress={() => handleSend()}
          disabled={inputValue == ""}
        >
          <Ionicons
            name={inputValue == "" ? "send-outline" : "send"}
            size={28}
            color="#333"
            style={styles.sendButton}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
  },
  backgroundGraphic: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#e3f2fd",
    opacity: 0.5,
    zIndex: -1,
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
  messagesContainer: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: "90%",
  },
  botBubble: {
    backgroundColor: "#e1f5fe",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#c8e6c9",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  botText: {
    color: "#0277bd",
  },
  userText: {
    color: "#2e7d32",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    paddingLeft: 10,
    paddingVertical: 7,
  },
});
