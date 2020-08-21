import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import database from '@react-native-firebase/database';
import React, {useState, useEffect} from 'react';
import ThemeButton from '../components/ThemeButton';
import ThemeTextInput from '../components/ThemeTextInput';
import {boldText, heading2, subHeading} from '../constants/MasterStyles';
import Colors from '../constants/Colors';
import * as Dimensions from '../constants/Dimensions';
// @ts-ignore
import AppLogo from '../assets/app-icon.svg';
import {ScreenNames} from '../constants/ScreenNames';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {db} from '../firebase.config';
import {EUserRole} from '../constants/Enums';
import {useDispatch, useSelector} from 'react-redux';
import {setRole, signOut} from '../react-redux/actions';
import auth from '@react-native-firebase/auth';
export const shopCodeLength = 9;

const ShopCodeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [value, onChangeText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loader, setLoader] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [password, setPassword] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  let attempts = 0;
  const phoneNumber = useSelector(state => state.phoneNumber);
  console.log('::::::::::::::ShopCodeScreen:::::::::::::::::');
  const SignOut = () => {
    dispatch(signOut());
    AsyncStorage.removeItem('role').then(() => {
      AsyncStorage.removeItem('sid').then(() => {
        auth()
          .signOut()
          .then(() => {
            navigation.navigate(ScreenNames.LoadingStack);
          });
      });
    });
    return null;
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onEnterCode = () => {
    if (!value) {
      alert('Please Enter the ShopCode');
    } else {
      if (attempts > 2) {
        alert(
          'You have reached maximum wrong attempts, try again after some time',
        );
      }
      //setLoader(true);
      database().ref('/shops')
        .child(value.toUpperCase())
        .once('value', snap => {
          const shop = snap.val();
          if (!shop) {
            setInvalidCode(true);
            setLoader(false);
          } else {
            setInvalidCode(false);
            if (isAdmin) {
              database().ref('/Users')
                .child(phoneNumber)
                .child('shops')
                .once('value', shopSnap => {
                  const shops = shopSnap.val();
                  if (shops) {
                    if (shops[value.toUpperCase()] === password) {
                      AsyncStorage.setItem('sid', value.toUpperCase()).then(
                        () => {
                          dispatch(setRole(EUserRole.ADMIN));
                          AsyncStorage.setItem('role', EUserRole.ADMIN);
                          setLoader(false);
                          navigation.navigate(ScreenNames.LoadingStack);
                        },
                      );
                    } else {
                      attempts++;
                      setWrongPass(true);
                      setLoader(false);
                    }
                  } else {
                    setLoader(false);
                    setInvalidCode(true);
                  }
                });
            } else {
              AsyncStorage.setItem('sid', value.toUpperCase()).then(() => {
                dispatch(setRole(EUserRole.USER));
                AsyncStorage.setItem('role', EUserRole.USER).then(() => {
                  setLoader(false);
                  navigation.navigate(ScreenNames.LoadingStack);
                });
              });
            }
          }
        });
    }
  };

  return (
    <>
      {/*// @ts-ignore*/}
      <ProgressDialog
        visible={loader}
        message="Setting Up the Shop for you..."
      />
      <View style={styles.container}>
        <View style={styles.appLogo}>
          <AppLogo height={'100%'} width={'100%'} fill={Colors.accentColor} />
        </View>
        <Text style={styles.text}>Enter The Shop Code</Text>
        <View style={styles.messageContainer}>
          <Text
            style={
              invalidCode || wrongPass ? styles.errorText : styles.errorHidden
            }>
            {invalidCode
              ? 'Code you entered is invalid, try again'
              : 'Check your code and try again'}
          </Text>
        </View>
        <View style={styles.input}>
          <ThemeTextInput
            onChangeText={code => onChangeText(code)}
            placeholder={'myShopXyz'}
            value={value}
          />
          {isAdmin && (
            <ThemeTextInput
              onChangeText={p => setPassword(p)}
              placeholder={'Seller code'}
              // @ts-ignore
              value={password}
            />
          )}
          <View style={styles.button}>
            <ThemeButton title="continue" onPress={onEnterCode} textUpperCase />
          </View>
        </View>
        <TouchableOpacity
          style={styles.adminButtonText}
          onPress={() => setIsAdmin(!isAdmin)}>
          <Text style={styles.subTitle}>
            {isAdmin ? 'Not a seller' : "I'm a seller"}
          </Text>
        </TouchableOpacity>
        {isKeyboardVisible === false ? (
          <View style={styles.bottom}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ScreenNames.SellerSignupScreen)
              }>
              <Text style={styles.sellText}>Start Selling</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={SignOut}>
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: '30%',
    backgroundColor: Colors.white,
  },
  appLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.SplashScreenDimensions.logoHeight,
    width: Dimensions.SplashScreenDimensions.logoWidth,
    resizeMode: 'stretch',
    margin: 20,
  },
  text: {
    fontSize: 30,
    ...heading2,
    color: Colors.black,
    padding: 20,
  },
  input: {
    minWidth: 145,
  },
  button: {
    marginVertical: 10,
    maxHeight: 60,
  },
  // @ts-ignore
  adminButtonText: {
    ...boldText,
    fontSize: 20,
    color: Colors.primaryColor,
  },
  // @ts-ignore
  subTitle: {
    ...subHeading,
    color: Colors.primaryColor,
  },
  messageContainer: {
    textAlign: 'center',
  },
  errorText: {
    color: Colors.red,
    fontSize: 15,
  },
  errorHidden: {
    color: Colors.white,
    fontSize: 15,
  },
  bottom: {
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    start: 0,
    width: '100%',
  },
  sellText: {
    ...subHeading,
    ...boldText,
    width: '100%',
    textAlign: 'center',
    color: Colors.primaryColorDark,
  },
  signOutText: {
    ...subHeading,
    ...boldText,
    width: '100%',
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    color: Colors.red,
  },
});

export default ShopCodeScreen;
