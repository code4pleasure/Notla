import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/tr';

//Components
import {
  PositiveButton,
  CustomText,
  CustomInput,
  Loader,
} from '../../components';

//Services
import ScreenProvider from '../../services/ScreenProvider';
import Icons from '../../services/Icons';
import Fonts from '../../services/Fonts';
import Note from '../../services/Note';

//color
import colors from '../../assets/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ifIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';

//Modules
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class NewNoteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      content: null,
      newNoteLoader: false,
    };
  }

  componentDidMount() {
    moment.locale('tr');
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  createNote = async () => {
    const {title, content} = this.state;

    if (!title || !content) {
      Alert.alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    this.setState({newNoteLoader: true});
    const getNoteDataFromStore = await AsyncStorage.getItem('notes');
    let noteData = JSON.parse(getNoteDataFromStore);

    if (!noteData) {
      let notes = [];
      noteData = notes;
    }

    const newNote = Object.assign({}); //kopya obje
    newNote.title = title;
    newNote.content = content;
    newNote.noteTime = moment().format();

    noteData.push(newNote);

    await AsyncStorage.setItem('notes', JSON.stringify(noteData)).then(() => {
      const {navigation} = this.props;
      const {onRefresh} = this.props.route.params;
      this.setState({newNoteLoader: false}, () => {
        onRefresh();
        navigation.goBack();
      });
      //this.succesfullAddAlert();
    });
  };

  succesfullAddAlert = () => {
    const {navigation} = this.props;
    const {onRefresh} = this.props.route.params;
    Alert.alert(
      '',
      'Not başarıyla oluşturuldu',
      [
        {
          text: 'OK',
          onPress: () => {
            onRefresh();
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const {notes, content, title, newNoteLoader} = this.state;
    return (
      <ScreenProvider
        screenName="Not oluştur"
        rightIcon={Icons.back}
        //isScroll={true}
        rightIconOnPress={this.goBack}>
        <View style={styles.main}>
          <View style={styles.titleInputView}>
            <CustomInput
              style={styles.titleInput}
              placeholder="Not Başlığı"
              value={title}
              onChangeText={(text) => this.setState({title: text})}
            />
          </View>
          <View style={styles.contentInputView}>
            <CustomInput
              style={styles.contentInput}
              placeholder="Not İçeriği"
              multiline
              value={content}
              onChangeText={(text) => this.setState({content: text})}
            />
          </View>
          <PositiveButton
            text="Oluştur"
            onPress={this.createNote}
            loader={newNoteLoader}
          />
        </View>
      </ScreenProvider>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.softBackground,
    padding: 20,
  },
  titleInputView: {
    flex: 0.1,
    borderWidth: 0,
  },
  titleInput: {
    fontSize: 22,
    fontFamily: Fonts.boldFont,
    borderTopRightRadius: 20,
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.backgroundGrey,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    color: colors.textGrey,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,

    elevation: 7,
  },
  contentInputView: {
    flex: 0.8,
    marginVertical: 10,
  },
  contentInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.backgroundGrey,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    color: colors.textGrey,
    fontSize: 16,
    textAlignVertical: Platform.OS === 'android' ? 'top' : null,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: Fonts.regularFont,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,

    elevation: 7,
  },
  input: {},
});
