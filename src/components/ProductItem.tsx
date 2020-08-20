import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import {heading3, productStatus} from '../constants/MasterStyles';
import ProductEditBar from './ProductEditBar';
import {EUserRole} from '../constants/Enums';
import {useSelector} from 'react-redux';
import IncrementDecrement from './IncrementDecrement';
import {ScreenNames} from '../constants/ScreenNames';

const ProductItem = ({
  navigation,
  product,
  category,
  role,
  sid,
  phone,
  refreshProducts,
}) => {
  const Shop = useSelector(state => state.shopDetails);
  const onProductClick = () => {
    product.isNew
      ? navigation.navigate(ScreenNames.ShoppingScreen, {
          screen: ScreenNames.CreateProductScreen,
          params: {category},
        })
      : navigation.navigate(ScreenNames.ShoppingScreen, {
          screen: ScreenNames.ProductDescription,
          params: {product},
        });
  };

  const image = product.image
    ? product.image.replace('_200x200', '').replace('.jpg', '_200x200.jpg')
    : '';
  const price = product.price.replace(/\D/g, '')
    .replace(/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, '$1,');
  // @ts-ignore
  return (
    <View style={styles.productCard}>
      <TouchableOpacity style={styles.imgStyles} onPress={onProductClick}>
        <Image
          style={styles.image}
          source={{
            uri: image,
          }}
        />
      </TouchableOpacity>
      <View style={styles.parentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={1}>
            {product.name}
          </Text>
        </View>
        <Text style={styles.desc} numberOfLines={1}>
          {product.description.replace('\n', ', ')}
        </Text>
        <View style={styles.horizontal1}>
          {/*// @ts-ignore*/}
          <Text style={productStatus(product.status)}>{product.status}</Text>
          {role === EUserRole.ADMIN ? (
            <Text>Stock: {product.stock}</Text>
          ) : null}
        </View>
        <View style={styles.horizontal}>
          <View style={styles.vertical}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{price}</Text>
            </View>
          </View>
          {!Shop.showcase &&
          role === EUserRole.USER &&
          product.stock > 0 &&
          product.isAvailable ? (
            <View style={styles.horizontalCenter}>
              <IncrementDecrement
                product={product}
                totalHeight={30}
                sid={sid}
                phone={phone}
                isCartScreen={false}
                refreshCart={refreshProducts}
              />
            </View>
          ) : null}
        </View>
      </View>
      {role !== EUserRole.USER && !product.isNew ? (
        <View style={styles.editBar}>
          <ProductEditBar
            navigation={navigation}
            product={product}
            refreshProducts={refreshProducts}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  horizontal1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desc: {
    color: Colors.charcoalGreyMediocre,
    textAlign: 'left',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontalCenter: {
    flex: 1,
    alignItems: 'center',
  },
  productCard: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
    padding: 7,
    borderWidth: 0.5,
    borderRadius: 3,
    borderColor: Colors.charcoalGreyMediocre,
    marginBottom: 5,
    aspectRatio: 3,
    flexDirection: 'row',
  },
  imgStyles: {
    height: '100%',
    borderRadius: 2,
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.gray,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  parentContainer: {
    flex: 2.2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderLeftWidth: 0,
    paddingHorizontal: 10,
    textAlign: 'left',
    backgroundColor: Colors.white,
    flexDirection: 'column',
  },
  newItemTextContainer: {
    marginVertical: 5,
    flex: 2.3,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderLeftWidth: 0,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    maxHeight: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  newItemTextStyle: {
    ...heading3,
    color: Colors.primaryColorDark,
    textAlign: 'left',
    fontSize: 25,
  },
  text: {
    color: Colors.black,
    textAlign: 'left',
    fontSize: 21,
    flex: 1,
    fontFamily: 'Nunito-SemiBold',
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceTag: {
    height: '100%',
    alignItems: 'center',
    paddingTop: 3,
    fontSize: 12,
  },
  price: {
    fontSize: 21,
    paddingHorizontal: 5,
    fontFamily: 'Nunito-Bold',
  },
  editBar: {
    height: '115%',
    bottom: 8,
  },
});

export default ProductItem;
