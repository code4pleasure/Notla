/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Text} from 'react-native';

//navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//screens
import {MainNoteScreen, NewNoteScreen, NoteDetailsScreen} from './src/screens';

const MainNoteStack = createStackNavigator();
function MainNoteStackScreen() {
  return (
    <MainNoteStack.Navigator headerMode="none">
      <MainNoteStack.Screen name="MainNote" component={MainNoteScreen} />
      <MainNoteStack.Screen name="NewNote" component={NewNoteScreen} />
      <MainNoteStack.Screen name="NoteDetails" component={NoteDetailsScreen} />
    </MainNoteStack.Navigator>
  );
}

export default class App extends Component {
  render() {
    const RootStack = createStackNavigator();
    return (
      <NavigationContainer>
        <RootStack.Navigator headerMode="none">
          <RootStack.Screen name="MainNote" component={MainNoteStackScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }
}
