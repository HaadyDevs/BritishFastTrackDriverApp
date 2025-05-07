// src/screens/WelcomeScreen.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';
import { colors } from '../theme/colors';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Logo />
      </View>
      

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {navigation.navigate("Login")}}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {navigation.navigate("Register")}}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // white background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50
  },
  loginButton: {
    width: '80%',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 2,
    alignItems: 'center',
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});