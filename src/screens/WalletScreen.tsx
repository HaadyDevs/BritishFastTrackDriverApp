import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const WalletScreen = () => {
  const totalEarnings = 1250.75;
  const ridesThisWeek = 14;
  const todaysEarnings = 180.5;
  const ridesToday = 3;
  const avgEarningToday =
    ridesToday > 0 ? (todaysEarnings / ridesToday).toFixed(2) : '0.00';

  const recentRides = [
    {id: '1', date: 'May 4', location: 'Downtown to Airport', amount: 42.5},
    {id: '2', date: 'May 3', location: 'Hotel Plaza to Mall', amount: 30.0},
    {
      id: '3',
      date: 'May 2',
      location: 'Central Station to Park',
      amount: 28.25,
    },
  ];

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Wallet</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Earnings</Text>
            <Text style={styles.cardValue}>${totalEarnings.toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Earnings</Text>
            <Text style={styles.cardValue}>${todaysEarnings.toFixed(2)}</Text>
            <Text style={styles.cardSubtitle}>Rides Today: {ridesToday}</Text>
          </View>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rides This Week</Text>
            <Text style={styles.cardValue}>{ridesThisWeek}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Avg Earn / Ride (Today)</Text>
            <Text style={styles.cardValue}>${avgEarningToday}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Recent Rides</Text>
        {recentRides.map(ride => (
          <View key={ride.id} style={styles.rideCard}>
            <View style={{flex: 1}}>
              <Text style={styles.rideLocation}>{ride.location}</Text>
              <Text style={styles.rideDate}>{ride.date}</Text>
            </View>
            <Text style={styles.rideAmount}>${ride.amount.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#012169',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 10,
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  rideLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  rideDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  rideAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#012169',
    marginLeft: 10,
  },
});
