import {TouchableOpacity, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import Colors from '../constants/Colors';
// @ts-ignore
import DisableIcon from '../assets/disable.svg';
// @ts-ignore
import PencilIcon from '../assets/pencil.svg';
// @ts-ignore
import DeleteIcon from '../assets/delete.svg';
import {EProductStatus} from '../constants/Enums';
import {ScreenNames} from '../constants/ScreenNames';
import {db} from '../firebase.config';
import ConfirmDialog from '../utils/ConfirmDialog';
import toast from './toast';
import database from '@react-native-firebase/database';

const ProductEditBar = ({navigation, product, refreshProducts}) => {
  const [isEnabled, setIsEnabled] = useState(
    product.status === EProductStatus.AVAILABLE,
  );
  const onProductEdit = () => {
    navigation.navigate(ScreenNames.ShoppingScreen, {
      screen: ScreenNames.CreateProductScreen,
      params: product,
    });
  };
  const onProductDelete = () => {
    database().ref('/products')
      .child(product.pid)
      .remove()
      .then(() => {
        console.log('Product Deleted!');
        refreshProducts();
      })
      .catch(() => {
        toast('Unable to delete the Product at the moment,try again later.');
      });
  };

  const onProductDisable = () => {
    console.log(product.stock);
    if (product.stock === '0' || !product.stock) {
      toast('Cannot change the status of a product whose stock is ZERO');
    } else {
      refreshProducts();
      database().ref('/products')
        .child(product.pid)
        .update({
          status: isEnabled
            ? EProductStatus.OUT_OF_STOCK
            : EProductStatus.AVAILABLE,
        })
        .then(() => {
          database().ref('/products')
            .child(product.pid)
            .update({
              isAvailable: isEnabled ? false : true,
            })
            .then(() => {
              setIsEnabled(!isEnabled);
            });
        });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.image} onPress={onProductEdit}>
        <PencilIcon height={20} width={20} fill={Colors.primaryColorDark} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.image} onPress={onProductDisable}>
        <DisableIcon
          height={20}
          width={20}
          fill={isEnabled ? Colors.black : Colors.red}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.image}
        onPress={() => {
          ConfirmDialog(
            'Delete Product',
            'Are you sure to delete?',
            onProductDelete,
            () => {
              console.log('cancel Pressed');
            },
          );
        }}>
        <DeleteIcon height={20} width={20} fill={Colors.primaryColorDark} />
      </TouchableOpacity>
    </View>
  );
};
export default ProductEditBar;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
