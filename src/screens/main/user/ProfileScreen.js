import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_IMAGE } from "../../../constants/config";
import { userService } from "../../../services/userService";
import Toast from "react-native-toast-message";

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatarBase64: null,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("user");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const fetchUserData = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");
      const userData = JSON.parse(userJSON);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        avatarBase64: null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: "Không thể tải thông tin người dùng",
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        avatarBase64: result.assets[0].base64,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateUser(user._id, formData);

      // Update local storage with new user data
      const updatedUser = {
        ...user,
        ...response.data,
      };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      setUser(updatedUser);
      Toast.show({
        type: "success",
        text1: "Cập nhật thông tin thành công",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: error.response?.data?.message || "Vui lòng thử lại sau",
      });
    }
  };

  const renderAvatar = () => {
    if (formData.avatarBase64) {
      return (
        <Image
          source={{ uri: `data:image/jpeg;base64,${formData.avatarBase64}` }}
          style={styles.avatar}
        />
      );
    }
    if (user?.avatar) {
      return (
        <Image
          source={{ uri: `${API_URL_IMAGE}${user.avatar}` }}
          style={styles.avatar}
        />
      );
    }
    return (
      <View style={styles.avatarPlaceholder}>
        <Icon name="account" size={50} color="#666" />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={isEditing ? pickImage : null}
        >
          {renderAvatar()}
          {isEditing && (
            <View style={styles.editAvatarOverlay}>
              <Icon name="camera" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name || "Chưa cập nhật"}</Text>
        <Text style={styles.email}>{user?.email || "Chưa cập nhật"}</Text>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="Nhập họ và tên"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                placeholder="Nhập email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Địa chỉ</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) =>
                  setFormData({ ...formData, address: text })
                }
                placeholder="Nhập địa chỉ"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Icon name="pencil" size={24} color="#4CAF50" />
            <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    // alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  editButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  logoutButton: {
    backgroundColor: "#ff4d4f",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
