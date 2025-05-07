import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Alert, PermissionsAndroid} from 'react-native';

// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
// import LoginScreen from './src/screens/LoginScreen';
// import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import AccountScreen from './src/screens/AccountScreen';
import {colors} from './src/theme/colors';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegisterScreen';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import DriverInfoScreen from './src/screens/DriverInfoScreen';
import OtpVerificationScreen from './src/screens/OTPScreen';
import AddVehicleDetailScreen from './src/screens/AddVehicleDetailScreeen';
import {Provider} from 'jotai';
import messaging from '@react-native-firebase/messaging';
import {getAuth, signInAnonymously} from '@react-native-firebase/auth';
import RideInProgressScreen from './src/screens/RideInProgress';
import WalletScreen from './src/screens/WalletScreen';

// Create Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🏠 Home Stack (inside Home Tab)
const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
  </Stack.Navigator>
);

// 🚖 Bottom Tab Navigator (Main App after login)
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({color, size}) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Wallet') iconName = 'coins';
        else if (route.name === 'Account') iconName = 'user';

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarStyle: {
        backgroundColor: '#012169',
        height: 55,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.secondary,
    })}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

// 📱 Main App Navigator
const App = () => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await messaging().registerDeviceForRemoteMessages();

          // Get the token
          const token = await messaging().getToken();
          console.log(token);
        } else {
          console.log('Notification permission denied');
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
    };

    const signInFirebase = async () => {
      signInAnonymously(getAuth())
        .then(() => {
          console.log('User signed in anonymously');
        })
        .catch(error => {
          if (error.code === 'auth/operation-not-allowed') {
            console.log('Enable anonymous in your firebase console.');
          }

          console.error(error);
        });
    };

    requestNotificationPermission();
    signInFirebase()
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);

      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('📲 Notification opened app from background:', remoteMessage);
      // Navigate based on `remoteMessage.data`
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '🧊 App launched from quit by notification:',
            remoteMessage,
          );
          // Navigate or pre-load trip details
        }
      });
  }, []);

  return (
    <Provider>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1}}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {/* AUTH FLOW */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="DriverInfo" component={DriverInfoScreen} />
            <Stack.Screen
              name="AddVehicle"
              component={AddVehicleDetailScreen}
            />
            <Stack.Screen name="Otp" component={OtpVerificationScreen} />
            <Stack.Screen name="RideInProgress" component={RideInProgressScreen} />

            {/* MAIN APP */}
            <Stack.Screen name="MainApp" component={MainTabNavigator} />

          </Stack.Navigator>
          <FlashMessage position="bottom" />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
