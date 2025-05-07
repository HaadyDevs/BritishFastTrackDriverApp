import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TextInput from '../components/TextInput';
import { colors } from '../theme/colors';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import { buildFormData } from '../utls/util';
import ApiService from '../utls/apiService';
import { useAtomValue, useSetAtom } from 'jotai';
import { driverIdAtom, emailAtom } from '../state/userAtoms';

const OtpVerificationScreen = () => {

  const navigation = useNavigation();
  const email = useAtomValue(emailAtom)
  const setDriverIdAtom = useSetAtom(driverIdAtom);

  const [otp, setOtp] = useState('');

  const handleOnContinue = async () => {
    if (!otp) {
      showMessage({
        message:"OTP field is required",
        type: 'danger',
      })
    } else {
      const data = {
        email: email,
        otp : otp
      };
  
      const formData = buildFormData(data);
      const res = await ApiService.verifyOtp(formData);
      console.log(res);
  
      if (res.data?.status === 'success') {
        console.log(res.data.data.id);
        setDriverIdAtom(res.data.data.id)
        showMessage({
          message: 'OTP Verified',
          type: 'success',
        });
        navigation.navigate('DriverInfo');
      } else {
        showMessage({
          message: 'Incorrect OTP or OTP failed',
          type: 'danger',
        });
      }
    }
 
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          We’ve sent a code to {email} Please enter it below.
        </Text>

        <TextInput
          placeholder="Enter OTP here"
          style={{width: '80%', alignSelf: 'center', backgroundColor: "#ffffff"}}
          returnKeyType="next"
          value={otp}
          onChangeText={setOtp}
          autoCapitalize="none"
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => handleOnContinue()}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
    // alignItems: 'center',
    marginTop: 40,
  },
  title: {
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
    marginBottom: 60,
  },
  singleOtpInput: {
    width: '80%',
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    marginBottom: 20,
  },
  resendText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
  resendLink: {
    color: '#1E60F2',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    // width: '80%',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OtpVerificationScreen;
