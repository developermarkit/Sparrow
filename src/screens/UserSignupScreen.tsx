import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import ExtendedLine from '../components/ExtendedLine';
import ThemeTextInput from '../components/ThemeTextInput';
import Colors from '../constants/Colors';
import ImagePicker from 'react-native-image-picker';
import {db, storage} from '../firebase.config';
// import {sid} from '../App';
import {IUser} from '../interfaces/User.Interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {EOrderStatus, EUserRole} from '../constants/Enums';
import {ScreenNames} from '../constants/ScreenNames';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {useDispatch, useSelector} from 'react-redux';
import {setUserDetails} from '../react-redux/actions';
import ThemeButton from '../components/ThemeButton';
import ThemeNumberInput from '../components/ThemeNumberInput';
// @ts-ignore
import CameraIcon from '../assets/camera.svg';
import {boldText} from '../constants/MasterStyles';
import ThemeButtonGrayDisabled from '../components/ThemeButtonGrayDisabled';

const UserSignupScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [loader, setLoader] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [percent, setPercent] = useState(-1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [role, setRole] = useState(EUserRole.USER);
  let user: IUser;
  const phoneNumber = useSelector(state => state.phoneNumber);
  const sid = useSelector(state => state.sid);

  const onSave = () => {
    if (name === '' || address === '' || city === '' || pin === '') {
      alert('Please enter all the details');
    } else {
      setLoader(true);
      user = {
        name,
        imageUrl: imageUrl || '',
        address,
        city,
        // @ts-ignore
        pin,
        role,
      };

      db.ref('/Users')
        .child(phoneNumber)
        .update(user)
        .then(() => {
          dispatch(setUserDetails(user));
          setLoader(false);
          navigation.navigate(ScreenNames.ShopStack);
        });
    }
  };

  let onSelectImage = () => {
    const options = {
      noData: true,
      maxWidth: 200,
      maxHeight: 200,
      aspectRatio: 1,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      let task;
      const storageRef = storage.ref().child(sid);
      const name = Date.now();
      if (response.uri) {
        fetch(response.uri)
          .then(res => res.blob())
          .then(async blob => {
            setLoader(true);
            task = storageRef
              .child(`/UserImages/${name}.jpg`)
              .put(blob)
              .then(snapshot => {
                console.log(
                  snapshot.bytesTransferred,
                  '/',
                  snapshot.totalBytes,
                  snapshot.bytesTransferred / snapshot.totalBytes,
                );
                storageRef
                  .child(`/UserImages/${name}.jpg`)
                  .getDownloadURL()
                  .then(url => {
                    setLoader(false);
                    // const imgUrl = url.replace('.jpg', '_200x200.jpg');
                    console.log('url', url);
                    setImageUrl(url);
                    setPercent(-1);
                  })
                  .catch(() => {
                    storageRef
                      .child(`/UserImages/${name}_200x200.jpg`)
                      .getDownloadURL()
                      .then(url => {
                        setLoader(false);
                        // const imgUrl = url.replace('.jpg', '_200x200.jpg');
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

  return (
    <View style={styles.screenContainer}>
      {/*// @ts-ignore*/}
      <ProgressDialog visible={loader} message="Please, wait..." />
      <ScrollView>
        {/*// @ts-ignore*/}
        <Text style={styles.title}>Enter your details</Text>
        <ExtendedLine />
        <View style={styles.container}>
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
            <View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Your Name (required)</Text>
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
                  placeholder="Ghaziabad"
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
            <View style={styles.actionBar}>
              {name && city && pin && address ? (
                <ThemeButton
                  title="Sign me up!"
                  onPress={onSave}
                  textUpperCase
                />
              ) : (
                <ThemeButtonGrayDisabled
                  onPress={onSave}
                  title={'Sign me Up!'}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const imageRadius = 70;
const styles = StyleSheet.create({
  formContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  screenContainer: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  bottomContainer: {
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: Colors.white,
    paddingVertical: 30,
    //paddingHorizontal: 20,
    elevation: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    ...boldText,
    fontSize: 18,
    color: Colors.charcoalGrey80,
    fontFamily: 'Nunito-Light',
    textAlign: 'center',
    padding: 10,
  },
  image: {
    height: imageRadius * 2,
    width: imageRadius * 2,
    borderRadius: imageRadius,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
  },
  addImageText: {
    alignSelf: 'center',
    color: Colors.primaryColor,
    fontSize: 20,
    padding: 10,
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.accentColorRGBA,
  },
  actionBar: {
    marginHorizontal: 100,
    marginVertical: 10,
    padding: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 20,
    margin: 5,
  },
  inactive: {
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.charcoalGrey,
    borderWidth: 3,
    padding: 5,
  },
  active: {
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.primaryColorDark,
    borderWidth: 3,
    padding: 5,
  },
  imageContainer: {
    paddingVertical: 50,
  },
  addImage: {
    position: 'absolute',
    right: 40,
    bottom: 90,
    padding: 15,
    borderRadius: 30,
    backgroundColor: Colors.lightgray,
  },
  label: {
    marginHorizontal: 5,
    marginTop: 10,
    paddingHorizontal: 8,
    color: Colors.charcoalGreyMediocre,
    ...boldText,
  },
});

export default UserSignupScreen;
