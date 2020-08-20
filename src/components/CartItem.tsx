import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import IncrementDecrement from './IncrementDecrement';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {boldText} from '../constants/MasterStyles';
// @ts-ignore
import CloseIcon from '../assets/close.svg';
import {ScreenNames} from '../constants/ScreenNames';
import {db} from '../firebase.config';
import ConfirmDialog from '../utils/ConfirmDialog';
import GenericUtil from '../helpers/genericUtil';

const CartItem = ({navigation, cartItem, phone, sid, refreshCart}) => {
  const onDelete = () => {
    const cartRef = db
      .ref('/cart')
      .child(phone)
      .child(sid);
    cartRef
      .child(cartItem.product.pid)
      .remove()
      .then(() => {
        //todo
        refreshCart();
        //navigation.navigate(ScreenNames.CartStack);
      });
  };
  const price = GenericUtil.getFormattedPrice(cartItem.product.price);
  const priceCartItem = GenericUtil.getFormattedPrice(
    cartItem.product.price * cartItem.quantity,
  );

  return (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.imgStyles}
        onPress={() =>
          navigation.navigate(ScreenNames.ShoppingScreen, {
            screen: ScreenNames.ProductDescription,
            params: {product: cartItem.product},
          })
        }>
        <Image
          style={styles.image}
          source={{
            uri: cartItem.product.image
              ? cartItem.product.image
                  .replace('_200x200', '')
                  .replace('.jpg', '_200x200.jpg')
              : '',
          }}
        />
      </TouchableOpacity>
      <View style={styles.parentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{cartItem.product.name}</Text>
          <TouchableOpacity
            style={styles.cross}
            onPress={() => {
              ConfirmDialog(
                'Delete Product',
                'Are you sure to delete this product from Cart?',
                onDelete,
                () => {},
              );
            }}>
            <CloseIcon fill={Colors.primaryColorDark} />
          </TouchableOpacity>
        </View>
        <View style={styles.horizontal}>
          <View style={styles.vertical}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{price}</Text>
            </View>
            <IncrementDecrement
              totalHeight={25}
              product={cartItem.product}
              phone={phone}
              sid={sid}
              isCartScreen={true}
              refreshCart={refreshCart}
            />
          </View>
          <View style={styles.total}>
            <Text>Total:</Text>
            <Text style={styles.totalPrice}>₹{priceCartItem}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  productCard: {
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderColor: Colors.charcoalGrey,
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 0,
    //shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {width: 3, height: 3},
    elevation: 5,
    aspectRatio: 2.7,
    display: 'flex',
    flexDirection: 'row',
  },
  imgStyles: {
    alignSelf: 'center',
    height: '95%',
    borderRadius: 3,
    flex: 1,
    backgroundColor: Colors.gray,
  },
  image: {
    borderRadius: 4,
    paddingVertical: 5,
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  parentContainer: {
    marginVertical: 5,
    flex: 2.3,
    paddingHorizontal: 10,
    textAlign: 'left',
    flexDirection: 'column',
  },
  textContainer: {
    marginVertical: 5,
    width: '100%',
    maxHeight: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: Colors.primaryColorDark,
    textAlign: 'left',
    fontSize: 22,
    flex: 1,
    fontFamily: 'Nunito-Bold',
  },
  priceContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
  },
  priceTag: {
    height: '100%',
    alignItems: 'center',
    paddingTop: 3,
  },
  price: {
    fontSize: 20,
    paddingHorizontal: 5,
    fontFamily: 'Nunito-Bold',
  },
  total: {
    flex: 1,
    textAlign: 'center',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Nunito-SemiBold',
  },
  totalPrice: {
    fontSize: 22,
    //...boldText,
    fontFamily: 'Nunito-Bold',
  },
  cross: {
    position: 'relative',
    right: -7,
  },
});

export default CartItem;
