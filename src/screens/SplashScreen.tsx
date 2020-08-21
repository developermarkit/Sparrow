import * as Strings from '../constants/Strings';
import * as Dimensions from '../constants/Dimensions';
import React from 'react';
import database from '@react-native-firebase/database';
import {AsyncStorage, StyleSheet, Text, View, Platform} from 'react-native';
import Colors from '../constants/Colors';
import * as MasterStyles from '../constants/MasterStyles';
// @ts-ignore
import AppLogo from '../assets/app-icon.svg';
import {db} from '../firebase.config';
import {IUser} from '../interfaces/User.Interface';
import {ScreenNames} from '../constants/ScreenNames';
import {IShop} from '../interfaces/Shop.Interface';
import {useDispatch} from 'react-redux';
import {
  setPhone,
  setRole,
  setShopDetails,
  setSid,
  setUserDetails,
} from '../react-redux/actions';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({navigation}) => {
  //navigation.navigate(ScreenNames.LogInStack);
  const dispatch = useDispatch();
  console.log('::::::::::::::SplashScreen:::::::::::::::::');
  const checkShopData = async sid => {
    const shopRef = database().ref(`/shops/${sid}`);
    shopRef.once('value').then(async snapshot => {
      const Shop: IShop = {
        sid: sid,
        deliveryType: await snapshot.child('deliveryType').val(),
        image: await snapshot.child('image').val(),
        name: await snapshot.child('name').val(),
        modeOfPayment: await snapshot.child('modeOfPayment').val(),
        phone: await snapshot.child('phone').val(),
        rating: await snapshot.child('rating').val(),
        status: await snapshot.child('status').val(),
        showcase: await snapshot.child('showcase').val(),
        address: await snapshot.child('address').val(),
        ownerName: await snapshot.child('ownerName').val(),
        firmName: await snapshot.child('firmName').val(),
        email: await snapshot.child('email').val(),
        bankName: await snapshot.child('bankName').val(),
        IFSC: await snapshot.child('IFSC').val(),
        upi: await snapshot.child('upi').val(),
        shopCategory: await snapshot.child('shopCategory').val(),
        agentID: await snapshot.child('agentID').val(),
        agentScore: await snapshot.child('agentScore').val(),
        commissionPercent: await snapshot.child('commissionPercent').val(),
        ownerPhone: await snapshot.child('ownerPhone').val(),
        isSingleCategoryShop: await snapshot
          .child('isSingleCategoryShop')
          .val(),
      };
      console.log(Shop);
      dispatch(setShopDetails(Shop));
    });
  };
  const checkUserData = async () => {
    // todo change this later
    const phoneNumber =
      Platform.OS !== 'ios' ? auth().currentUser.phoneNumber : '+919891192474';
    console.log(phoneNumber);
    dispatch(setPhone(phoneNumber));
    const ref = database().ref(`/Users/${phoneNumber}`);
    ref.once('value').then(async snapshot => {
      const User: Partial<IUser> = {
        name: await snapshot.child('name').val(),
        address: await snapshot.child('address').val(),
        imageUrl: await snapshot.child('imageUrl').val(),
        city: await snapshot.child('city').val(),
        pin: await snapshot.child('pin').val(),
        role: await snapshot.child('role').val(),
      };
      dispatch(setUserDetails(User));
      AsyncStorage.getItem('role').then(role => {
        dispatch(setRole(role));
      });
      console.log('User Details', User);
      if (snapshot && User.name && User.address) {
        const sid = await AsyncStorage.getItem('sid');
        dispatch(setSid(sid));
        await checkShopData(sid);
        if (sid) {
          console.log('goToHomeStack');
          //todo
          await navigation.navigate(ScreenNames.HomeScreen);
        } else {
          await navigation.navigate(ScreenNames.ShopStack);
        }
      } else {
        navigation.navigate(ScreenNames.UserSignupScreen);
      }
    });
  };

  const checkUser = () => {
    console.log(auth().currentUser);
    // todo change this later
    if (Platform.OS === 'ios' || auth().currentUser) {
      checkUserData();
    } else {
      navigation.navigate(ScreenNames.LogInStack);
    }
  };

  React.useEffect(() => {
    checkUser();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unsubscribe = navigation.addListener('focus', () => {
      checkUser();
    });
  }, [navigation]);

  return (
    // <View style={styles.container}>
    //   <View style={styles.appLogo}>
    //     <AppLogo height={'100%'} width={'100%'} fill={Colors.accentColor} />
    //   </View>
    //   <Text style={styles.title}>{Strings.AppStrings.AppName}</Text>
    //   {/*// @ts-ignore*/}
    //   <Text style={styles.subTitle}>{Strings.AppStrings.SubTitle}</Text>
    // </View>
    <View>
      <Text>This is SplashScreen</Text>
      </View>
  );
};

export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100%',
//   },
//   appLogo: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: Dimensions.SplashScreenDimensions.logoHeight,
//     width: Dimensions.SplashScreenDimensions.logoWidth,
//     resizeMode: 'stretch',
//     margin: 20,
//   },
//   title: {
//     ...MasterStyles.heading1,
//     justifyContent: 'center',
//     color: Colors.primaryColorDark,
//   },
//   subTitle: {
//     ...MasterStyles.subHeading,
//     ...MasterStyles.italicsText,
//     justifyContent: 'center',
//     color: Colors.primaryColor,
//   },
// });
