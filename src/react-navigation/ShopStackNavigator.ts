import ShopCodeScreen from '../screens/ShopCodeScreen';
import SellerSignupScreen from '../screens/SellerSignupScreen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Colors from '../constants/Colors';
import {ScreenNames} from '../constants/ScreenNames';
import {Platform} from 'react-native';
const screens = {
  ShopCodeScreen: {
    screen: ShopCodeScreen,
    navigationOptions: () => ({
      title: ScreenNames.AppTitle,
      headerStyle: {
        backgroundColor: Colors.primaryColor,
      },
      headerShown: Platform.OS === 'ios',
      headerTintColor: Colors.white,
    }),
  },
  SellerSignupScreen: {
    screen: SellerSignupScreen,
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
