import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {body, boldText, heading2} from '../constants/MasterStyles';
import ExtendedLine from '../components/ExtendedLine';
import React, {useEffect, useState} from 'react';
import CartItem from '../components/CartItem';
import {db} from '../firebase.config';
import {ICart} from '../interfaces/Cart.interface';
import ThemeButton from '../components/ThemeButton';
import {IProduct} from '../interfaces/Product.interface';
import {ScreenNames} from '../constants/ScreenNames';
import {IOrder} from '../interfaces/Order.interface';
import {EModeOfPayment} from '../constants/Enums';
import {IOrderItem} from '../interfaces/OrderItem.Interface';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {useSelector} from 'react-redux';
import Header from '../components/Header';
import {NavigationEvents} from 'react-navigation';

const CartScreen = ({navigation}) => {
  let cart: ICart[] = [];
  const [cartItems, setCartItems] = useState(cart);
  const sid = useSelector(state => state.sid);
  const phone = useSelector(state => state.phoneNumber);
  const user = useSelector(state => state.userDetails);
  const role = useSelector(state => state.role);
  const [loader, setLoader] = useState(true);
  let [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      loadItems(sid, phone);
    });
  }, [navigation, phone, sid]);

  const refreshCart = () => {
    setLoader(true);
    loadItems(sid, phone).then(() => {
      setLoader(false);
    });
  };

  const loadItems = async (id?: string, phone?: string) => {
    const cartRef = db
      .ref('/cart')
      .child(phone)
      .child(id);
    const productRef = db.ref('/products');

    await cartRef.once('value', async snapshot => {
      const items = snapshot.val();

      cart = [];
      let total = 0;

      if (items) {
        const pids = Object.keys(items);
        for (let pid of pids) {
          let product: Partial<IProduct> = {};
          await productRef.child(pid).once('value', async snap => {
            product = await snap.val();
          });
          console.log('>>>', pids);
          if (product && items[pid].quantity > 0) {
            total += product.price * items[pid].quantity;
            setCartTotal(cartTotal);
            const item: ICart = {
              pid,
              quantity: items[pid].quantity,
              product,
            };
            cart.push(item);
          }
        }
      }
      const cartTotalformatted = `${total}`
        .replace(/\D/g, '')
        .replace(/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, '$1,');
      setCartItems(cart);
      // @ts-ignore
      setCartTotal(cartTotalformatted);
      setLoader(false);
    });
  };

  const goToCategoryPage = () => {
    navigation.navigate(ScreenNames.ShoppingScreen);
  };

  const onCheckout = async () => {
    const order: Partial<IOrder> = {};
    if (!user) {
      alert('an error occured');
    }
    console.log(user);
    order.name = user.name;
    order.modeOfPayment = EModeOfPayment.CASH;
    order.userPhone = phone;
    order.phone = phone;
    order.shippingAddress = `${user.address},\n${user.city}-${user.pin}`;
    order.address = {address: user.address, city: user.city, pin: user.pin};
    order.sid = sid;
    order.orderItems = [];
    console.log('', order);
    let total = 0;
    let orderItems: IOrderItem[] = [];
    for (const cartItem of cartItems) {
      const orderItem: IOrderItem = {
        pid: cartItem.pid,
        name: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
      };
      total += orderItem.price * orderItem.quantity;
      orderItems.push(orderItem);
    }
    order.orderItems = orderItems;
    order.totalPrice = total;
    //await navigation.reset(ScreenNames.CartStack);
    await navigation.navigate(ScreenNames.CartStack, {
      screen: ScreenNames.CheckoutScreen,
      params: {order},
    });
  };

  // @ts-ignore
  return (
    <>
      {/*// @ts-ignore*/}
      <NavigationEvents onFocus={loadItems} />
      <View style={styles.allCategoryView}>
        {/*// @ts-ignore*/}
        <ProgressDialog visible={loader} message="Please, wait..." />
        {/*<ScrollView*/}
        {/*  contentContainerStyle="center"*/}
        {/*  style={styles.allCategoryView}>*/}
        <Header
          navigation={navigation}
          title={'Cart'}
          role={role}
          key={cartItems.length}
        />
        <ExtendedLine />
        {cartItems.length > 0 ? (
          <View style={styles.childContainer}>
            <View>
              <FlatList
                data={cartItems}
                renderItem={({item}) => (
                  <CartItem
                    cartItem={item}
                    navigation={navigation}
                    phone={phone}
                    sid={sid}
                    refreshCart={refreshCart}
                  />
                )}
                scrollEnabled
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View>
              <View style={styles.cartTotalContainer}>
                <Text style={styles.sectionHeader}>Cart Total: </Text>
                <Text style={styles.sectionHeader}>₹{cartTotal}</Text>
              </View>
              <ThemeButton onPress={onCheckout} title={'Checkout'} />
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.emptyCart} onPress={goToCategoryPage}>
            <Text style={styles.goText}>Your cart is Empty</Text>
            {/*// @ts-ignore*/}
            <Text style={styles.goText2}>Start Shopping</Text>
          </TouchableOpacity>
        )}
        {/*</ScrollView>*/}
      </View>
    </>
  );
};
export default CartScreen;

const styles = StyleSheet.create({
  childContainer: {
    padding: 5,
  },
  cartTotalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  eventsView: {
    backgroundColor: Colors.featuredEventsColor,
    ...body,
  },
  allCategoryView: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  sectionHeader: {
    fontFamily: 'Nunito-Bold',
    marginVertical: 12,
    textAlign: 'center',
    fontSize: 20,
  },
  groupTextStyles: {
    ...body,
  },
  emptyCart: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goText: {
    color: Colors.charcoalGrey,
    fontSize: 25,
  },
  goText2: {
    ...boldText,
    padding: 10,
    backgroundColor: Colors.white,
    color: Colors.primaryColorDark,
  },
});
