import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../theme/colors';
import ApiService from '../utls/apiService';

interface TourBooking {
  id: number;
  tour_booking_id: TourBookingDetails;
  driver_id: number;
  status: string;
  created_at: number;
  updated_at: number;
}

interface TourBookingDetails {
  id: number;
  first_name: string;
  last_name: string;
  contact_number: string;
  no_of_passenger: number;
  no_of_luggage: number;
  no_of_hand_luggage: number;
  amount: string;
  pickup: string | null; // Assuming pickup can be null
  drop: string | null;
  stops: number; // Assuming drop can be null
}

const HomeScreen = () => {
  const navigation = useNavigation();

  const [activeRides, setActiveRides] = useState<TourBooking[]>([]);

  const fetchActiveRides = async () => {
    try {
      const res = await ApiService.getActiveRides(54);
      console.log(res);

      setActiveRides(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.log('Error fetching active rides:', error);
      setActiveRides([]);
    }
  };

  // Smart polling using useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchActiveRides(); // Fetch immediately on focus

      const interval = setInterval(() => {
        fetchActiveRides();
      }, 5000); // Poll every 5 seconds

      return () => {
        clearInterval(interval); // Cleanup when screen is blurred/unmounted
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Active Rides</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* {activeRides.filter(trip => trip.status === 'pending').length === 0 && (
          <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <Text style={{color: '#000000', marginTop: 100, fontSize: 18}}>No Active Rides Right Now</Text>
          </View>
        )} */}
        {activeRides &&
          activeRides.length > 0 &&
          activeRides
            .map(trip => (
              <View key={trip.id} style={styles.card}>
                <View style={styles.cardContent}>
                  {/* Amount at Top */}
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>
                      £{trip.tour_booking_id.amount}
                    </Text>
                  </View>

                  {/* Locations */}
                  <View style={styles.locations}>
                    <View style={styles.locationColumn}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#012169"
                      />
                      <View
                        style={{
                          ...styles.dottedLine,
                          ...(trip.tour_booking_id.stops > 0
                            ? {height: 26}
                            : {}),
                        }}
                      />
                      <Ionicons name="flag-outline" size={18} color="#012169" />
                    </View>
                    <View style={styles.locationDetails}>
                      <Text style={styles.locationText}>
                      Heathrow Airport
                      </Text>
                      {trip.tour_booking_id.stops > 0 && (
                        <Text style={styles.stopText}>
                          + {trip.tour_booking_id.stops} Stops
                        </Text>
                      )}
                      <Text style={styles.locationText}>
                      Harrow on the Hill
                      </Text>
                    </View>
                  </View>

                  {/* Info Row */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="person-outline" size={16} color="#555" />
                      <Text style={styles.infoText}>
                        {trip.tour_booking_id.no_of_passenger} Pax
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons
                        name="briefcase-outline"
                        size={16}
                        color="#555"
                      />
                      <Text style={styles.infoText}>
                        {trip.tour_booking_id.no_of_luggage} Luggage
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="bag-outline" size={16} color="#555" />
                      <Text style={styles.infoText}>
                        {trip.tour_booking_id.no_of_hand_luggage} Hand
                      </Text>
                    </View>
                  </View>

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        {backgroundColor: '#dc3545'},
                      ]}>
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        {backgroundColor: '#012169'},
                      ]}
                      onPress={() => navigation.navigate("RideInProgress")}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  scrollContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardContent: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  amountContainer: {
    // alignItems: 'flex-end',
    marginBottom: 10,
  },
  amountText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  locations: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  locationColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  dottedLine: {
    width: 1,
    height: 20,
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#aaa',
    marginVertical: 2,
  },
  locationDetails: {
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  stopText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'grey',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 12,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;
