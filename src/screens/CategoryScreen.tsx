import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as MasterStyles from '../constants/MasterStyles';
import {boldText} from '../constants/MasterStyles';
import Colors from '../constants/Colors';
import ExtendedLine from '../components/ExtendedLine';
import {db} from '../firebase.config';
import {EShopStatus} from '../constants/Enums';
import {ICategory} from '../interfaces/Category.interface';
import CategoryItem from '../components/CategoryItem';
import {useSelector} from 'react-redux';
import Header from '../components/Header';
import {NavigationEvents} from 'react-navigation';
import {ScreenNames} from '../constants/ScreenNames';
import database from '@react-native-firebase/database';

const WINDOW_WIDTH = Dimensions.get('window').width;

const CategoryScreen = ({navigation}) => {
  let categories: (ICategory | {isNew: boolean})[] = [];
  const [data, setData] = useState(categories);
  const sid = useSelector(state => state.sid);
  const role = useSelector(state => state.role);
  const shop = useSelector(state => state.shopDetails);
  const addNewCategory = () => {
    navigation.navigate(ScreenNames.ShoppingScreen, {
      screen: ScreenNames.CreateCategoryScreen,
      params: {},
    });
  };
  const setCategories = () => {
    if (sid) {
      const categoryRef = database().ref('/categories').child(sid);
      categoryRef
        .once('value', async snapshot => {
          let snap = await snapshot.val();
          categories = snap ? Object.values(snap) : [];
          setData(categories);
        })
        .then(() => {
          if (shop.isSingleCategoryShop) {
            navigation.navigate(ScreenNames.ShoppingScreen, {
              screen: ScreenNames.ProductScreen,
              params: {category: categories[0]},
            });
          }
        });
    }
  };
  const refreshCategories = () => {
    setCategories();
  };

  useEffect(() => {
    setCategories();
    return navigation.addListener('focus', async () => {
      setCategories();
    });
  }, [navigation]);

  return (
    <>
      {/*// @ts-ignore*/}
      <NavigationEvents onFocus={setCategories} />
      {/*// @ts-ignore*/}
      <View contentContainerStyle="center" style={styles.allCategoryView}>
        <Header
          navigation={navigation}
          title={'Product Categories'}
          role={role}
          addFunction={addNewCategory}
        />
        <ExtendedLine />
        {shop.status === EShopStatus.ACTIVE && !shop.isSingleCategoryShop ? (
          <>
            <FlatList
              data={data}
              renderItem={({item}) => (
                <CategoryItem
                  navigation={navigation}
                  category={item}
                  role={role}
                  refreshCategories={refreshCategories}
                />
              )}
              scrollEnabled
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={{backgroundColor: Colors.white}}
            />
          </>
        ) : (
          <View style={styles.comingSoonContainer}>
            <Image
              style={styles.image}
              source={{
                uri: 'https://img.icons8.com/clouds/100/000000/shop.png',
              }}
            />
            <Text style={styles.goText}>UNAVAILABLE</Text>
            {/*// @ts-ignore*/}
            <Text style={styles.goText2}>Coming Soon</Text>
          </View>
        )}
      </View>
    </>
  );
};
const imageRadius = 60;
const styles = StyleSheet.create({
  image: {
    height: imageRadius * 2,
    width: imageRadius * 2,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 3,
    marginBottom: 20,
  },
  comingSoonContainer: {
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
    backgroundColor: Colors.featuredEventsColor,
    ...MasterStyles.body,
  },
  allCategoryView: {
    paddingHorizontal: 0,
    height: '100%',
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

export default CategoryScreen;
