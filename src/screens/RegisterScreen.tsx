import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TextInput from '../components/TextInput';
import {Text, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {colors} from '../theme/colors';
import {emailValidator, passwordValidator} from '../utls/validators';
import {buildFormData} from '../utls/util';
import ApiService from '../utls/apiService';
import {showMessage} from 'react-native-flash-message';
import {driverIdAtom, emailAtom} from '../state/userAtoms';
import {useSetAtom} from 'jotai';

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const setEmailAtom = useSetAtom(emailAtom);

  const handleRegister = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const nameError = !name.value ? 'Name is required' : '';

    setEmail({...email, error: emailError});
    setPassword({...password, error: passwordError});
    setName({...name, error: nameError});

    if (emailError || passwordError || nameError) return;

    const data = {
      name: name.value,
      email: email.value,
      password: password.value,
      user_type: 'driver',
    };

    const formData = buildFormData(data);
    const res = await ApiService.register(formData);
    console.log(res);

    if (res.data?.status === 'success') {
      try {
        setEmailAtom(email.value);
        showMessage({
          message: 'Registration Success',
          description: res.data.message,
          type: 'success',
        });
        navigation.navigate('Otp');
      } catch (err) {
        console.log(err);
        
      }
    } else {
      showMessage({
        message: 'Registration Failed',
        description: res.data?.message,
        type: 'danger',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View>
            <IconButton
              style={{paddingLeft: 4, margin: 0}}
              icon="chevron-left"
              iconColor={'black'}
              size={40}
              onPress={() => navigation.goBack()}
            />

            <View style={styles.formContainer}>
              <Text style={styles.heading}>Register</Text>
              <Text style={styles.subtitle}>
                Register to start driving and earning
              </Text>

              <TextInput
                placeholder="Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={text => setName({value: text, error: ''})}
                error={!!name.error}
                errorText={name.error}
                autoCapitalize="none"
              />

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
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleRegister}>
              REGISTER
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  formContainer: {
    padding: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: colors.primary,
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
    marginBottom: 30,
  },
});

export default RegistrationScreen;
