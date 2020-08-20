// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect} from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AsyncStorage, Text, Platform} from 'react-native';
import CategoryScreen from './CategoryScreen';
import OrdersScreen from './OrdersScreen';
import SettingsScreen from './SettingsScreen';
import CartScreen from './CartScreen';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {createStackNavigator} from '@react-navigation/stack';
import ProductScreen from './ProductScreen';
import ProductDescriptionScreen from './ProductDescriptionScreen';
import CheckoutScreen from './CheckoutScreen';
import SellerStats from './SellerStats';
import CreateCategoryScreen from './CreateCategoryScreen';
import CreateProductScreen from './CreateProductScreen';
import {ScreenNames} from '../constants/ScreenNames';
import {useSelector} from 'react-redux';
import CustomDrawerContent from '../components/CustonDrawerComponent';
import Colors from '../constants/Colors';
const Drawer = createDrawerNavigator();

export default function HomeScreen({navigation}) {
  const Shop = useSelector(state => state.shopDetails);
  const user = useSelector(state => state.userDetails);
  console.log('::::::::::::::HomeStack:::::::::::::::::');
  console.log(user);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ShoppingScreen = ({navigation}) => {
    const ShopStack = createStackNavigator();
    return (
      <ShopStack.Navigator
        screenOptions={{
          title: ScreenNames.AppTitle,
          headerStyle: {
            backgroundColor: Colors.primaryColor,
          },
          headerShown: Platform.OS === 'ios',
          headerTintColor: Colors.white,
        }}>
        <ShopStack.Screen
          name={ScreenNames.CategoryScreen}
          component={CategoryScreen}
        />
        <ShopStack.Screen
          name={ScreenNames.CreateCategoryScreen}
          component={CreateCategoryScreen}
        />
        <ShopStack.Screen
          name={ScreenNames.ProductScreen}
          component={ProductScreen}
        />
        <ShopStack.Screen
          name={ScreenNames.CreateProductScreen}
          component={CreateProductScreen}
        />
        <ShopStack.Screen
          name={ScreenNames.ProductDescription}
          component={ProductDescriptionScreen}
        />
      </ShopStack.Navigator>
    );
  };

  const PlaceOrder = () => {
    const Order = createStackNavigator();
    return (
      <Order.Navigator
        screenOptions={{
          title: ScreenNames.AppTitle,
          headerStyle: {
            backgroundColor: Colors.primaryColor,
          },
          headerShown: Platform.OS === 'ios',
          headerTintColor: Colors.white,
        }}>
        <Order.Screen name={ScreenNames.CartScreen} component={CartScreen} />
        <Order.Screen
          name={ScreenNames.CheckoutScreen}
          component={CheckoutScreen}
        />
        <Order.Screen name={ScreenNames.OrdersScreen} component={OrderStack} />
      </Order.Navigator>
    );
  };

  const SettingsStack = () => {
    const Order = createStackNavigator();
    return (
      <Order.Navigator
        screenOptions={{
          title: ScreenNames.AppTitle,
          headerShown: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: Colors.primaryColor,
          },
          headerTintColor: Colors.white,
        }}>
        <Order.Screen
          name={ScreenNames.SettingsScreen}
          component={SettingsScreen}
        />
      </Order.Navigator>
    );
  };

  const OrderStack = () => {
    const Order = createStackNavigator();
    return (
      <Order.Navigator
        screenOptions={{
          title: ScreenNames.AppTitle,
          headerShown: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: Colors.primaryColor,
          },
          headerTintColor: Colors.white,
          headerLeft: null,
        }}>
        <Order.Screen
          name={ScreenNames.OrdersScreen}
          component={OrdersScreen}
        />
      </Order.Navigator>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={props => (
        // @ts-ignore
        <CustomDrawerContent {...props} rootNavigation={navigation} />
      )}
      initialRouteName={ScreenNames.ShoppingScreen}>
      <Drawer.Screen
        name={ScreenNames.ShoppingScreen}
        component={ShoppingScreen}
      />
      {!Shop.showcase && (
        <Drawer.Screen name={ScreenNames.CartStack} component={PlaceOrder} />
      )}

      {!Shop.showcase && (
        <Drawer.Screen name={ScreenNames.OrdersScreen} component={OrderStack} />
      )}
      <Drawer.Screen
        name={ScreenNames.SettingsScreen}
        component={SettingsStack}
      />
      {/*<Drawer.Screen name={ScreenNames.SwitchShop} component={SwitchShop} />*/}
      {/*<Drawer.Screen name={ScreenNames.SignOut} component={SignOut} />*/}
      <Drawer.Screen
        name={ScreenNames.ShopStatsScreen}
        component={SellerStats}
      />
    </Drawer.Navigator>
  );
}
