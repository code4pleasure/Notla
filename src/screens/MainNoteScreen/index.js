import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Easing,
} from 'react-native';

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

//color
import colors from '../../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ifIphoneX, getBottomSpace} from 'react-native-iphone-x-helper';

//Modules
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const emptyIcon = require('../../assets/icons/broke.png');

export default class MainNoteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBarVisibility: true,
      notes: null,
      notesLoader: false,
      setRender: false,
      isSearchInputOpened: false,
      searchInputHeight: new Animated.Value(0),
      searchInputValue: null,
      searchedArray: null,
    };
  }

  componentDidMount() {
    this.getNotes();
  }

  getNotes = async () => {
    this.setState({
      notesLoader: true,
    });
    const getNoteDataFromStore = await AsyncStorage.getItem('notes');
    let noteData = JSON.parse(getNoteDataFromStore);

    let sortedNotes = noteData
      ? noteData.sort(function (a, b) {
          return new Date(b.noteTime) - new Date(a.noteTime);
        })
      : null;

    this.setState({
      notes: sortedNotes ? sortedNotes : null,
      searchedArray: sortedNotes ? sortedNotes : null,
      notesLoader: false,
    });
  };

  deleteNote = async (index) => {
    const {notes} = this.state;
    this.setState({
      notesLoader: true,
    });

    /* const getNoteDataFromStore = await AsyncStorage.getItem('notes');
    let noteData = JSON.parse(getNoteDataFromStore); */

    notes.splice(index, 1);

    await AsyncStorage.setItem('notes', JSON.stringify(notes)).then(() => {
      this.setState({newNoteLoader: false});
      this.getNotes();
    });
  };

  deleteNoteAlert = (item, index) => {
    Alert.alert(
      'Uyarı',
      item.title + ' başlıklı notunuzu silmek istediğinize emin misiniz?',
      [
        {
          text: 'Sil',
          onPress: () => {
            this.deleteNote(index);
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

  showSearchBar = () => {
    this.setState({
      searchBarVisibility: false,
    });
  };

  goToNewNote = () => {
    this.props.navigation.navigate('NewNote', {onRefresh: this.getNotes});
  };

  _renderNotes = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          this.props.navigation.navigate('NoteDetails', {
            noteDetail: item,
            noteDetailIndex: index,
            onRefresh: this.getNotes,
          })
        }>
        <CustomText text={item.title} style={styles.noteTitle} />
        <CustomText
          text={item.content}
          style={styles.noteContent}
          numberOfLines={2}
        />
        <View style={styles.bottomRow}>
          <CustomText
            text={moment(item.noteTime).format('LLL')}
            style={styles.noteDateTime}
          />
          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => this.deleteNoteAlert(item, index)}>
            <Icon name={Icons.trash} style={styles.trashIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  onRefresh = () => {
    this.getNotes();
  };

  openSearchInput = () => {
    const {searchInputHeight, isSearchInputOpened} = this.state;

    this.setState({
      isSearchInputOpened: true,
    });

    if (!isSearchInputOpened) {
      Animated.timing(searchInputHeight, {
        toValue: 60,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(searchInputHeight, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }).start(() => this.setState({isSearchInputOpened: false}));
    }
  };

  handleSearch = (text) => {
    const {notes} = this.state;
    const copyOfNotes = [...notes];

    let searchedArray = copyOfNotes.filter((data) => {
      return (
        String(data.title.toLowerCase()).includes(text.toLowerCase()) ||
        String(data.content.toLowerCase()).includes(text.toLowerCase()) ||
        String(moment(data.noteTime).format('LLL').toLowerCase()).includes(
          text.toLowerCase(),
        )
      );
    });

    this.setState({
      searchedArray,
      searchInputValue: text,
    });
  };

  render() {
    const {
      notes,
      notesLoader,
      searchInputHeight,
      isSearchInputOpened,
      searchInputValue,
      searchedArray,
    } = this.state;

    const searchInputInterpolation = searchInputHeight.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 60],
    });

    return (
      <ScreenProvider
        screenName="Notlarım"
        isScroll={false}
        rightIcon={!notes || notes.length < 1 ? null : Icons.search}
        rightIconOnPress={this.openSearchInput}>
        {notesLoader ? (
          <Loader loading={true} />
        ) : !notes || notes.length < 1 ? (
          <View style={styles.emptyNoteMain}>
            <View style={styles.emptyIconView}>
              <View style={{flex: 1}}>
                <Image
                  style={styles.emptyIcon}
                  resizeMode="contain"
                  source={emptyIcon}
                />
              </View>
              <Text style={styles.emptyIconText}>
                Henüz notunuz bulunmuyor.
              </Text>
            </View>
            <View style={styles.emptyIconTextView}>
              <PositiveButton
                text="Yeni not oluştur"
                style={styles.buttonStyle}
                onPress={this.goToNewNote}
              />
            </View>
          </View>
        ) : (
          <View style={styles.main}>
            {isSearchInputOpened ? (
              <Animated.View
                style={[styles.inputView, {height: searchInputInterpolation}]}>
                <CustomInput
                  style={styles.searchInput}
                  placeholder="Ara"
                  value={searchInputValue}
                  onChangeText={this.handleSearch}
                />
              </Animated.View>
            ) : null}
            <FlatList
              data={searchInputValue ? searchedArray : notes}
              renderItem={this._renderNotes}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.plusIconPress}
              onPress={this.goToNewNote}>
              <Icon name="plus" style={styles.plusIcon} />
            </TouchableOpacity>
          </View>
        )}
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
  inputView: {},
  searchInput: {
    fontSize: 20,
    flex: 1,
    fontFamily: Fonts.regularFont,
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
  emptyNoteMain: {
    flex: 1,
    backgroundColor: colors.softBackground,
    padding: 20,
  },
  buttonStyle: {
    alignSelf: 'stretch',
  },
  emptyIconText: {
    fontSize: 24,
    fontFamily: Fonts.regularFont,
    textAlign: 'center',
  },
  emptyIcon: {
    width: '100%',
    height: '100%',
  },
  emptyIconView: {
    flex: 0.5,
  },
  emptyIconTextView: {
    flex: 0.5,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
    padding: 20,
  },
  noteTitle: {
    color: colors.textGrey,
    //fontWeight: 'bold',
    fontFamily: Fonts.boldFont,
  },
  noteContent: {
    color: colors.textGrey,
    marginTop: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'flex-end',
  },
  noteDateTime: {
    color: '#B3B4B8',
    flex: 1,
  },
  trashButton: {
    backgroundColor: colors.backgroundGrey,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trashIcon: {
    fontSize: 25,
  },
  plusIconPress: {
    backgroundColor: colors.mainBlue,
    position: 'absolute',
    right: 30,
    ...ifIphoneX(
      {
        bottom: getBottomSpace() + 20,
      },
      {
        bottom: 20,
      },
    ),
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  plusIcon: {
    fontSize: 50,
    color: colors.white,
  },
  searchBar: {
    flex: 9,
    backgroundColor: 'red',
    fontSize: 20,
  },
});
