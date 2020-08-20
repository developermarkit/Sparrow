import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View, Text} from 'react-native';
import * as MasterStyles from '../constants/MasterStyles';
import {boldText} from '../constants/MasterStyles';
import Colors from '../constants/Colors';
import ProductItem from '../components/ProductItem';
import ExtendedLine from '../components/ExtendedLine';
import {db} from '../firebase.config';
import {IProduct} from '../interfaces/Product.interface';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {useSelector} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import Header from '../components/Header';
import {ScreenNames} from '../constants/ScreenNames';

const WINDOW_WIDTH = Dimensions.get('window').width;
const ProductScreen = ({navigation, route}) => {
  const productsRef = db.ref('/products');

  let products: (IProduct | {isNew: boolean})[] = [];
  const category =
    route && route.params && route.params.category
      ? route.params.category
      : undefined;
  const [loader, setLoader] = useState(false);
  const role = useSelector(state => state.role);
  const phone = useSelector(state => state.phoneNumber);
  const sid = useSelector(state => state.sid);
  const [data, setData] = useState(products);
  // console.log('::::::::::::::::::::::::::::::::::::::::::::::::::');
  // console.log(category);
  const addNewProduct = category => {
    navigation.navigate(ScreenNames.ShoppingScreen, {
      screen: ScreenNames.CreateProductScreen,
      params: {category},
    });
  };
  const fetchUserData = async () => {
    setLoader(true);
    products = [];
    setProducts().then(() => {
      setData(products);
    });
  };

  const setProducts = async () => {
    const pids: string[] =
      category && category.pids ? Object.values(category.pids) : [];
    for (const pid of pids) {
      await productsRef.child(pid).once('value', async snapshot => {
        const snap: IProduct = await snapshot.val();
        if (snap) {
          products.push(snap);
        }
      });
    }
    setLoader(false);
  };

  useEffect(() => {
    return navigation.addListener('focus', async () => {
      fetchUserData();
    });
  }, [navigation]);

  return (
    <>
      {/*// @ts-ignore*/}
      <NavigationEvents onFocus={fetchUserData} />
      {/*// @ts-ignore*/}
      <View contentContainerStyle="center" style={styles.allCategoryView}>
        {/*// @ts-ignore*/}
        <ProgressDialog visible={loader} message="Please, wait..." />
        <Header
          title={category ? category.name : 'error'}
          navigation={navigation}
          role={role}
          key={data.length}
          addFunction={() => addNewProduct(category)}
        />
        <ExtendedLine />
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={({item}) => (
              <ProductItem
                product={item}
                navigation={navigation}
                category={category}
                role={role}
                sid={sid}
                phone={phone}
                refreshProducts={fetchUserData}
              />
            )}
            scrollEnabled
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.emptyCategoryContainer}>
            <Text style={styles.goText}>Empty Category</Text>
            {/*// @ts-ignore*/}
            <Text style={styles.goText2}>Try Again Later</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyCategoryContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: WINDOW_WIDTH,
    backgroundColor: Colors.featuredEventsColor,
  },
  headerStyles: {
    ...MasterStyles.BottomBorderRadius,
    borderWidth: 0.3,
    borderColor: Colors.charcoalGrey,
    backgroundColor: Colors.white,
  },
  eventsView: {
    backgroundColor: Colors.white,
    ...MasterStyles.body,
  },
  allCategoryView: {
    height: '100%',
    //padding: 3,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    ...boldText,
    marginVertical: 12,
    textAlign: 'center',
  },
  groupTextStyles: {
    ...MasterStyles.body,
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

export default ProductScreen;
