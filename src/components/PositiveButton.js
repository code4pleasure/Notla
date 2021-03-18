import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import {CustomText, Loader} from '.';
import Fonts from '../services/Fonts';

import colors from '../assets/colors';

const PositiveButton = (props) => {
  const {text, style, textStyle, onPress, loader} = props;

  if (loader) {
    return (
      <View onPress={onPress} style={[styles.button, style]}>
        <CustomText text={text} style={[styles.textStyle, textStyle]} />
        <Loader loading={true} />
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <CustomText text={text} style={[styles.textStyle, textStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 20,
    borderWidth: 0,
    borderColor: colors.mainBlue,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 3,
    borderTopRightRadius: 3,
    height: 50,
    justifyContent: 'center',
    backgroundColor: colors.mainBlue,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,
  },
  textStyle: {
    fontSize: 25,
    textAlign: 'center',
    color: colors.white,
    fontFamily: Fonts.regularFont,
  },
});

export default PositiveButton;
