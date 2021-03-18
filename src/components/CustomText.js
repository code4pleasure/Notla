import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';

import Fonts from '../services/Fonts';

const CustomText = (props) => {
  const {style, text} = props;
  return (
    <Text style={[styles.textStyle, style]} {...props}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.normalFont,
  },
});

export default CustomText;
