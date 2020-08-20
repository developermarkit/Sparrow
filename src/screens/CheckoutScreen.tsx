import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import Colors from '../constants/Colors';
import {
  EModeOfPayment,
  EOrderStatus,
  EProductStatus,
  EUserRole,
} from '../constants/Enums';
import * as MasterStyles from '../constants/MasterStyles';
import ThemeTextInput from '../components/ThemeTextInput';
import {db} from '../firebase.config';
import ThemeButton from '../components/ThemeButton';
import ExtendedLine from '../components/ExtendedLine';
import {IOrder} from '../interfaces/Order.interface';
import {ScreenNames} from '../constants/ScreenNames';
import OrderItem from '../components/OrderItem';
import {heading2} from '../constants/MasterStyles';
import {useSelector} from 'react-redux';
// @ts-ignore
import PencilIcon from '../assets/pencil.svg';
import {IOrderItem} from '../interfaces/OrderItem.Interface';

const CheckoutScreen = ({navigation, route}) => {
  const [modeOfPayment, setModeOfPayment] = useState(EModeOfPayment.CASH);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loader, setLoader] = useState(false);
  const Shop = useSelector(state => state.shopDetails);

  const [inputAddress, setInputAddress] = useState(false);

  let order: Partial<IOrder> = route.params && route.params.order;
  const radio_props = [
    {label: EModeOfPayment.CASH, value: 1},
    {label: EModeOfPayment.ONLINE, value: 0},
  ];
  const decreaseStock = (orderItems: IOrderItem[]) => {
    for (const orderItem of orderItems) {
      db.ref('/products')
        .child(orderItem.pid)
        .child('stock')
        .once('value', snapshot => {
          let quantity = snapshot.val() - orderItem.quantity;
          if (quantity === 0) {
            db.ref('/products')
              .child(orderItem.pid)
              .child('status')
              .set(EProductStatus.OUT_OF_STOCK)
              .then(() => {
                console.log('product status changed');
              });
          }
          db.ref('/products')
            .child(orderItem.pid)
            .child('stock')
            .set(quantity)
            .then(() => {
              console.log('stock updated');
            });
        })
        .then(() => {
          console.log('stock updated');
        });
    }
  };
  const placeOrder = async () => {
    await decreaseStock(order.orderItems);

    const orderNo = `${Date.now()}`;
    order.orderNumber = orderNo;
    order.name = name;
    order.shippingAddress = `${address},\n${city}-${pin}`;
    order.phone = phone;
    order.modeOfPayment = modeOfPayment;
    order.orderSTATUS = EOrderStatus.PENDING;

    db.ref('/Users')
      .child(order.userPhone)
      .child('orders')
      .child(order.sid)
      .child(orderNo)
      .child('orderSTATUS')
      .set(order.orderSTATUS)
      .then(() => {
        setLoader(false);
        db.ref('/orders')
          .child(order.sid)
          .child(order.orderNumber)
          .update(order)
          .then(() => {
            db.ref('/cart')
              .child(phone)
              .child(order.sid)
              .remove()
              .then(() => {
                setLoader(false);
                navigation.popToTop();
              })
              .then(() => {
                navigation.navigate(ScreenNames.OrdersScreen);
              });
          });
      });
  };
  const onProceedToPay = () => {
    if (modeOfPayment === EModeOfPayment.ONLINE) {
      //online payment
      //open the online payment getaway
      alert(
        'unable to proceed online payment please select cash mode and proceed',
      );
    } else {
      setLoader(true);
      //cash payment
      placeOrder();
    }
  };

  const setDetails = async () => {
    setPhone(order.phone);
    setName(order.name);
    setAddress(order.address.address);
    setCity(order.address.city);
    setPin(order.address.pin);
  };

  const onDetailsChange = async () => {};

  useEffect(() => {
    setDetails();
    return navigation.addListener('focus', async () => {
      setDetails();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    onDetailsChange();
  }, [name, address, city, pin, phone, order]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <Text style={heading2}>Confirm your order details</Text>
      </View>
      <ExtendedLine />
      <View style={styles.itemContainer}>
        <OrderItem order={order} partial role={EUserRole.USER} />
      </View>
      {inputAddress ? (
        <View style={styles.shippingDetailsContainer}>
          <ExtendedLine />
          <Text style={styles.label}>Name:</Text>
          <ThemeTextInput
            onChangeText={n => setName(n)}
            placeholder="Walter White"
            value={name}
          />
          <Text style={styles.label}>Phone Number:</Text>
          <ThemeTextInput
            onChangeText={n => setPhone(n)}
            placeholder="+919876543210"
            value={phone}
          />
          <Text style={styles.label}>Shipping Address</Text>
          <ThemeTextInput
            onChangeText={a => setAddress(a)}
            placeholder="Street Address"
            value={address}
          />
          <ThemeTextInput
            onChangeText={a => setCity(a)}
            placeholder="City"
            value={city}
          />
          <ThemeTextInput
            onChangeText={a => setPin(a)}
            placeholder="Pin code"
            value={pin}
            keyboard={'number-pad'}
          />
          <ThemeButton
            title={'Save Details'}
            onPress={() => setInputAddress(false)}
          />
        </View>
      ) : (
        <View style={styles.shippingDetailsContainer}>
          <TouchableOpacity
            style={styles.horizontalFar}
            onPress={() => setInputAddress(true)}>
            <Text style={[heading2, styles.label]}>Shipping Details</Text>
            <PencilIcon height={20} width={20} fill={Colors.black} />
          </TouchableOpacity>
          <View style={styles.horizontalFar}>
            <View style={styles.horizontal}>
              <Text>Name : </Text>
              <Text>{name}</Text>
            </View>
            <Text>Ph. {phone}</Text>
          </View>
          <View style={styles.horizontalFar}>
            <View style={[styles.horizontal, {alignItems: 'flex-start'}]}>
              <Text>Address : </Text>
              <Text>{`${address},\n${city}-${pin}`}</Text>
            </View>
            <Text />
          </View>
        </View>
      )}
      <ExtendedLine />
      <Text style={[heading2, styles.label]}>Mode of Payment</Text>
      {Shop.modeOfPayment === EModeOfPayment.CASH ? (
        // @ts-ignore
        <Text style={styles.modeOfPayment}>
          {' '}
          {EModeOfPayment.CASH} (Preferred by the ShopOwner)
        </Text>
      ) : (
        <RadioForm
          radio_props={radio_props}
          initial={0}
          onPress={value => {
            setModeOfPayment(
              value ? EModeOfPayment.CASH : EModeOfPayment.ONLINE,
            );
            console.log(modeOfPayment);
            return !value;
          }}
        />
      )}

      <ExtendedLine />
      <View style={styles.confirmButton}>
        <ThemeButton
          title="Confirm this Order"
          onPress={onProceedToPay}
          textUpperCase
        />
      </View>
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 30,
  },
  horizontalFar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderListContainer: {
    height: '50%',
    backgroundColor: 'yellow',
  },
  container: {
    backgroundColor: Colors.white,
    height: '100%',
    padding: 10,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    paddingTop: 20,
  },
  shippingDetailsContainer: {
    padding: 15,
  },
  itemContainer: {
    paddingVertical: 5,
  },
  fullwidth: {
    flex: 1,
  },
  verticalContainer: {
    padding: 10,
    flex: 1,
  },
  title: {
    ...MasterStyles.heading2,
    textAlign: 'center',
    padding: 5,
  },
  label: {
    padding: 5,
  },
  thumbnail: {
    height: 100,
    width: 100,
    backgroundColor: Colors.gray,
    resizeMode: 'stretch',
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  uploadingText: {
    color: Colors.red,
    fontSize: 15,
    textAlign: 'left',
    padding: 5,
  },
});
