import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {IOrderItem} from '../interfaces/OrderItem.Interface';
import GenericUtil from '../helpers/genericUtil';

const OrderListItem = ({item}: IOrderItem | any) => {
  const price = GenericUtil.getFormattedPrice(item.price);
  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.text2}>
        ₹ {price} x {item.quantity}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily:'Nunito-SemiBold',
    fontSize: 15,
    color: Colors.dark,
  },
  text2: {
    fontFamily:'Nunito-SemiBold',
    fontSize: 16,
    color: Colors.dark,
  },
});

export default OrderListItem;
