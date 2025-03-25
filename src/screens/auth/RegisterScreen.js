import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { authService } from "../../services/auth";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được vượt quá 50 ký tự"),
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không đúng định dạng"),
  phone: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^0\d{9,10}$/,
      "Số điện thoại không đúng định dạng (bắt đầu từ 0, 10-11 số)"
    ),
  address: Yup.string()
    .required("Vui lòng nhập địa chỉ")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
});

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      setApiError(""); // Clear previous errors
      // Remove confirmPassword as it's not needed in the API request
      const { confirmPassword, ...registerData } = values;

      await authService.register(registerData);

      Toast.show({
        type: "success",
        text1: "Đăng ký thành công",
      });

      // Wait for 1 second before navigating
      setTimeout(() => {
        navigation.navigate("Login");
      }, 750);
    } catch (error) {
      let errorMessage = "Đã xảy ra lỗi khi đăng ký";

      // Handle specific error messages
      if (error.message === "Phone already exists") {
        errorMessage = "Số điện thoại này đã được đăng ký";
      } else if (error.message === "Email already exists") {
        errorMessage = "Email này đã được đăng ký";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setApiError(errorMessage);

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logo.webp")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>SHIP HỎA TỐC 247</Text>
          <Text style={styles.subtitle}>LẤY NHANH - GIAO LẸ</Text>
        </View>

        <Text style={styles.registerTitle}>ĐĂNG KÝ</Text>

        {apiError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.apiErrorText}>{apiError}</Text>
          </View>
        ) : null}

        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            address: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Họ tên *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ tên của bạn"
                value={values.name}
                onChangeText={handleChange("name")}
                mode="outlined"
                textColor="black"
                outlineColor="#ddd"
                activeOutlineColor="#ff4d4f"
                disabled={loading}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                value={values.email}
                onChangeText={handleChange("email")}
                mode="outlined"
                textColor="black"
                outlineColor="#ddd"
                activeOutlineColor="#ff4d4f"
                disabled={loading}
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={styles.inputLabel}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại của bạn"
                value={values.phone}
                onChangeText={handleChange("phone")}
                mode="outlined"
                textColor="black"
                outlineColor="#ddd"
                activeOutlineColor="#ff4d4f"
                disabled={loading}
                keyboardType="phone-pad"
              />
              {touched.phone && errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              <Text style={styles.inputLabel}>Địa chỉ *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ của bạn"
                value={values.address}
                onChangeText={handleChange("address")}
                mode="outlined"
                textColor="black"
                outlineColor="#ddd"
                activeOutlineColor="#ff4d4f"
                disabled={loading}
              />
              {touched.address && errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}

              <Text style={styles.inputLabel}>Mật khẩu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                value={values.password}
                onChangeText={handleChange("password")}
                secureTextEntry={!showPassword}
                mode="outlined"
                outlineColor="#ddd"
                textColor="black"
                activeOutlineColor="#ff4d4f"
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                }
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Text style={styles.inputLabel}>Xác nhận mật khẩu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                secureTextEntry={!showConfirmPassword}
                mode="outlined"
                outlineColor="#ddd"
                textColor="black"
                activeOutlineColor="#ff4d4f"
                disabled={loading}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                  />
                }
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.registerButton}
                labelStyle={styles.registerButtonText}
                loading={loading}
                disabled={loading}
              >
                Đăng ký
              </Button>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Bạn đã có tài khoản?{" "}
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    disabled={loading}
                  >
                    <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          )}
        </Formik>
        <Toast />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ff4d4f",
    marginTop: 5,
  },
  registerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#ff4d4f",
    padding: 5,
    borderRadius: 25,
    marginTop: 10,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#ff4d4f",
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  apiErrorText: {
    color: "#d32f2f",
    textAlign: "center",
    fontSize: 14,
  },
});

export default RegisterScreen;
