import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
const moment = require('moment');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {boldText, heading2, orderStatus} from '../constants/MasterStyles';
import {IOrder} from '../interfaces/Order.interface';
import {FlatList} from 'react-native-gesture-handler';
import OrderListItem from './OrderListItem';
import {
  EModeOfPayment,
  EOrderStatus,
  EProductStatus,
  EUserRole,
} from '../constants/Enums';
// @ts-ignore
import Cash from '../assets/cash.svg';
// @ts-ignore
import Online from '../assets/online.svg';
// @ts-ignore
import WhatsAppIcon from '../assets/whatsapp.svg';
// @ts-ignore
import PhoneIcon from '../assets/phone.svg';
import ThemeButton from './ThemeButton';
import ThemeButtonRed from './ThemeButtonRed';
import ThemeButtonGreen from './ThemeButtonGreen';
import {db} from '../firebase.config';
import {IOrderItem} from '../interfaces/OrderItem.Interface';
import {useSelector} from 'react-redux';
import toast from './toast';
import GenericUtil from '../helpers/genericUtil';
import database from '@react-native-firebase/database';

interface IOrderItemInput {
  order: Partial<IOrder>;
  partial?: boolean;
  role: string;
  refreshOrders?: any;
}
const IncreaseStock = (orderItems: IOrderItem[]) => {
  for (const orderItem of orderItems) {
    database().ref('/products')
      .child(orderItem.pid)
      .child('stock')
      .once('value', snapshot => {
        let quantity = snapshot.val() + orderItem.quantity;
        database().ref('/products')
          .child(orderItem.pid)
          .child('status')
          .set(EProductStatus.AVAILABLE)
          .then(() => {
            console.log('product status changed');
          });
        database().ref('/products')
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

const OrderItem = ({
  refreshOrders,
  order,
  partial = false,
  role,
}: IOrderItemInput) => {
  const Shop = useSelector(state => state.shopDetails);

  const getStatus = (status, partial) => {
    if (!partial) {
      return (
        <View style={styles.horizontal}>
          {/*@ts-ignore*/}
          <Text style={orderStatus(status)}>{status}</Text>
        </View>
      );
    }
  };

  const orderDate = () => {
    const t = new Date(Number(order.orderNumber));
    return moment(t).format('DD MMM, YYYY - hh:mm a');
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const orderStatusFromDB = () => {
    let orderstatus = '';
    database().ref('/orders')
      .child(Shop.sid)
      .child(order.orderNumber)
      .once('value', async snap => {
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        let o: IOrder = await snap.val();
        orderstatus = o.orderSTATUS;
        return o.orderSTATUS;
      })
      .then(() => {
        return orderstatus;
      });
  };
  const getButtons = (role, orderStatus, order, sid) => {
    if (orderStatus === EOrderStatus.PENDING) {
      if (role === EUserRole.USER) {
        return (
          <ThemeButton
            title="Cancel this Order"
            onPress={() => {
              database().ref('/orders')
                .child(sid)
                .child(order.orderNumber)
                .child('orderSTATUS')
                .set(EOrderStatus.CANCELLED)
                .then(() => {
                  IncreaseStock(order.orderItems);
                  refreshOrders();
                });
            }}
            textUpperCase
          />
        );
      } else {
        return (
          <View style={styles.horizontal}>
            <ThemeButtonGreen
              title="Accept"
              onPress={() => {
                database().ref('/orders')
                  .child(sid)
                  .child(order.orderNumber)
                  .child('orderSTATUS')
                  .set(EOrderStatus.PLACED)
                  .then(() => {
                    console.log('orderAccepted');
                    refreshOrders();
                  });
              }}
              textUpperCase
            />
            <ThemeButtonRed
              title="Reject"
              onPress={() => {
                database().ref('/orders')
                  .child(sid)
                  .child(order.orderNumber)
                  .child('orderSTATUS')
                  .set(EOrderStatus.REJECTED)
                  .then(() => {
                    console.log('orderRejected');
                    IncreaseStock(order.orderItems);
                    refreshOrders();
                  });
              }}
              textUpperCase
            />
          </View>
        );
      }
    } else if (orderStatus === EOrderStatus.PLACED) {
      if (role === EUserRole.ADMIN) {
        return (
          <ThemeButton
            title="Out for Delivery"
            onPress={() => {
              database().ref('/orders')
                .child(sid)
                .child(order.orderNumber)
                .child('orderSTATUS')
                .set(EOrderStatus.ON_THE_WAY)
                .then(() => {
                  console.log('orderOutForDelivery');
                  refreshOrders();
                });
            }}
            textUpperCase
          />
        );
      }
    } else if (orderStatus === EOrderStatus.ON_THE_WAY) {
      if (role === EUserRole.ADMIN) {
        return (
          <ThemeButton
            title="Complete Order"
            onPress={() => {
              database().ref('/orders')
                .child(sid)
                .child(order.orderNumber)
                .child('orderSTATUS')
                .set(EOrderStatus.COMPLETE)
                .then(() => {
                  console.log('orderCompleted');
                  refreshOrders();
                });
            }}
            textUpperCase
          />
        );
      }
    }
  };
  const orderTotal = GenericUtil.getFormattedPrice(order.totalPrice);

  return (
    <View style={styles.productCard}>
      <View style={styles.horizontalFar}>
        {/*@ts-ignore*/}
        <Text style={styles.orderNumber}>
          {partial ? 'Mode of PAYMENT :' : `#${order.orderNumber}`}
        </Text>
        <View style={styles.horizontal}>
          {order.modeOfPayment === EModeOfPayment.CASH ? (
            <Cash height={25} width={30} />
          ) : (
            <Online height={25} width={30} />
          )}
          <Text style={styles.modeOfPayment}>{order.modeOfPayment}</Text>
        </View>
      </View>
      {order.transactionId && (
        <View style={styles.horizontalFar}>
          <View style={styles.horizontal}>
            <Text style={styles.text}>Transaction Id : </Text>
            <Text style={styles.text}>{order.transactionId}</Text>
          </View>
        </View>
      )}
      {(order.name || order.phone) && !partial && (
        <View style={styles.horizontalFar}>
          <View style={styles.horizontal}>
            {order.name && <Text style={styles.text}>Name : </Text>}
            <Text style={styles.text}>{order.name}</Text>
          </View>
          {order.phone && <Text style={styles.text}>Ph. {order.phone}</Text>}
        </View>
      )}

      <View style={styles.horizontalFar}>
        {partial ? null : (
          <View style={styles.horizontal}>
            <Text style={styles.text}>Date: </Text>
            <Text style={styles.text}>{orderDate()}</Text>
          </View>
        )}
        {getStatus(order.orderSTATUS, partial)}
      </View>
      {partial ? null : (
        <View style={styles.horizontalFar}>
          <View>
            <Text style={styles.text}>Shipping Address: </Text>
            <Text style={styles.addressText}>
              {order.shippingAddress || order.address.address}
            </Text>
          </View>
          <View style={styles.horizontal}>
            <TouchableOpacity
              style={styles.icons}
              onPress={() => {
                role === EUserRole.USER
                  ? Linking.openURL(`tel:${Shop.phone}`)
                  : Linking.openURL(`tel:${order.phone}`);
              }}>
              <PhoneIcon height={25} width={25} fill={Colors.deepskyblue} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icons}
              onPress={() => {
                role === EUserRole.USER
                  ? Linking.openURL(
                      `whatsapp://send?text=\`*Order Details*:
order no. -${order.orderNumber}
Dated = ${orderDate()}
OrderTotal = ${order.totalPrice}
order Items -${order.orderItems}
order Status = ${order.orderSTATUS}
phone Number = ${order.phone}
Shipping Address =${order.shippingAddress}
\`}&phone=${Shop.phone}`,
                    )
                      .then(() => {
                        toast('Opening WhatsApp');
                      })
                      .catch(() => {
                        toast('Please install WhatsApp first then Proceed');
                      })
                  : Linking.openURL(
                      `whatsapp://send?text=\`*Order Details*:
order no. -${order.orderNumber}
Dated = ${orderDate()}
OrderTotal = ${order.totalPrice}
order Items -${order.orderItems}
order Status = ${order.orderSTATUS}
phone Number = ${order.phone}
Shipping Address =${order.shippingAddress}
\`}&phone=${order.phone}`,
                    )
                      .then(() => {
                        toast('Opening WhatsApp');
                      })
                      .catch(() => {
                        toast('Please install WhatsApp first then Proceed');
                      });
              }}>
              <WhatsAppIcon height={27} width={27} fill={Colors.toggleGreen} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.listContainer}>
        <FlatList
          data={order.orderItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <OrderListItem item={item} />}
        />
      </View>
      <View style={styles.horizontalFar}>
        <View>
          {/*@ts-ignore*/}
          <Text style={styles.title}>Order Total :</Text>
          <Text style={styles.text}>(Inclusive of all Taxes)</Text>
        </View>
        <Text style={styles.totalPrice}>₹ {orderTotal}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {partial ? null : getButtons(role, order.orderSTATUS, order, order.sid)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icons: {
    paddingVertical: 10,
    paddingLeft: 15,
  },
  buttonContainer: {marginTop: 15},
  addressText: {
    fontFamily: 'Nunito-SemiBold',
    color: Colors.charcoalGrey80,
    fontSize: 12,
    paddingLeft: 5,
  },
  productCard: {
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderRadius: 5,
    // borderWidth: 1,
    width: '100%',
    // borderColor: Colors.primaryColor,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'column',
    marginBottom: 10,
    elevation: 5,
  },
  horizontal: {
    flexDirection: 'row',
  },
  horizontalFar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  listContainer: {
    marginVertical: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.gray,

    paddingVertical: 10,
  },
  modeOfPayment: {
    ...heading2,
    paddingHorizontal: 5,
  },
  text: {
    fontFamily: 'Nunito-SemiBold',
    color: Colors.charcoalGrey80,
    fontSize: 12,
  },
  textContainer: {
    marginVertical: 5,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  imgStyles: {
    height: '100%',
    borderRadius: 5,
    flex: 1,
  },
  editBar: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  totalPrice: {
    fontFamily: 'Nunito-Bold',
    fontSize: 25,
    color: Colors.primaryColorDark,
  },
});

export default OrderItem;
