import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
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
    const {noteDetail, noteDetailIndex} = this.props.route.params;
    this.state = {
      title: noteDetail.title,
      content: noteDetail.content,
      noteDetailIndex: noteDetailIndex,
      updateNoteLoader: false,
      editTitle: false,
      editContent: false,
    };
  }

  componentDidMount() {
    moment.locale('tr');
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  updateNote = async () => {
    const {title, content, noteDetailIndex} = this.state;

    if (!title || !content) {
      Alert.alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    this.setState({updateNoteLoader: true});
    const getNoteDataFromStore = await AsyncStorage.getItem('notes');
    let noteData = JSON.parse(getNoteDataFromStore);

    const copyOfNoteData = [...noteData];
    copyOfNoteData[noteDetailIndex].title = title;
    copyOfNoteData[noteDetailIndex].content = content;

    noteData = copyOfNoteData;

    await AsyncStorage.setItem('notes', JSON.stringify(noteData)).then(() => {
      const {navigation} = this.props;
      const {onRefresh} = this.props.route.params;
      this.setState({updateNoteLoader: false}, () => {
        onRefresh();
        navigation.goBack();
      });
    });
  };

  deleteNote = async () => {
    const {noteDetailIndex} = this.state;
    const {navigation} = this.props;
    const {onRefresh} = this.props.route.params;

    this.setState({
      updateNoteLoader: true,
    });

    const getNoteDataFromStore = await AsyncStorage.getItem('notes');
    let noteData = JSON.parse(getNoteDataFromStore);

    noteData.splice(noteDetailIndex, 1);

    await AsyncStorage.setItem('notes', JSON.stringify(noteData)).then(() => {
      this.setState({updateNoteLoader: false});
      navigation.goBack();
      onRefresh();
    });
  };

  deleteNoteAlert = () => {
    Alert.alert(
      'Uyarı',
      'Bu notu silmek istediğinize emin misiniz?',
      [
        {
          text: 'Sil',
          onPress: () => {
            this.deleteNote();
          },
        },
        {
          text: 'İptal',
          onPress: () =>
            console.log('Silme işlemi kullanıcı tarafından iptal edildi'),
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const {
      notes,
      content,
      title,
      updateNoteLoader,
      editTitle,
      editContent,
    } = this.state;
    return (
      <ScreenProvider
        screenName="Not Detayları"
        rightIcon={Icons.back}
        leftIcon={Icons.trash}
        leftIconOnpress={this.deleteNoteAlert}
        rightIconOnPress={this.goBack}
        negativeText="Vazgeç">
        <View style={styles.main}>
          <View style={styles.titleInputView}>
            {editTitle ? (
              <CustomInput
                style={styles.titleInput}
                placeholder="Not Başlığı"
                value={title}
                onChangeText={(text) => this.setState({title: text})}
                inputRef={(ref) => (this.titleInputRef = ref)}
                onSubmitEditing={() => Keyboard.dismiss()}
                keyboardType="ascii-capable"
              />
            ) : (
              <TouchableOpacity
                style={styles.inActiveTitleView}
                onPress={() => {
                  this.setState({editTitle: true}, () => {
                    if (editContent) {
                      this.setState({editContent: false});
                      this.contentInputRef.blur();
                    }
                    this.titleInputRef.focus();
                  });
                }}>
                <Text style={styles.inActiveTitleText}>{title}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.contentInputView}>
            {editContent ? (
              <CustomInput
                style={styles.contentInput}
                placeholder="Not İçeriği"
                multiline
                value={content}
                onChangeText={(text) => this.setState({content: text})}
                inputRef={(ref) => (this.contentInputRef = ref)}
              />
            ) : (
              <TouchableOpacity
                style={styles.inActiveContentView}
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({editContent: true}, () => {
                    if (editTitle) {
                      this.setState({editTitle: false});
                      this.titleInputRef.blur();
                    }
                    this.contentInputRef.focus();
                  });
                }}>
                <Text style={styles.inActiveContentText}>{content}</Text>
              </TouchableOpacity>
            )}
          </View>
          <PositiveButton text="Güncelle" onPress={this.updateNote} />
          {updateNoteLoader ? <Loader loading={true} /> : null}
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
  inActiveTitleView: {
    fontSize: 22,
    fontFamily: Fonts.boldFont,
    borderTopRightRadius: 20,
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.backgroundGrey,
    paddingHorizontal: 10,
    backgroundColor: colors.softBackground,
    color: colors.textGrey,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,

    elevation: 7,
    justifyContent: 'center',
  },
  inActiveTitleText: {
    fontSize: 22,
    fontFamily: Fonts.boldFont,
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
  inActiveContentView: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: colors.backgroundGrey,
    paddingHorizontal: 10,
    backgroundColor: colors.softBackground,
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
  inActiveContentText: {
    fontSize: 16,
    fontFamily: Fonts.regularFont,
  },
  input: {},
});
