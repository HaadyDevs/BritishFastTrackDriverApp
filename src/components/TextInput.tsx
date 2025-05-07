import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { colors } from '../theme/colors';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ errorText, ...props }: Props) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={colors.primary}
      underlineColor="transparent"
      placeholderTextColor={'#a9a9a9'}
      mode="outlined"
      activeOutlineColor={'#000000'}
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  input: {
    color: 'blue',
    backgroundColor: 'white',
  },
  error: {
    fontSize: 14,
    color: colors.primary,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);
