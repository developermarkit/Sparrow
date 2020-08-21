import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import CountDown from 'react-native-countdown-component';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import ThemeButton from '../components/ThemeButton';
import {boldText, heading2} from '../constants/MasterStyles';
import ExtendedLine from '../components/ExtendedLine';
import Colors from '../constants/Colors';
import {db} from '../firebase.config';
import {IUser} from '../interfaces/User.Interface';
import {ScreenNames} from '../constants/ScreenNames';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {setPhone, setUserDetails} from '../react-redux/actions';
import {useDispatch} from 'react-redux';
import toast from '../components/toast';
import ThemeNumberInput from '../components/ThemeNumberInput';

const UserLoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [value, onChangeText] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneNumberValidity, setPhoneNumberValidity] = useState(true);
  const [otpValidity, setOtpValidity] = useState(true);
  const [numberEntered, setNumberEntered] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [resendOTP, setResendOTP] = useState(false);
  console.log('::::::::::::::UserLoginScreen:::::::::::::::::');

  // const getPhone = async () => {
  //   const ph = Platform.OS !== 'ios' ? auth().currentUser.phoneNumber : null;
  //   if (ph) {
  //     //onChangeText(ph.replace('+91', ''));
  //   }
  // };

  const checkUserData = async () => {
    let phoneNumber =
      Platform.OS !== 'ios' ? auth().currentUser.phoneNumber : `+91${value}`;
    // todo remove this later

    const ref = database().ref(`/Users/${phoneNumber}`);
    ref.once('value').then(snapshot => {
      const User: Partial<IUser> = {
        name: snapshot.child('name').val(),
        address: snapshot.child('address').val(),
        imageUrl: snapshot.child('imageUrl').val(),
        city: snapshot.child('city').val(),
        pin: snapshot.child('pin').val(),
        role: snapshot.child('role').val(),
      };
      if (snapshot.child('shops')) {
        User.shops = snapshot.child('shops').val();
      }
      dispatch(setUserDetails(User));
      dispatch(setPhone(`+91${value}`));
      console.log(User);
      if (snapshot && User.name && User.address) {
        //navigation.navigate(ScreenNames.HomeStack);
        navigation.navigate(ScreenNames.ShopCodeScreen);
      } else {
        navigation.navigate(ScreenNames.UserSignupScreen, {User});
      }
    });
    setLoader(false);
  };

  // useEffect(() => {
  //   getPhone();
  // }, []);

  const reset = () => {
    setOtp('');
    setPhoneNumberValidity(true);
    setOtpValidity(true);
    setNumberEntered(false);
    setLoggedIn(false);
    setLoader(false);
  };

  const onContinue = async () => {
    setPhoneNumberValidity(value.length === 10);
    if (value.length === 10) {
      setLoader(true);
      setResendOTP(false);
      await login(`+91${value}`);
    }
  };

  // async function signInWithPhoneNumber(phoneNumber) {
  //   const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  //   setConfirm(confirmation);
  // }

  const login = async phone => {
    try {
      console.log(phone);
      // todo change this later
      const confirmation =
        Platform.OS !== 'ios'
          ? await auth().signInWithPhoneNumber(phone)
          : null;
      setConfirm(confirmation);
      setNumberEntered(true);
      setLoader(false);
      console.log(confirmation);
    } catch (e) {
      console.log('?????', e);
      setLoader(false);
      alert(e);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onAuthStateChanged(user) {
    if (user) {
      setLoader(false);
      checkUserData().then(() => {
        setLoggedIn(true);
        console.log('loggedIn success');
      });
    }
  }
  const startCountDown = () => {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Resend OTP in </Text>
        <CountDown
          until={59}
          size={15}
          onFinish={() => setResendOTP(true)}
          digitStyle={{backgroundColor: Colors.white, margin: -6}}
          digitTxtStyle={{color: Colors.primaryColor}}
          timeToShow={['S']}
          timeLabels={{m: '', s: ''}}
        />
        <Text style={styles.text}>seconds </Text>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [onAuthStateChanged]);

  const onLogin = async () => {
    if (Platform.OS === 'ios') {
      setLoader(false);
      checkUserData().then(() => {
        setLoggedIn(true);
        console.log('loggedIn success');
      });
    } else {
      setLoader(true);
      try {
        await confirm
          .confirm(otp)
          .then(() => {
            setLoader(false);
            checkUserData().then(() => {
              setLoggedIn(true);
              console.log('loggedIn success');
              toast('LogIn successful');
            });
          })
          .catch(error => {
            console.log(error);
            setLoader(false);
            setOtpValidity(false);
          });
      } catch (error) {
        console.log(error);
        setLoader(false);
      }
    }
  };
  return !loggedIn ? (
    <>
      {/*// @ts-ignore*/}
      <ProgressDialog visible={loader} message="Please, wait..." />
      <View style={styles.container}>
        {/*// @ts-ignore*/}
        <Text style={styles.title}>Login</Text>
        <ExtendedLine />
        <View style={styles.vertical}>
          {!numberEntered ? (
            <View>
              <Text style={styles.text}>Enter your phone number:</Text>
              <View style={styles.center}>
                <Text style={styles.countryCode}>+91</Text>
                <View style={styles.phoneInputContainer}>
                  <ThemeNumberInput
                    value={value}
                    onChangeText={t => onChangeText(t)}
                    placeholder={'9876543210'}
                    keyboard={'number-pad'}
                    maxLength={10}
                  />
                </View>
              </View>
              <Text
                style={
                  phoneNumberValidity
                    ? styles.errorTextHidden
                    : styles.errorTextVisible
                }>
                The Phone Number you entered is Invalid
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.text}>
                Enter the One Time Password sent to +91 {value}
              </Text>
              <View style={styles.center}>
                <View style={styles.otpTextContainer}>
                  <ThemeNumberInput
                    value={otp}
                    onChangeText={t => setOtp(t)}
                    placeholder={'123456'}
                    keyboard={'number-pad'}
                    maxLength={6}
                  />
                </View>
              </View>
              <Text
                style={
                  otpValidity ? styles.errorTextHidden : styles.errorTextVisible
                }>
                Please check the OTP and try again
              </Text>
            </View>
          )}
          <ThemeButton
            title={numberEntered ? 'Log In' : 'Continue'}
            onPress={numberEntered ? onLogin : onContinue}
          />
          {numberEntered && (
            <View style={styles.vertical}>
              <TouchableOpacity style={styles.center} onPress={reset}>
                <Text style={styles.changeText}>Change Number</Text>
              </TouchableOpacity>
              {!resendOTP && startCountDown()}
              {resendOTP ? (
                <TouchableOpacity style={styles.center} onPress={onContinue}>
                  <Text style={styles.changeText}>Resend OTP</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </>
  ) : null;
};

const styles = StyleSheet.create({
  otpTextContainer: {
    minWidth: '27%',
    padding: 5,
  },
  vertical: {
    padding: 10,
    textAlign: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    padding: 5,
    backgroundColor: Colors.white,
  },
  title: {
    ...boldText,
    ...heading2,
    marginVertical: 8,
    textAlign: 'center',
  },
  text: {
    paddingVertical: 5,
    marginRight: -5,
  },
  countryCode: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 17,
    paddingTop: 14,
    paddingRight: 5,
  },
  phoneInputContainer: {
    minWidth: '40%',
    textAlign: 'center',
  },
  otpInput: {
    fontSize: 20,
    borderBottomWidth: 2,
    borderColor: Colors.accentColor,
    padding: 2,
    margin: 5,
    minWidth: 80,
    textAlign: 'center',
  },
  errorTextVisible: {
    color: Colors.red,
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
  },
  errorTextHidden: {
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
  },
  changeText: {
    color: Colors.primaryColorDark,
    fontSize: 15,
    padding: 10,
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default UserLoginScreen;
