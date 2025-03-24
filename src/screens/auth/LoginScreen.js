import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { authService } from "../../services/auth";
import { userService } from "../../services/userService";
const validationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required("Vui lòng nhập email hoặc số điện thoại")
    .test(
      "is-valid",
      "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^0\d{9,10}$/; // Số điện thoại bắt đầu bằng 0 và có từ 10 đến 11 số
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const isEmail = (value) => {
  return value.includes("@");
};

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    try {
      userService.getMe().then((res) => {
        console.log(res);
        if (res.name) {
          navigation.navigate("Main");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [navigation]);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      await authService.login({
        email: isEmail(values.emailOrPhone) ? values.emailOrPhone : null,
        phone: !isEmail ? null : values.emailOrPhone,
        password: values.password,
      });
      userService.getMe();
      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
      });

      //chờ 1 giây
      setTimeout(() => {
        navigation.navigate("Main");
      }, 750);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message || "Thông tin không đúng",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>

      <Formik
        initialValues={{ emailOrPhone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Email/ số điện thoại *</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: 0938123456"
              value={values.emailOrPhone}
              onChangeText={handleChange("emailOrPhone")}
              mode="outlined"
              textColor="black"
              outlineColor="#ddd"
              activeOutlineColor="#ff4d4f"
              disabled={loading}
            />
            {touched.emailOrPhone && errors.emailOrPhone && (
              <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
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

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => {
                // Handle forgot password
              }}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              loading={loading}
              disabled={loading}
            >
              Đăng nhập
            </Button>

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Vui lòng liên hệ hotline{" "}
                <Text style={styles.phoneNumber}>0977854609</Text> nếu bạn cần
                hỗ trợ.{" "}
                <TouchableOpacity disabled={loading}>
                  <Text style={styles.callNowText}>Gọi ngay</Text>
                </TouchableOpacity>
              </Text>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Bạn chưa có tài khoản?{" "}
                <TouchableOpacity disabled={loading}>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        )}
      </Formik>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
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
  loginTitle: {
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#ff4d4f",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#ff4d4f",
    padding: 5,
    borderRadius: 25,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  helpContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  helpText: {
    textAlign: "center",
    color: "#666",
  },
  phoneNumber: {
    color: "#333",
    fontWeight: "bold",
  },
  callNowText: {
    color: "#ff4d4f",
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#ff4d4f",
    fontWeight: "bold",
  },
});

export default LoginScreen;
