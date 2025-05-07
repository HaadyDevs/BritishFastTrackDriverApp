import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../theme/colors';

type Ride = {
  id: string;
  type: 'normal' | 'hourly';
  date: string;
  time: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  durationHours?: number;
  charge: string;
};

const ridesUpcoming: Ride[] = [
  {
    id: '1',
    type: 'normal',
    date: 'Apr 12',
    time: '10:00 AM',
    pickupLocation: '123 Main St',
    dropoffLocation: '456 Queen Rd',
    charge: '£45.00',
  },
  {
    id: '2',
    type: 'hourly',
    date: 'Apr 15',
    time: '02:00 PM',
    durationHours: 3,
    charge: '£90.00',
  },
];

const ridesPast: Ride[] = [
  {
    id: '3',
    type: 'normal',
    date: 'Apr 1',
    time: '09:30 AM',
    pickupLocation: '789 Elm St',
    dropoffLocation: '222 Abbey Rd',
    charge: '£38.00',
  },
];

const RideCard = ({ride}: {ride: Ride}) => (
  <View style={styles.card}>
    <Text style={styles.dateTime}>
      {ride.date} at {ride.time}
    </Text>
    {ride.type === 'normal' ? (
      <>
        <Text style={styles.location}>From: {ride.pickupLocation}</Text>
        <Text style={styles.location}>To: {ride.dropoffLocation}</Text>
      </>
    ) : (
      <Text style={styles.location}>
        Hourly Ride • {ride.durationHours} hours
      </Text>
    )}
    <Text style={styles.charge}>Charge: {ride.charge}</Text>
  </View>
);

const RideList = ({rides}: {rides: Ride[]}) => {
  if (rides.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No rides available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={rides}
      keyExtractor={item => item.id}
      renderItem={({item}) => <RideCard ride={item} />}
      contentContainerStyle={styles.listContent}
    />
  );
};

const UpcomingTab = () => <RideList rides={ridesUpcoming} />;
const PastTab = () => <RideList rides={ridesPast} />;

const Tab = createMaterialTopTabNavigator();

const RidesScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rides</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000000',
          },
          tabBarStyle: {backgroundColor: '#ffffff'},
          tabBarIndicatorStyle: {backgroundColor: colors.primary, height: 4},
        }}>
        <Tab.Screen name="Upcoming" component={UpcomingTab} />
        <Tab.Screen name="Past" component={PastTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#012169',
  },
  headerText: {color: '#ffffff', fontSize: 24, fontWeight: 'bold'},
  dateTime: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#444',
  },
  charge: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default RidesScreen;
