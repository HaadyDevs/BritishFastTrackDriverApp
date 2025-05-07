import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal as RNModal,
} from 'react-native';
import {Text, Icon, Modal} from 'react-native-paper';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import {colors} from '../theme/colors';
import {useNavigation} from '@react-navigation/native';
import {pick, types} from '@react-native-documents/picker';
import {showMessage} from 'react-native-flash-message';
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import ApiService, {VehicleType, VehicleTypeResponse} from '../utls/apiService';
import {buildFormData} from '../utls/util';
import { driverIdAtom } from '../state/userAtoms';
import { useAtomValue } from 'jotai';

const AddVehicleDetailScreen = () => {
  const navigation = useNavigation();

  const driverId = useAtomValue(driverIdAtom)

  const [form, setForm] = useState({
    vehicle_make: {value: '', error: ''},
    vehicle_model: {value: '', error: ''},
    vehicle_color: {value: '', error: ''},
    vehicle_charge: {value: '', error: ''},
    vehicle_registration_number: {value: '', error: ''},
    vehicle_type: {value: '', error: ''},
  });

  const [documents, setDocuments] = useState({
    private_hire_vehicle_licence: {name: null, url: null, error: ''},
    v5c_registration: {name: null, url: null, error: ''},
    insurance: {name: null, url: null, error: ''},
    mot: {name: null, url: null, error: ''},
    permission_letter: {name: null, url: null, error: ''},
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const res = await ApiService.getVehicleTypes();
        console.log(res.data);

        // Ensure vehicleTypes is always an array
        setVehicleTypes(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        console.log('Error fetching vehicle types:', error);
        // In case of error, fallback to an empty array
        setVehicleTypes([]);
      }
    };
    fetchVehicleTypes();
  }, []);

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: {value, error: ''},
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
      if (!val.value.trim()) {
        updatedForm[key as keyof typeof form].error = 'Required';
        hasError = true;
      }
    });

    Object.entries(documents).forEach(([key, val]) => {
      if (!val.name) {
        updatedDocs[key as keyof typeof documents].error = 'Required';
        hasError = true;
      }
    });

    setForm(updatedForm);
    setDocuments(updatedDocs);
    if (hasError) return;

    const submissionData = {
      driver_id: driverId,
      ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.value])),
      ...Object.fromEntries(
        Object.entries(documents).map(([k, v]) => [k, v.url]),
      ),
    };

    console.log(submissionData);
    

    try {
      const res = await ApiService.addVehicle(
        buildFormData(submissionData),
      );
      
      if (res.data?.status === 'success') {
        showMessage({message: 'Successfully Registered Vehicle!', type: 'success'});
        navigation.navigate('MainApp')
      } else {
        showMessage({
          message: 'Failed',
          description: res.data?.message,
          type: 'danger',
        });
      }
    } catch (error) {
      console.log('Submission error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: "#ffffff"}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Vehicle Information</Text>
          <Text style={styles.subtitle}>
            Provide your vehicle details as the last step. And let's get started
          </Text>

          {Object.entries(form).map(([key, val]) =>
            key === 'vehicle_type' ? null : (
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
            ),
          )}

          {/* Vehicle Type Dropdown */}
          <View>
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={[
                styles.dropdown,
                form.vehicle_type.error ? styles.errorBorder : {},
              ]}>
              <Text
                style={{
                  color: form.vehicle_type.value ? '#000' : '#a9a9a9',
                  fontSize: 16,
                }}>
                {vehicleTypes.find(
                  v => v.id.toString() === form.vehicle_type.value,
                )?.category_name || 'Select vehicle type'}
              </Text>
              <Icon source="menu-down" size={24} />
            </TouchableOpacity>

            {menuVisible && (
              <View style={styles.dropdownMenu}>
                {vehicleTypes.map(vehicle => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setForm(prev => ({
                        ...prev,
                        vehicle_type: {value: vehicle.id.toString(), error: ''},
                      }));
                      setMenuVisible(false);
                    }}>
                    <Text style={styles.dropdownItemText}>
                      {vehicle.category_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {form.vehicle_type.error ? (
              <Text style={styles.errorText}>{form.vehicle_type.error}</Text>
            ) : null}
          </View>

          {/* Document Upload Buttons */}
          {Object.entries(documents).map(([key, val]) => (
            <UploadButton
              key={key}
              name={key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())}
              label={val.name || `Upload ${key.replace(/_/g, ' ')}`}
              onPress={() => handlePickDocument(key as keyof typeof documents)}
              error={!!val.error}
              errorText={val.error}
            />
          ))}

          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit}>
            SUBMIT
          </Button>
        </View>

        {/* Upload Modal */}
        <Modal
          visible={uploading}
          dismissable={false}
          contentContainerStyle={styles.modal}>
          <Text>Uploading...</Text>
        </Modal>
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
    padding: 20,
    paddingBottom: 60,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: '#fff',
    elevation: 3,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: colors.primary,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 40,
    alignItems: 'center',
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  errorBorder: {
    borderColor: 'red',
    backgroundColor: '#fff0f0',
  },
  heading: {
    color: colors.black,
    fontSize: 30,
    marginTop : 20,
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
});

export default AddVehicleDetailScreen;
