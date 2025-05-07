import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const RideInProgressScreen = () => {
  const pickup = 'Heathrow Airport';
  const drop = "Harrow on the Hill";
  const stops = [];

  const customer = {
    name: 'John Doe',
    phone: '+44 7123 456789',
  };

  const openInMaps = () => {
    const origin = encodeURIComponent(pickup);
    const destination = encodeURIComponent(drop);
    const waypointStr = stops.map(encodeURIComponent).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving${
      waypointStr ? `&waypoints=${waypointStr}` : ''
    }`;

    // Directly open the Google Maps URL
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Unable to open Google Maps.');
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${customer.phone}`).catch((err) => {
      console.error('Failed to open dialer', err);
      Alert.alert('Error', 'Unable to make a call.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ride in Progress</Text>

      <ScrollView contentContainerStyle={styles.timeline}>
        {/* Pickup */}
        <View style={styles.item}>
          <Icon name="map-pin" size={24} color="#10B981" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.address}>{pickup}</Text>
          </View>
        </View>

        {/* Stops */}
        {stops.map((stop, index) => (
          <View key={index} style={styles.item}>
            <Icon name="map" size={24} color="#F59E0B" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Stop {index + 1}</Text>
              <Text style={styles.address}>{stop}</Text>
            </View>
          </View>
        ))}

        {/* Drop */}
        <View style={styles.item}>
          <Icon name="flag" size={24} color="#3B82F6" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Drop-off</Text>
            <Text style={styles.address}>{drop}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerCard}>

          <View style={styles.textContainer}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerPhone}>{customer.phone}</Text>
          </View>
          {/* Call icon */}
          <TouchableOpacity onPress={handleCall}>
            <Icon name="phone" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Google Maps Button */}
      <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
        <MaterialIcon
          name="map"
          size={20}
          color="#1D4ED8"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.mapButtonText}>Open in Google Maps</Text>
      </TouchableOpacity>

      {/* End Trip Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>End Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RideInProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 50,
  },
  timeline: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  address: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
  },
  customerIcon: {
    backgroundColor: '#E5E7EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInitial: {
    fontSize: 20,
    color: '#374151',
    fontWeight: '600',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  customerPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginTop: 16,
  },
  mapButtonText: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});