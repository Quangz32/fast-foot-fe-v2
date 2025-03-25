import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId, recipientName } = route.params || {
    chatId: "1",
    recipientName: "Shop Fast Food",
  };

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Set the header title to the recipient's name
    navigation.setOptions({
      title: recipientName,
    });

    // In a real app, you would fetch messages from an API
    setMessages([
      {
        id: "1",
        text: "Xin chào! Tôi có thể giúp gì cho bạn?",
        sender: "shop",
        timestamp: "10:00 AM",
      },
      {
        id: "2",
        text: "Tôi muốn hỏi về đơn hàng của mình",
        sender: "user",
        timestamp: "10:01 AM",
      },
      {
        id: "3",
        text: "Vui lòng cho biết mã đơn hàng của bạn",
        sender: "shop",
        timestamp: "10:02 AM",
      },
    ]);
  }, [navigation, recipientName]);

  const sendMessage = () => {
    if (newMessage.trim().length > 0) {
      const message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // In a real app, you would send this message to an API
      // Simulate a response from the shop after a short delay
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ kiểm tra và phản hồi sớm nhất.",
          sender: "shop",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.shopMessage,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
          </View>
        )}
        <View
          style={[
            styles.messageContent,
            isUser ? styles.userMessageContent : styles.shopMessageContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.shopMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.shopTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        inverted={false}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Nhập tin nhắn..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#ff4d4f" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    maxWidth: "100%",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContent: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContent: {
    backgroundColor: "#ff4d4f",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  shopMessageContent: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: "white",
  },
  shopMessageText: {
    color: "black",
  },
  timestamp: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  shopTimestamp: {
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
});

export default ChatDetailScreen;
