import {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ExtendedLine from '../components/ExtendedLine';
import ThemeTextInput from '../components/ThemeTextInput';
import Colors from '../constants/Colors';
import {IUser} from '../interfaces/User.interface';
import {ScrollView} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import {boldText, heading2} from '../constants/MasterStyles';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {ScreenNames} from '../constants/ScreenNames';
import {useSelector, useDispatch} from 'react-redux';
import {setUserDetails} from '../react-redux/actions';
import ThemeNumberInput from '../components/ThemeNumberInput';
import storage from '@react-native-firebase/storage';
import Header from '../components/Header';
// @ts-ignore
import CameraIcon from '../assets/camera.svg';
// @ts-ignore
import CheckIcon from '../assets/checkmark.svg';
// @ts-ignore
import CloseIcon from '../assets/close-outline.svg';
import toast from '../components/toast';
import database from '@react-native-firebase/database';
const SettingsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [loader, setLoader] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [percent, setPercent] = useState(-1);
  const sid = useSelector(state => state.sid);
  const phone = useSelector(state => state.phoneNumber);
  let user: Partial<IUser> = useSelector(state => state.userDetails);
  const role = useSelector(state => state.role);

  const fetchUser = async () => {
    setName(user.name);
    setAddress(user.address);
    setImageUrl(user.imageUrl);
    setCity(user.city);
    // @ts-ignore
    setPin(user.pin);
  };
  const setUserData = async () => {
    setLoader(true);
    await AsyncStorage.setItem('userDetails', JSON.stringify(user));
    setLoader(false);
  };

  useEffect(() => {
    fetchUser().then(() => setLoader(false));
    return navigation.addListener('focus', async () => {
      fetchUser().then(() => setLoader(false));
    });
  }, [navigation]);

  let onSelectImage = () => {
    const options = {
      noData: true,
      maxWidth: 200,
      maxHeight: 200,
      aspectRatio: 1,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      let task;
      const storageRef = storage().ref().child(sid);
      const id = Date.now();
      if (response.uri) {
        fetch(response.uri)
          .then(res => res.blob())
          .then(async blob => {
            setLoader(true);
            task = storageRef
              .child(`/UserImages/${id}.jpg`)
              .put(blob)
              .then(snapshot => {
                console.log(
                  snapshot.bytesTransferred,
                  '/',
                  snapshot.totalBytes,
                  snapshot.bytesTransferred / snapshot.totalBytes,
                );
                storageRef
                  .child(`/UserImages/${id}.jpg`)
                  .getDownloadURL()
                  .then(url => {
                    setLoader(false);
                    setImageUrl(url);
                    setPercent(-1);
                  })
                  .catch(() => {
                    storageRef
                      .child(`/UserImages/${id}_200x200.jpg`)
                      .getDownloadURL()
                      .then(url => {
                        setLoader(false);
                        console.log('url', url);
                        setImageUrl(url);
                        setPercent(-1);
                      });
                  });
              })
              .catch(error => {
                if (error) {
                  alert("Can't pick the Image at the moment, Try again Later");
                }
              });

            task.on('state_changed', snapshot => {
              setPercent(
                Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                ),
              );
            });
          });
      }
      setLoader(false);
    });
  };

  const onSave = () => {
    if (name === '') {
      alert("Name field can't be Empty");
    } else {
      setLoader(true);
      user = {
        name,
        imageUrl: imageUrl || '',
        address,
        city,
        // @ts-ignore
        pin,
      };
      database().ref('/Users')
        .child(phone)
        .update(user)
        .then(() => {
          setUserData().then(r => r);
          setLoader(false);
          dispatch(setUserDetails(user));
          navigation.navigate(ScreenNames.SettingsScreen);
          toast('Details Updated!');
        });
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screenContainer}>
      {/*// @ts-ignore*/}
      <ProgressDialog visible={loader} message="Please, wait..." />
      <Header navigation={navigation} title={'Settings'} role={role} />
      <ScrollView>
        <ExtendedLine />
        <View style={styles.container}>
          <View style={styles.actionBar}>
            <TouchableOpacity onPress={onCancel}>
              <CloseIcon height={20} width={20} fill={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave}>
              <CheckIcon height={30} width={30} fill={Colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: imageUrl
                  ? imageUrl
                      .replace('_200x200', '')
                      .replace('.jpg', '_200x200.jpg')
                  : '',
              }}
            />
            <View style={styles.addImage}>
              <TouchableOpacity onPress={onSelectImage}>
                <CameraIcon height={30} width={30} fill={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.formContainer}>
              {/*// @ts-ignore*/}
              <Text style={styles.label}>Your Phone Number</Text>
              <View style={styles.phoneContainer}>
                <Text style={styles.phoneText}>{phone}</Text>
              </View>
            </View>

            <View style={styles.formContainer}>
              {/*// @ts-ignore*/}
              <Text style={styles.label}>Your Name</Text>
              <ThemeTextInput
                onChangeText={n => setName(n)}
                placeholder="Walter White"
                value={name}
              />
            </View>

            <View style={styles.formContainer}>
              {/*// @ts-ignore*/}
              <Text style={styles.label}>Your Address</Text>
              <ThemeTextInput
                onChangeText={a => setAddress(a)}
                placeholder="Street Address"
                value={address}
              />
              <ThemeTextInput
                onChangeText={a => setCity(a)}
                placeholder="City"
                value={city}
              />
              <ThemeNumberInput
                onChangeText={a => setPin(a)}
                placeholder="Pin code"
                value={pin}
                keyboard={'number-pad'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const imageRadius = 70;
// @ts-ignore
const styles = StyleSheet.create({
  bottomContainer: {
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: Colors.white,
    paddingTop: 15,
    elevation: 10,
  },
  phoneContainer: {
    marginHorizontal: 5,
    borderRadius: 5,
    borderColor: Colors.charcoalGrey,
    borderBottomWidth: 1.5,
    overflow: 'hidden',
  },
  phoneText: {
    paddingHorizontal: 2,
    paddingBottom: 3,
    paddingTop: 12,
    fontSize: 17,
    fontFamily: 'Nunito-SemiBold',
  },
  screenContainer: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  imageContainer: {
    // paddingTop: 60,
    //  borderBottomLeftRadius: 99999,
    //  borderBottomRightRadius: 99999,
    shadowOffset: {width: 0, height: -5},
    shadowColor: Colors.primaryColorDark,
    shadowOpacity: 0.3,
    paddingBottom: 40,
  },
  addImage: {
    elevation: 10,
    position: 'absolute',
    right: 40,
    bottom: 90,
    padding: 15,
    borderRadius: 30,
    backgroundColor: Colors.lightgray,
  },
  formContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    ...boldText,
    ...heading2,
    marginVertical: 12,
    textAlign: 'center',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.accentColorRGBA,
  },
  actionBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
  },
  cancelButton: {
    width: 80,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.charcoalGrey,
    borderWidth: 3,
    padding: 5,
  },
  saveButton: {
    width: 80,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.primaryColorDark,
    borderWidth: 3,
    padding: 5,
  },
  image: {
    elevation: 10,
    height: imageRadius * 2,
    width: imageRadius * 2,
    borderRadius: imageRadius,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
  },
  label: {
    marginHorizontal: 5,
    marginTop: 10,
    paddingHorizontal: 8,
    color: Colors.charcoalGreyMediocre,
    ...boldText,
    fontFamily: 'Nunito-SemiBold',
  },
});

export default SettingsScreen;
