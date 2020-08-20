import {StyleSheet, Text, View} from 'react-native';
import Colors from '../constants/Colors';
import * as Strings from '../constants/Strings';
import React from 'react';
import * as Dimensions from '../constants/Dimensions';
import * as MasterStyles from '../constants/MasterStyles';
import Layout from '../constants/Layout';
import {TouchableOpacity} from 'react-native-gesture-handler';
// @ts-ignore
import AppLogo from '../assets/app-icon.svg';

const LoginScreen = ({navigation}) => {
  console.log('::::::::::::::LoginStack:::::::::::::::::');
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.appLogo}>
          <AppLogo height={'100%'} width={'100%'} fill={Colors.accentColor} />
        </View>
        <Text style={styles.title}>{Strings.AppStrings.AppName}</Text>
        {/*// @ts-ignore*/}
        <Text style={styles.subTitle}>{Strings.AppStrings.SubTitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('UserLoginScreen')}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
    paddingVertical: Layout.window.height / 5,
  },
  appLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.SplashScreenDimensions.logoHeight,
    width: Dimensions.SplashScreenDimensions.logoWidth,
    resizeMode: 'stretch',
  },
  title: {
    ...MasterStyles.heading1,
    justifyContent: 'center',
    color: Colors.primaryColorDark,
  },
  subTitle: {
    ...MasterStyles.subHeading,
    ...MasterStyles.italicsText,
    justifyContent: 'center',
    color: Colors.primaryColor,
  },
  loginButton: {
    borderRadius: 5,
    marginHorizontal: 40,
    padding: 15,
    alignItems: 'center',
    backgroundColor: Colors.primaryColorDark,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
  },
});
