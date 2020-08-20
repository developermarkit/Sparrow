import SplashScreen from '../screens/SplashScreen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const screens = {
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: () => ({
      headerShown: false,
    }),
  },
};

const stackNavigation = createStackNavigator(screens);

export default createAppContainer(stackNavigation);
