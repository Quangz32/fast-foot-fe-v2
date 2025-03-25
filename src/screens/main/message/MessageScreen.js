import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from "@react-navigation/stack";
import ChatDetailScreen from "./ChatDetailScreen";

const Stack = createStackNavigator();

const ChatListScreen = ({ navigation }) => {
  const chats = [
    {
      id: "1",
      name: "Shop Fast Food",
      lastMessage: "Vui lòng cho biết mã đơn hàng của bạn",
      time: "10:02 AM",
      unread: 1,
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: "2",
      name: "Dịch vụ khách hàng",
      lastMessage: "Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi",
      time: "Hôm qua",
      unread: 0,
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: "3",
      name: "Shipper",
      lastMessage: "Đơn hàng của bạn đã được giao thành công",
      time: "02/04",
      unread: 0,
      avatar: "https://via.placeholder.com/50",
    },
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatDetail", {
          chatId: item.id,
          recipientName: item.name,
        })
      }
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.chatInfo}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
      />
      <TouchableOpacity style={styles.newChatButton}>
        <Icon name="message-plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Main Message navigator component that includes both the list and chat detail screens
const MessageScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: "Tin nhắn" }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={({ route }) => ({ title: route.params.recipientName })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  nameTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: "#ff4d4f",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  newChatButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff4d4f",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MessageScreen;
