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

const messages = [
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
  { id: "1", sender: "bot", text: "Hi there! How can I help you today?" },
  { id: "2", sender: "user", text: "Tell me about the solar system." },
  {
    id: "3",
    sender: "bot",
    text: "Sure! The solar system has 8 planets orbiting the Sun.",
  },
];

export default function ChatbotUI() {
  const [inputHeight, setInputHeight] = useState(40); // default height
  const MAX_HEIGHT = 200;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Graphic */}
      <View style={styles.backgroundGraphic} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Chatbot</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
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
          placeholder="Type a message..."
          multiline
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
        //   style={styles.backButton}
        //   onPress={() => handleBackPress()}
        >
          <Ionicons
            name="send"
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
    padding: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
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
