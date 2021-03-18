/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

import colors from '../assets/colors';

type Props = {
  loading: boolean,
  indicatorColor: String,
};

// eslint-disable-next-line no-confusing-arrow
const Loader = ({loading, indicatorColor}: Props) =>
  loading ? (
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator
          animating={loading}
          color={indicatorColor || colors.softBackground}
          size={16}
        />
      </View>
    </View>
  ) : null;

const styles = StyleSheet.create({
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
    borderRadius: 10,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
