import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../constants/Colors';
import ExtendedLine from '../components/ExtendedLine';
import OrderItem from '../components/OrderItem';
import {EOrderStatus, EUserRole} from '../constants/Enums';
import {db} from '../firebase.config';
import {IOrder} from '../interfaces/Order.interface';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {useSelector} from 'react-redux';
import {boldText, heading2} from '../constants/MasterStyles';
import Header from '../components/Header';
import {NavigationEvents} from 'react-navigation';
import {ScreenNames} from '../constants/ScreenNames';

const OrdersScreen = ({navigation}) => {
  let o: (IOrder)[] = [];
  const [orders, setOrders] = useState(o);
  const [loader, setLoader] = useState(true);
  const role = useSelector(state => state.role);
  const phone = useSelector(state => state.phoneNumber);
  const sid = useSelector(state => state.sid);
  const [pendingOrders, setPending] = useState(0);
  const [acceptedOrders, setAccepted] = useState(0);

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      updateOrders();
    });
  }, [navigation]);

  const refreshOrders = () => {
    setLoader(true);
    updateOrders().then(() => {
      setLoader(false);
    });
  };

  let updateOrders: () => Promise<void>;
  updateOrders = async () => {
    const orderRef = db.ref('/orders').child(sid);
    if (role === EUserRole.USER) {
      await db
        .ref('/Users')
        .child(phone)
        .child('orders')
        .child(sid)
        .once('value', async snapshot => {
          let snap = await snapshot.val();
          const orderIds: string[] = [];
          for (const element in snap) {
            orderIds.push(element);
          }
          o = [];
          for (const orderId of orderIds.reverse()) {
            try {
              await orderRef.child(orderId).once('value', async snapshot => {
                let order: IOrder = await snapshot.val();
                o.push(order);
              });
            } catch (error) {
              console.log(error);
            }
          }
          setOrders(o);
          setLoader(false);
        });
    } else {
      o = [];
      await orderRef.once('value', async snapshot => {
        let snap: Object = await snapshot.val();
        o = snap ? Object.values(snap).reverse() : [];
        let pendOrder = 0;
        let accOrder = 0;
        o.forEach(order => {
          if (order.orderSTATUS === EOrderStatus.PENDING) {
            pendOrder += 1;
          }
          if (
            order.orderSTATUS === EOrderStatus.PLACED ||
            order.orderSTATUS === EOrderStatus.ON_THE_WAY
          ) {
            accOrder += 1;
          }
        });
        console.log(pendOrder);
        setPending(pendOrder);
        setAccepted(accOrder);
        setOrders(o);
        setLoader(false);
      });
    }
  };

  return (
    <>
      {/*// @ts-ignore*/}
      <NavigationEvents onFocus={updateOrders} />
      <View>
        <Header
          navigation={navigation}
          title={'Orders'}
          role={role}
          key={Date.now()}
        />
        {/*// @ts-ignore*/}
        <ProgressDialog visible={loader} message="Please, wait..." />
        <View style={styles.container}>
          {role !== EUserRole.USER && (
            <View style={styles.horizontalFar}>
              <View style={styles.horizontal}>
                <Text>{`Pending Orders: ${pendingOrders}`}</Text>
              </View>
              <View style={styles.horizontal}>
                <Text>{`Active Orders: ${acceptedOrders}`}</Text>
              </View>
            </View>
          )}
          {orders.length > 0 ? (
            <ScrollView
              // @ts-ignore
              contentContainerStyle="center"
              style={styles.allCategoryView}>
              <ExtendedLine />
              <FlatList
                style={{marginVertical: 5}}
                data={orders}
                renderItem={({item}) => (
                  <OrderItem
                    order={item}
                    partial={false}
                    role={role}
                    refreshOrders={refreshOrders}
                  />
                )}
                scrollEnabled
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.emptyOrdersContainer}
              onPress={() => navigation.navigate(ScreenNames.CategoryScreen)}>
              <Text style={styles.goText}>Seems like empty in here</Text>
              {/*// @ts-ignore*/}
              <Text style={styles.goText2}>Start Shopping</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};
export default OrdersScreen;

const styles = StyleSheet.create({
  emptyOrdersContainer: {
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
  sectionHeader: {
    ...boldText,
    ...heading2,
    marginVertical: 12,
    textAlign: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  horizontalFar: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  allCategoryView: {
    flexGrow: 1,
  },
  container: {
    height: '100%',
    backgroundColor: Colors.white,
    padding: 5,
  },
});
