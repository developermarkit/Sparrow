import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../constants/Colors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {boldText, boldText2} from '../constants/MasterStyles';
import {db} from '../firebase.config';
import {IProduct} from '../interfaces/Product.interface';
// @ts-ignore
import PlusIcon from '../assets/plus.svg';
// @ts-ignore
import MinusIcon from '../assets/minus.svg';
// @ts-ignore
import DeleteIcon from '../assets/delete.svg';
import {EProductStatus} from '../constants/Enums';
import toast from './toast';
import database from '@react-native-firebase/database';

export const updateCartItem = async (
  phone: string,
  sid: string,
  product: IProduct,
  q: number,
  isCartScreen: boolean,
  refreshCart: any,
) => {
  const cartRef = database()
    .ref('/cart')
    .child(phone)
    .child(sid);
  await cartRef
    .child(product.pid)
    .update({quantity: q})
    .then(() => {
      if (isCartScreen) {
        refreshCart();
      }
    });
};

let height: number = 25;
const IncrementDecrement = ({
  product,
  totalHeight,
  sid,
  phone,
  isCartScreen,
  refreshCart,
}) => {
  const [quantity, setQuantity] = useState(0);
  const cartRef = database()
    .ref('/cart')
    .child(phone)
    .child(sid);

  if (totalHeight) {
    height = totalHeight;
  }

  const incrementQuantity = async (prod: IProduct, q: number) => {
    if (q < prod.stock) {
      q++;
      await updateCartItem(phone, sid, product, q, isCartScreen, refreshCart);
      return quantity + 1;
    } else {
      toast("Available Stock's maximum quantity reached!!!");
    }
  };

  const decrementQuantity = async (prod: IProduct, q: number) => {
    q--;
    if (q === 0) {
      await cartRef
        .child(prod.pid)
        .remove()
        .then(() => {
          if (isCartScreen) {
            refreshCart();
          }
        });
    }
    await updateCartItem(phone, sid, product, q, isCartScreen, refreshCart);
    return q;
  };

  const addToCart = async (prod: IProduct) => {
    await cartRef.child(prod.pid).once('value', async snapshot => {
      if (snapshot.val() !== null) {
        await incrementQuantity(prod, snapshot.val().quantity);
      } else {
        await incrementQuantity(prod, 0);
      }
    });
  };

  useEffect(() => {
    cartRef.child(product.pid).once('value', async snapshot => {
      if (snapshot.val() !== null) {
        setQuantity(snapshot.val().quantity);
      } else {
        setQuantity(0);
      }
    });
  }, [cartRef, product, quantity]);

  return product.status === EProductStatus.AVAILABLE ? (
    quantity > 0 ? (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={async () =>
            setQuantity(await decrementQuantity(product, quantity))
          }>
          <View style={styles.imageLeft}>
            {quantity === 1 ? (
              <DeleteIcon
                height={(height * 3) / 5}
                width={(height * 3) / 5}
                fill={Colors.white}
              />
            ) : (
              <MinusIcon
                height={(height * 2.5) / 5}
                width={(height * 2.5) / 5}
                fill={Colors.white}
              />
            )}
          </View>
        </TouchableOpacity>
        {/*// @ts-ignore*/}
        <Text style={styles.count}>{quantity}</Text>
        <TouchableOpacity
          onPress={async () =>
            setQuantity(await incrementQuantity(product, quantity))
          }>
          <View style={styles.imageRight}>
            <PlusIcon
              height={(height * 2.5) / 5}
              width={(height * 2.5) / 5}
              fill={Colors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      // @ts-ignore
      <TouchableOpacity style={styles.Container}>
        <Text
          style={styles.text}
          onPress={async () =>
            // @ts-ignore
            setQuantity(await addToCart(product))
          }
          numberOfLines={1}>
          ADD
        </Text>
      </TouchableOpacity>
    )
  ) : null;
};

const borderRadius = 5;
const styles = StyleSheet.create({
  container: {
    maxHeight: 30,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    borderRadius,
    textAlign: 'right',
  },
  imageLeft: {
    height: height,
    aspectRatio: 1,
    resizeMode: 'stretch',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRight: {
    height: height,
    aspectRatio: 1,
    resizeMode: 'stretch',
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    color: Colors.primaryDarker,
    ...boldText,
    fontSize: height - 7,
    minWidth: height + 10,
    textAlign: 'center',
  },
  text: {
    backgroundColor: Colors.primaryColor,
    color: Colors.white,
    fontSize: (height * 2) / 3,
    fontFamily: 'Nunito-Bold',
    borderRadius: 5,
    minWidth: 80,
    paddingVertical: 2,
    paddingHorizontal: 32,
    textAlign: 'center',
  },
});

export default IncrementDecrement;
