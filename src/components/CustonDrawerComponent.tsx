import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useSelector, useDispatch} from 'react-redux';
import Colors from '../constants/Colors';
import {ScreenNames} from '../constants/ScreenNames';
import {EUserRole} from '../constants/Enums';
import ExtendedLine from './ExtendedLine';
import ConfirmDialog from '../utils/ConfirmDialog';
import auth from '@react-native-firebase/auth';
import {signOut} from '../react-redux/actions';
import toast from './toast';
// @ts-ignore
import ShopIcon from '../assets/shop.svg';
// @ts-ignore
import UserIcon from '../assets/male.svg';
// @ts-ignore
import ProductIcon from '../assets/product.svg';
// @ts-ignore
import StatsIcon from '../assets/stats.svg';
// @ts-ignore
import OrderIcon from '../assets/order.svg';
// @ts-ignore
import CartIcon from '../assets/cart-outline.svg';
// @ts-ignore
import SettingsIcon from '../assets/settings.svg';
// @ts-ignore
import SignOutIcon from '../assets/sign-out.svg';
// @ts-ignore
import SwitchIcon from '../assets/switch.svg';

const CustomDrawerContent = ({props, navigation, rootNavigation}) => {
  const User = useSelector(state => state.userDetails);
  const Shop = useSelector(state => state.shopDetails);
  const role = useSelector(state => state.role);
  const dispatch = useDispatch();

  const SwitchShop = () => {
    ConfirmDialog(
      'Switch Shop',
      'Sure to exit this shop? your orders will be safe for next time',
      () => {
        AsyncStorage.removeItem('sid').then(() => {
          rootNavigation.navigate(ScreenNames.ShopStack);
        });
      },
      () => {
        console.log('switch cancelled');
        navigation.goBack();
      },
    );
    return null;
  };

  const SignOut = () => {
    ConfirmDialog(
      'Sign Out',
      'Sure to Sign Out',
      () => {
        AsyncStorage.removeItem('role').then(() => {
          AsyncStorage.removeItem('sid').then(() => {
            // todo change this later
            if (Platform.OS !== 'ios') {
              auth()
                .signOut()
                .then(() => {
                  dispatch(signOut());
                  toast('signOut success');
                  console.log('signOut success');
                  rootNavigation.navigate(ScreenNames.LogInStack);
                });
            } else {
              dispatch(signOut());
              toast('signOut success');
              console.log('signOut success');
              rootNavigation.navigate(ScreenNames.LogInStack);
            }
          });
        });
      },
      () => {
        console.log('signout cancelled');
        navigation.goBack();
      },
    );
    // };
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <View style={styles.childContainer}>
          <View style={styles.icon}>
            <UserIcon height={20} width={20} fill={Colors.primaryColorDark} />
          </View>

          <Image
            style={styles.image}
            source={{
              uri: User.imageUrl
                ? User.imageUrl
                : 'https://img.icons8.com/bubbles/50/000000/edit-user.png',
            }}
          />
          <Text numberOfLines={1} style={styles.name}>
            {User.name}
          </Text>
        </View>
        <View style={styles.childContainer}>
          <View style={styles.icon}>
            <ShopIcon height={20} width={20} fill={Colors.primaryColorDark} />
          </View>

          <Image
            style={styles.image}
            source={{
              uri: Shop.image
                ? Shop.image
                : 'https://img.icons8.com/clouds/100/000000/shop.png',
            }}
          />
          <Text numberOfLines={1} style={styles.name}>
            {Shop.name}
          </Text>
        </View>
      </View>
      <ExtendedLine />
      {/*<DrawerItemList {...props} />*/}
      <DrawerItem
        label={'Products'}
        labelStyle={styles.drawerItemText}
        onPress={() =>
          navigation.navigate(ScreenNames.ShoppingScreen, {
            screen: ScreenNames.CategoryScreen,
          })
        }
        icon={({color, size}) => (
          <ProductIcon height={size} width={size} fill={color} />
        )}
      />
      {role === EUserRole.USER && !Shop.showcase && (
        <DrawerItem
          label={'My Cart'}
          labelStyle={styles.drawerItemText}
          onPress={() =>
            navigation.navigate(ScreenNames.CartStack, {
              screen: ScreenNames.CartScreen,
            })
          }
          icon={({color, size}) => (
            <CartIcon height={size} width={size} fill={color} />
          )}
        />
      )}
      {role !== EUserRole.USER && !Shop.showcase && (
        <DrawerItem
          label={'Shop Stats'}
          labelStyle={styles.drawerItemText}
          onPress={() => navigation.navigate(ScreenNames.ShopStatsScreen)}
          icon={({color, size}) => (
            <StatsIcon height={size} width={size} fill={color} />
          )}
        />
      )}
      {!Shop.showcase && (
        <DrawerItem
          label={'Orders'}
          labelStyle={styles.drawerItemText}
          onPress={() => navigation.navigate(ScreenNames.OrdersScreen)}
          icon={({color, size}) => (
            <OrderIcon height={size} width={size} fill={Colors.black} />
          )}
        />
      )}
      <DrawerItem
        label={'Settings'}
        labelStyle={styles.drawerItemText}
        onPress={() => navigation.navigate(ScreenNames.SettingsScreen)}
        icon={({color, size}) => (
          <SettingsIcon height={size} width={size} fill={color} />
        )}
      />
      <ExtendedLine />
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionItemContainer} onPress={SignOut}>
          <View style={styles.imageContainer}>
            <SignOutIcon
              height={25}
              width={25}
              fill={Colors.primaryColorDark}
            />
          </View>
          <Text style={styles.drawerItemText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItemContainer}
          onPress={SwitchShop}>
          <View style={styles.imageContainer}>
            <SwitchIcon height={25} width={25} fill={Colors.primaryColorDark} />
          </View>
          <Text style={styles.drawerItemText}>Switch Shop</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};
export default CustomDrawerContent;

const imageRadius = 70;
const iconRadius = 20;
const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 30,
    flexDirection: 'row',
  },
  drawerItemText: {
    color: Colors.payneGrey,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
  icon: {
    color: Colors.primaryColor,
    height: iconRadius,
    width: iconRadius,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.cloudyWhite70,
    marginBottom: 5,
  },
  image: {
    height: imageRadius,
    width: imageRadius,
    alignSelf: 'center',
    borderRadius: imageRadius,
    overflow: 'hidden',
    backgroundColor: Colors.cloudyWhite70,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
  },
  name: {
    color: Colors.primaryColorDark,
    alignSelf: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionContainer: {
    display: 'flex',
    marginTop: 10,
    flexDirection: 'column',
    margin: 10,
    justifyContent: 'flex-end',
  },
  actionItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    paddingLeft: 10,
    paddingRight: 30,
  },
});
