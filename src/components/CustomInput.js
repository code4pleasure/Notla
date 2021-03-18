import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput, Keyboard} from 'react-native';

import Fonts from '../services/Fonts';

type Props = {
  style: *,
  inputRef: *,
};

const CustomText = (props: Props) => {
  const {style, inputRef} = props;
  return <TextInput style={[styles.input, style]} {...props} ref={inputRef} />;
};

const styles = StyleSheet.create({
  input: {
    fontFamily: Fonts.normalFont,
  },
});

export default CustomText;
