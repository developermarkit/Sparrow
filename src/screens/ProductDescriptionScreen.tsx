import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ThemeButton from '../components/ThemeButton';
import Colors from '../constants/Colors';
import IncrementDecrement, {
  updateCartItem,
} from '../components/IncrementDecrement';
import {boldText, productStatus} from '../constants/MasterStyles';
import {EProductStatus, EUserRole} from '../constants/Enums';
import {ScreenNames} from '../constants/ScreenNames';
import {db} from '../firebase.config';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {useSelector} from 'react-redux';
import Header from '../components/Header';
import ExtendedLine from '../components/ExtendedLine';
import GenericUtil from '../helpers/genericUtil';
import toast from '../components/toast';
import database from '@react-native-firebase/database';
// @ts-ignore
import WhatsAppIcon from '../assets/whatsapp.svg';
// @ts-ignore
import PhoneIcon from '../assets/phone.svg';
interface quantity {
  quantity: number;
}

const ProductDescriptionScreen = ({navigation, route}) => {
  const params = route && route.params;
  const mProduct = params ? params.product : undefined;
  const pid = mProduct.pid;
  const [product, setProduct] = useState();
  const role = useSelector(state => state.role);
  const phone = useSelector(state => state.phoneNumber);
  const sid = useSelector(state => state.sid);
  const Shop = useSelector(state => state.shopDetails);
  const [loader, setLoader] = useState(true);
  const [now, setNow] = useState(Date.now());
  console.log('product description: ', pid);
  const fetchProduct = async () => {
    const orderRef = database().ref('/products').child(pid);
    orderRef
      .once('value', async snapshot => {
        let snap = await snapshot.val();
        setProduct(snap);
      })
      .then(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchProduct();
    return navigation.addListener('focus', async () => {
      fetchProduct();
    });
  }, [navigation]);

  const onBuyNow = () => {
    setLoader(true);
    const gotoCart = q => {
      if (sid && phone) {
        if (q === 0 || !q) {
          updateCartItem(phone, sid, product, 1, false, navigation).then(() => {
            navigation.navigate(ScreenNames.CartStack).then(() => {
              navigation.popToTop();
            });
          });
        } else {
          navigation.navigate(ScreenNames.CartStack);
        }
      }
    };
    database().ref('/cart')
      .child(phone)
      .child(sid)
      // @ts-ignore
      .child(product.pid)
      //.child('quantity')
      .once('value', snap => {
        const q: quantity = snap.val() ? snap.val().quantity : 0;
        gotoCart(q);
      })
      .then(() => {
        console.log('item added to cart');
      });
  };

  // @ts-ignore
  return (
    <>
      {/*// @ts-ignore*/}
      <ProgressDialog visible={loader} message="Please, wait..." />
      {product ? (
        <View style={styles.container}>
          <Header
            title={'Item Description'}
            navigation={navigation}
            role={role}
            key={now}
          />
          <ScrollView style={styles.scrollContainer}>
            {/*// @ts-ignore*/}
            <Text style={styles.name}>{product.name}</Text>
            <Image
              style={styles.image}
              source={{
                // @ts-ignore
                uri: product.image
                  ? // @ts-ignore
                    product.image
                      .replace('_200x200', '')
                      .replace('.jpg', '_200x200.jpg')
                  : '',
              }}
            />
            <View style={styles.priceActionContainer}>
              <View style={styles.priceContainer}>
                {/*<Text style={styles.priceTag}>Price : </Text>*/}
                <Text style={styles.price}>
                  ₹
                  {// @ts-ignore
                  GenericUtil.getFormattedPrice(product.price)}
                </Text>
              </View>
              {!Shop.showcase &&
                sid &&
                // @ts-ignore
                product.isAvailable === true &&
                // @ts-ignore
                product.stock > 0 &&
                phone &&
                role === EUserRole.USER && (
                  <IncrementDecrement
                    product={product}
                    totalHeight={30}
                    sid={sid}
                    phone={phone}
                    isCartScreen={false}
                    refreshCart={() => setNow(Math.random())}
                  />
                )}
            </View>
            <View style={styles.horizontalFar}>
              <View style={styles.priceContainer}>
                {/*<Text>Status : </Text>*/}
                {/*// @ts-ignore*/}
                <Text style={productStatus(product.status)}>
                  {
                    // @ts-ignore
                    product.status
                  }
                </Text>
              </View>
              {role === EUserRole.USER && (
                <View style={styles.horizontal}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(`tel:${Shop.phone}`);
                    }}>
                    <PhoneIcon
                      height={25}
                      width={25}
                      fill={Colors.deepskyblue}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        `whatsapp://send?text=\`*Item Details*:
Item Name -${
                          // @ts-ignore
                          product.name
                        }
Item Price = ₹${GenericUtil.getFormattedPrice(
                          // @ts-ignore
                          product.price,
                        )}
Item Description = ${
                          // @ts-ignore
                          product.description
                        }
\`}&phone=${Shop.phone}`,
                      )
                        .then(() => {
                          toast('Opening WhatsApp');
                        })
                        .catch(() => {
                          toast('Please install WhatsApp first then Proceed');
                        });
                    }}>
                    <WhatsAppIcon
                      height={27}
                      width={27}
                      fill={Colors.toggleGreen}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <ExtendedLine />
            {/*// @ts-ignore*/}
            <Text style={[styles.tag, {...boldText, marginTop: 10}]}>
              Product Description
            </Text>
            {/*// @ts-ignore*/}
            <Text style={styles.description}>{product.description || ''}</Text>
            <ExtendedLine />
            {!Shop.showcase &&
              role === EUserRole.USER &&
              // @ts-ignore
              product.status === EProductStatus.AVAILABLE && (
                <View style={styles.actionButton}>
                  <ThemeButton title={'Buy Now'} onPress={onBuyNow} />
                </View>
              )}
          </ScrollView>
        </View>
      ) : (
        <Text>'Product not found'</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 15,
  },
  container: {
    //padding: 15,
    backgroundColor: Colors.white,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    color: Colors.charcoalGrey80,
    fontSize: 23,
    fontFamily: 'Nunito-SemiBold',
  },
  image: {
    height: 300,
    margin: 20,
    justifyContent: 'center', // TODO horizontal center
    backgroundColor: Colors.gray,
  },
  priceActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTag: {
    height: '100%',
    alignItems: 'center',
    paddingTop: 3,
  },
  price: {
    fontSize: 30,
    paddingHorizontal: 5,
  },
  status: {
    padding: 5,
  },
  tag: {
    paddingEnd: 5,
  },
  description: {
    padding: 5,
    color: Colors.black,
  },
  actionButton: {
    marginBottom: 0,
    marginTop: 10,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
  },
  horizontalFar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductDescriptionScreen;
