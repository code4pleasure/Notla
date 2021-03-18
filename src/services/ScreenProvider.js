import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

//Services
import Icons from './Icons';
import Fonts from './Fonts';

//Modules
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ifIphoneX, getStatusBarHeight} from 'react-native-iphone-x-helper';

//Assets
import colors from '../assets/colors';

export default class ScreenProvider extends Component {
  render() {
    const {
      children,
      screenName,
      leftIcon,
      rightIcon,
      leftIconOnpress,
      rightIconOnPress,
      goBack,
      goBackIcon,
      isScroll,
    } = this.props;

    return (
      <View style={styles.main}>
        <View style={styles.mainHeader}>
          <Text style={styles.screenNameStyle}>{screenName}</Text>
          <TouchableOpacity
            onPress={leftIconOnpress}
            style={styles.leftIconView}>
            <Icon name={leftIcon} style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={rightIconOnPress}
            style={styles.rightIconView}>
            <Icon name={rightIcon} style={styles.icons} />
          </TouchableOpacity>
        </View>
        {isScroll !== false ? (
          <View style={styles.childrenView}>
            <KeyboardAwareScrollView
              contentContainerStyle={{flex: 1}}
              keyboardShouldPersistTaps="always">
              {children}
            </KeyboardAwareScrollView>
          </View>
        ) : (
          <View style={styles.childrenView}>{children}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + 45,
      },
      {
        paddingTop: 45,
      },
    ),
    backgroundColor: colors.mainBlue,
    padding: 10,
    paddingHorizontal: 20,
  },
  headerLeft: {
    alignItems: 'center',
  },
  headerScreenName: {
    paddingLeft: 25,
  },
  headerRight: {
    alignItems: 'center',
  },
  screenNameStyle: {
    fontSize: 30,
    color: colors.white,
    flex: 1,
    fontFamily: Fonts.normalFont,
  },
  childrenView: {
    flex: 1,
  },
  leftIconView: {
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
  },
  rightIconView: {
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icons: {
    fontSize: 35,
    color: colors.white,
  },
});
