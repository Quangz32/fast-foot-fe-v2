import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
    emailOrPhone: Yup.string()
      .required('Vui lòng nhập email hoặc số điện thoại')
      .test('is-valid', 'Vui lòng nhập đúng định dạng email hoặc số điện thoại', (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^0\d{9,10}$/; // Số điện thoại bắt đầu bằng 0 và có từ 10 đến 11 số
        return emailRegex.test(value) || phoneRegex.test(value);
      }),
    password: Yup.string()
      .required('Vui lòng nhập mật khẩu')
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  });

const LoginScreen = () => {
  const handleLogin = (values) => {
    // Here you would typically make an API call to verify credentials
    // For demo purposes, we'll just show a success message
    Toast.show({
      type: 'success',
      text1: 'Đăng nhập thành công',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SHIP HỎA TỐC 247</Text>
        <Text style={styles.subtitle}>LẤY NHANH - GIAO LẸ</Text>
      </View>

      <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>

      <Formik
        initialValues={{ emailOrPhone: '', password: '' }}
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
              onChangeText={handleChange('emailOrPhone')}
              mode="outlined"
              outlineColor="#ddd"
              activeOutlineColor="#ff4d4f"
            />
            {touched.emailOrPhone && errors.emailOrPhone && (
              <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
            )}

            <Text style={styles.inputLabel}>Mật khẩu *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={values.password}
              onChangeText={handleChange('password')}
              secureTextEntry
              mode="outlined"
              outlineColor="#ddd"
              activeOutlineColor="#ff4d4f"
              right={<TextInput.Icon icon="eye" />}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
            >
              Đăng nhập
            </Button>

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Vui lòng liên hệ hotline{' '}
                <Text style={styles.phoneNumber}>0977854609</Text> nếu bạn cần hỗ
                trợ.{' '}
                <TouchableOpacity>
                  <Text style={styles.callNowText}>Gọi ngay</Text>
                </TouchableOpacity>
              </Text>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                Bạn chưa có tài khoản?{' '}
                <TouchableOpacity>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ff4d4f',
    marginTop: 5,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#ff4d4f',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#ff4d4f',
    padding: 5,
    borderRadius: 25,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
  },
  phoneNumber: {
    color: '#333',
    fontWeight: 'bold',
  },
  callNowText: {
    color: '#ff4d4f',
    fontWeight: 'bold',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#ff4d4f',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 