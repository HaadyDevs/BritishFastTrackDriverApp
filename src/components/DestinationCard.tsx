// src/components/DestinationCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface Props {
  title: string;
  icon: any;
}

export const DestinationCard: React.FC<Props> = ({ title, icon }) => {
  return (
    <View style={styles.card}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
    width: 80,
    height: 80,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  text: {
    color: colors.secondary,
    fontFamily: fonts.medium,
    fontSize: 12,
    textAlign: 'center',
  },
});