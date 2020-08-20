import {TouchableOpacity, Image, View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {heading3} from '../constants/MasterStyles';
import CategoryEditBar from './CategoryEditBar';
import Colors from '../constants/Colors';
import {EUserRole} from '../constants/Enums';
import * as Layout from '../constants/Layout';
// @ts-ignore
import PlusIcon from '../assets/plus.svg';
import {ScreenNames} from '../constants/ScreenNames';

const CategoryItem = ({category, navigation, role, refreshCategories}) => {
  return (
    <View style={styles.categoryCard}>
      {role !== EUserRole.USER && !category.isNew ? (
        <View style={styles.editBar}>
          <CategoryEditBar
            navigation={navigation}
            category={category}
            refreshCategories={refreshCategories}
          />
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          category.isNew
            ? navigation.navigate(ScreenNames.ShoppingScreen, {
                screen: ScreenNames.CreateCategoryScreen,
                params: {category},
              })
            : navigation.navigate(ScreenNames.ShoppingScreen, {
                screen: ScreenNames.ProductScreen,
                params: {category},
              })
        }>
        {category.isNew ? (
          <View style={styles.imgStyles}>
            <PlusIcon
              height={'80%'}
              width={'100%'}
              fill={Colors.charcoalGrey80}
            />
          </View>
        ) : (
          <Image
            style={styles.imgStyles}
            source={{
              uri: category.image
                ? category.image
                    .replace('_200x200', '')
                    .replace('.jpg', '_200x200.jpg')
                : '',
            }}
          />
        )}
        {category.isNew ? (
          <View style={styles.textContainer}>
            <Text style={styles.text}>Create New</Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{category.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const itemMargin = 13;
const aspectRatio = 6 / 5;
const width = Layout.default.window.width / 2 - itemMargin * 2;
const height = width / aspectRatio;

const styles = StyleSheet.create({
  categoryCard: {
    overflow: 'hidden',
    borderRadius: 7,
    width,
    height,
    marginVertical: 10,
    marginHorizontal: itemMargin,
    shadowColor: Colors.accentColor,
    shadowOpacity: 0.15,
    shadowOffset: {width: 3, height: 6},
    elevation: 15,
    display: 'flex',
    flexDirection: 'column',
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  text: {
    ...heading3,
    color: Colors.charcoalGrey80,
    textAlign: 'center',
    paddingBottom: 10,
    fontFamily: 'Nunito-ExtraBold',
  },
  textContainer: {
    minHeight: 40,
    fontSize: 30,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyles: {
    width: '100%',
    height: '80%',
    flexGrow: 1,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBar: {
    zIndex: 1,
  },
});

export default CategoryItem;
