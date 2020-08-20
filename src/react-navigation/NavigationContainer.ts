import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import LoadingNavigationStack from './LoadingStackNavigator';
import LoginStackNavigator from './LoginStackNavigator';
import ShopStackNavigator from './ShopStackNavigator';
import HomeScreen from '../screens/HomeScreen';

const NavigatorStacks = {
  loading: LoadingNavigationStack,
  LogIn: LoginStackNavigator,
  Shop: ShopStackNavigator,
  Home: HomeScreen,
};

const App = createSwitchNavigator(
  {
    LoadingStack: NavigatorStacks.loading,
    LogInStack: NavigatorStacks.LogIn,
    ShopStack: NavigatorStacks.Shop,
    HomeScreen: NavigatorStacks.Home,
  },
  {
    initialRouteName: 'LoadingStack',
  },
);

export default createAppContainer(App);
