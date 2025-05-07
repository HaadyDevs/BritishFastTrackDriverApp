import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const AccountScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Profile</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1606760227091-3dd98327f4b5',
          }}
          style={styles.bannerImage}
        />

        <View style={styles.profileHeader}>
          <Image
            source={{uri: 'https://i.pravatar.cc/100'}}
            style={styles.avatar}
          />
          <Text style={styles.nameCentered}>Mr. Haady</Text>
        </View>

        <View style={styles.tileContainer}>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate('PersonalInformation')}>
            <Icon name="calendar" size={18} style={styles.icon} />
            <Text style={styles.tileText}>Personal information</Text>
            <Icon name="chevron-right" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={18} style={styles.icon} />
            <Text style={styles.tileText}>Settings</Text>
            <Icon name="chevron-right" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => console.log('Log out')}>
            <Icon name="log-out" size={18} style={styles.icon} />
            <Text style={styles.tileText}>Log out</Text>
            <Icon name="chevron-right" size={18} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#012169',
  },
  greeting: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -120,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  nameCentered: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
  },
  tileContainer: {
    paddingHorizontal: 20,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tileText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    color: '#333',
  },
});

export default AccountScreen;
