import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import TextInput from '../components/TextInput';
import {Text, IconButton, Modal, ProgressBar, Icon} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Button from '../components/Button';
import {colors} from '../theme/colors';
import {pick, types} from '@react-native-documents/picker';
import {showMessage} from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import {buildFormData} from '../utls/util';
import ApiService from '../utls/apiService';
import { useAtomValue } from 'jotai';
import { driverIdAtom, emailAtom } from '../state/userAtoms';

const DriverInfoScreen = () => {
  const navigation = useNavigation();

  const driverId = useAtomValue(driverIdAtom)

  const [form, setForm] = useState({
    first_name: {value: '', error: ''},
    surname: {value: '', error: ''}, // Optional field
    date_of_birth: {value: '', error: ''},
    national_ins_number: {value: '', error: ''},
    address: {value: '', error: ''},
    email: {value: '', error: ''},
    license_number: {value: '', error: ''},
    license_expiry_date: {value: '', error: ''},
    contact_number: {value: '', error: ''},
  });

  const [documents, setDocuments] = useState({
    profile_image: {name: null, url: null, error: ''},
    license_photocopy: {name: null, url: null, error: ''},
    pco_license: {name: null, url: null, error: ''},
    bank_statement: {name: null, url: null, error: ''},
    private_hire_driver_badge: {name: null, url: null, error: ''},
  });

  const [uploading, setUploading] = useState(false); // To track if the upload is in progress

  const formatDateInput = (text: string) => {
    let cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(
        4,
      )}`;
    } else if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    const formatted = field.includes('date') ? formatDateInput(value) : value;
    setForm(prev => ({
      ...prev,
      [field]: {value: formatted, error: ''},
    }));
  };

  const handlePickDocument = async (field: keyof typeof documents) => {
    try {
      const res = await pick({
        type: [types.pdf, types.images],
      });
      console.log(res);

      const filePath = res[0].uri;
      const newPath =
        Platform.OS === 'android'
          ? `${RNFS.DocumentDirectoryPath}/${res[0].name}`
          : filePath;

      if (Platform.OS === 'android') {
        await RNFS.copyFile(filePath, newPath);
      }

      const reference = storage().ref(`images/${res[0].name}`);
      const task = reference.putFile(newPath);

      setUploading(true);

      await task;
      const url = await reference.getDownloadURL(); // Get the file's download URL

      console.log('File uploaded to Firebase Storage:', url);

      // Update documents state with file name and download URL
      setDocuments(prev => ({
        ...prev,
        [field]: {name: res[0].name, url, error: ''},
      }));

      setUploading(false);
    } catch (error) {
      console.log(error);
      // console.error('Error uploading file:', error);
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    let hasError = false;
    const updatedForm = {...form};
    const updatedDocs = {...documents};

    Object.entries(form).forEach(([key, val]) => {
      if (key !== 'surname' && !val.value.trim()) {
        // Allow surname to be empty
        updatedForm[key as keyof typeof form].error = `${key.replace(
          /_/g,
          ' ',
        )} is required`;
        hasError = true;
      }
    });

    Object.entries(documents).forEach(([key, val]) => {
      if (key !== 'profile_image' && !val.name) {
        // Allow profile_image to be empty
        updatedDocs[key as keyof typeof documents].error = `${key.replace(
          /_/g,
          ' ',
        )} is required`;
        hasError = true;
      }
    });

    setForm(updatedForm);
    setDocuments(updatedDocs);

    if (hasError) return;

    const formData = Object.fromEntries(
      Object.entries(form).map(([key, val]) => [key, val.value]),
    );

    const docData = Object.fromEntries(
      Object.entries(documents).map(([key, val]) => [key, val.url]), // Use URL instead of name
    );

    // Mapping form data and documents (URLs) to the submission object
    const submissionData = {
      first_name: formData.first_name || '',
      surname: formData.surname || '',
      date_of_birth: formData.date_of_birth || '',
      national_ins_number: formData.national_ins_number || '',
      address: formData.address || '',
      email: formData.email || '',
      license_number: formData.license_number || '',
      license_expiry_date: formData.license_expiry_date || '',
      contact_number: formData.contact_number || '',
      profile_image: docData.profile_image || '',
      license_photocopy: docData.license_photocopy || '',
      pco_license: docData.pco_license || '',
      bank_statement: docData.bank_statement || '',
      private_hire_driver_badge: docData.private_hire_driver_badge || '',
      user_id: driverId, 
      created_at: new Date().toISOString(),
    };

    console.log('Submission data:', submissionData);

    const submissionFormData = buildFormData(submissionData);
    const res = await ApiService.registerDriver(submissionFormData);
    console.log(res);

    if (res.data?.status === 'success') {
      showMessage({
        message: 'Driver Registration Success',
        type: 'success',
      });
      navigation.navigate('AddVehicle');
    } else {
      showMessage({
        message: 'Driver Registration Failed',
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
            <View style={styles.formContainer}>
              <Text style={styles.heading}>Driver Information</Text>
              <Text style={styles.subtitle}>
                Provide your details and upload required documents to start
                driving
              </Text>

              {Object.entries(form).map(([key, val]) => (
                <TextInput
                  key={key}
                  placeholder={key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                  value={val.value}
                  onChangeText={text =>
                    handleInputChange(key as keyof typeof form, text)
                  }
                  error={!!val.error}
                  errorText={val.error}
                />
              ))}

              {Object.entries(documents).map(([key, val]) => (
                <UploadButton
                  key={key}
                  name={key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                  label={val.name || `Upload ${key.replace(/_/g, ' ')}`}
                  onPress={() =>
                    handlePickDocument(key as keyof typeof documents)
                  }
                  error={!!val.error}
                  errorText={val.error}
                />
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSubmit}>
              SUBMIT
            </Button>
          </View>

          {/* Uploading Modal */}
          <Modal
            visible={uploading}
            onDismiss={() => {}}
            contentContainerStyle={styles.modal}
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.modalText}>Uploading...</Text>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const UploadButton = ({
  name,
  label,
  onPress,
  error,
  errorText,
}: {
  name: string;
  label: string;
  onPress: () => void;
  error?: boolean;
  errorText?: string;
}) => (
  <View style={{marginTop: 20}}>
    <Text style={{fontSize: 16, marginBottom: 12}}>{name}</Text>
    <TouchableOpacity
      style={[
        styles.uploadBtn,
        error && {borderColor: 'red', backgroundColor: '#fff0f0'},
      ]}
      onPress={onPress}>
      <Icon
        source="file-upload-outline"
        size={24}
        color={error ? 'red' : '#888'}
      />
      <Text style={[styles.uploadText, error && {color: 'red'}]}>
        {error ? errorText : label}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  uploadBtn: {
    borderWidth: 0.5,
    borderColor: '#000000',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  uploadText: {
    marginTop: 8,
    color: '#444',
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  formContainer: {
    marginTop: 40,
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
    marginBottom: 10,
  },
  subtitle: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 30,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.black,
  },
});

export default DriverInfoScreen;
