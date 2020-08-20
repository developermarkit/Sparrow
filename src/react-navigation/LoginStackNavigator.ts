import LoginScreen from '../screens/LoginScreen';
import UserLoginScreen from '../screens/UserLoginScreen';
import UserSignupScreen from '../screens/UserSignupScreen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Colors from '../constants/Colors';
import {ScreenNames} from '../constants/ScreenNames';
import {Platform} from 'react-native';

const screens = {
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => ({
      title: ScreenNames.AppTitle,
      headerShown: false,
    }),
  },
  UserLoginScreen: {
    screen: UserLoginScreen,
    navigationOptions: () => ({
      title: ScreenNames.AppTitle,
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerShown: Platform.OS === 'ios',
      headerTintColor: Colors.white,
    }),
  },
  UserSignupScreen: {
    screen: UserSignupScreen,
    navigationOptions: () => ({
      title: ScreenNames.AppTitle,
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerShown: Platform.OS === 'ios',
      headerTintColor: Colors.white,
    }),
  },
};

const stackNavigation = createStackNavigator(screens);

export default createAppContainer(stackNavigation);
