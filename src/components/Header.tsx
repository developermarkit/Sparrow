import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import Colors from '../constants/Colors';
// @ts-ignore
import MenuIcon from '../assets/menu.svg';
// @ts-ignore
import CartIcon from '../assets/cart.svg';
// @ts-ignore
import OrderIcon from '../assets/order.svg';
// @ts-ignore
import AddIcon from '../assets/add.svg';
import {boldText} from '../constants/MasterStyles';
import {ScreenNames} from '../constants/ScreenNames';
import {EOrderStatus, EUserRole} from '../constants/Enums';
import {db} from '../firebase.config';
import {IOrder} from '../interfaces/Order.interface';
import {ICart} from '../interfaces/Cart.interface';
import {NavigationEvents} from 'react-navigation';
import database from '@react-native-firebase/database';

interface IHeader {
  title: string;
  navigation: any;
  role: string;
  key?: number;
  addFunction?: any;
}

const Header = (props: IHeader) => {
  const {title, navigation, role, addFunction} = props;
  const {phoneNumber, sid} = useSelector(state => state);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [orderItemCount, setOrderItemCount] = useState(0);

  const refreshHeader = () => {
    if (phoneNumber && sid) {
      getCartCount(phoneNumber, sid);
      orderCount(phoneNumber, sid);
    }
  };
  useEffect(() => {
    refreshHeader();
  }, [phoneNumber, props, sid]);

  const getCartCount = (phone, sid) => {
    let c = 0;
    if (phone && sid) {
      const cartRef = database()
        .ref('/cart')
        .child(phone)
        .child(sid);

      cartRef
        .once('value', snapshot => {
          if (snapshot && snapshot.val()) {
            const cartItems: ICart[] = Object.values(snapshot.val());
            for (const cartItem of cartItems) {
              c = c + cartItem.quantity;
            }
          }
        })
        .then(() => {
          setCartItemCount(c);
        });
    }
  };

  const orderCount = (phone, sid) => {
    let c = 0;
    if (phone && sid) {
      const orderRef = database().ref('/orders').child(sid);
      orderRef
        .once('value', snapshot => {
          if (snapshot && snapshot.val()) {
            const orderItems: IOrder[] = Object.values(snapshot.val());
            for (const orderItem of orderItems) {
              if (orderItem.orderSTATUS === EOrderStatus.PENDING) {
                c++;
              }
            }
          }
        })
        .then(() => {
          setOrderItemCount(c);
        });
    }
  };

  return (
    <>
      {/*// @ts-ignore*/}
      <NavigationEvents onFocus={refreshHeader} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.image} onPress={navigation.openDrawer}>
          <MenuIcon height={30} width={30} fill={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        <View style={{flexDirection: 'row'}}>
          {role !== EUserRole.USER && addFunction && (
            <TouchableOpacity style={styles.image} onPress={addFunction}>
              <AddIcon height={25} width={25} fill={Colors.white} />
            </TouchableOpacity>
          )}
          {role === EUserRole.USER ? (
            <TouchableOpacity
              style={styles.image}
              onPress={() => navigation.navigate(ScreenNames.CartStack)}>
              {cartItemCount > 0 ? (
                <View style={styles.redDot}>
                  <Text style={styles.count}>{cartItemCount}</Text>
                </View>
              ) : null}
              <CartIcon height={30} width={30} fill={Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.image}
              onPress={() => navigation.navigate(ScreenNames.OrdersScreen)}>
              {orderItemCount > 0 ? (
                <View style={styles.redDot}>
                  <Text style={styles.count}>{orderItemCount}</Text>
                </View>
              ) : null}
              <OrderIcon height={25} width={25} fill={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};
export default Header;
const radius: number = 20;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.primaryColorDark,
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    paddingVertical: 5,
    height: 50,
    alignItems: 'center',
  },
  // @ts-ignore
  title: {
    ...boldText,
    fontSize: 18,
    color: Colors.white,
    fontFamily: 'Nunito-Light',
  },
  image: {
    marginRight: 10,
    padding: 5,
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: radius,
    width: radius,
    borderRadius: radius,
    backgroundColor: Colors.red,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  count: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'Nunito-Bold',
  },
});
