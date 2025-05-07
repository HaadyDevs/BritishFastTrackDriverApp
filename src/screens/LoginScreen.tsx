import React, {memo, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {emailValidator, passwordValidator} from '../utls/validators';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {buildFormData} from '../utls/util';
import ApiService from '../utls/apiService';
import { showMessage, hideMessage } from "react-native-flash-message";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
  
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
  
    const data = {
      username: email.value,
      password: password.value,
    };
  
    const formData = buildFormData(data);
    const res = await ApiService.login(formData);
    console.log(res);
  
    if (res.data?.status === 'success' && res.data.user_type === "driver") {
      navigation.navigate('MainApp');
    } else {
      showMessage({
        message: 'Login Failed',
        type: 'danger',
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* <Logo /> */}

      <Text style={styles.heading}>Sign In</Text>
      <Text style={styles.subtitle}>Login to start driving and earning</Text>

      <TextInput
        placeholder="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <Button style={styles.button} mode="contained" onPress={_onLoginPressed}>
        LOGIN
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have a driver account? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginTop: 20
  },
  heading: {
    color: colors.black,
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 30
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: colors.black,
  },
  link: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
    paddingTop: 60,
    width: '100%',
  },
});

export default memo(LoginScreen);
