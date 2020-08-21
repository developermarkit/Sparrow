import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
// @ts-ignore
import PencilIcon from '../assets/pencil.svg';
import database from '@react-native-firebase/database';
// @ts-ignore
import DeleteIcon from '../assets/delete.svg';
import {ScreenNames} from '../constants/ScreenNames';
import {useSelector} from 'react-redux';
import ConfirmDialog from '../utils/ConfirmDialog';

const CategoryEditBar = ({navigation, category, refreshCategories}) => {
  const sid = useSelector(state => state.sid);

  const onCategoryEdit = () => {
    navigation.navigate(ScreenNames.ShoppingScreen, {
      screen: ScreenNames.CreateCategoryScreen,
      params: category,
    });
  };

  const onCategoryDelete = async () => {
    for (const key in category.pids) {
      console.log(`${category.pids[key]}`);
      database().ref('/products')
        .child(category.pids[key])
        .remove()
        .then(() => {
          console.log('Product Deleted!');
        })
        .catch(() => {
          alert('Unable to delete the Product at the moment,try again later.');
        });
    }
    await database()
      .ref(`/categories/${sid}`)
      .child(category.cid)
      .remove()
      .then(() => {
        console.log('Category Deleted!');
        refreshCategories();
      })
      .catch(() => {
        alert('Unable to delete the Product at the moment,try again later.');
      });
  };

  return category ? (
    <View style={styles.container}>
      <TouchableOpacity style={styles.image} onPress={onCategoryEdit}>
        <PencilIcon height={20} width={20} fill={Colors.black} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.image}
        onPress={() => {
          ConfirmDialog(
            'Delete Category',
            'This Category and all the containing products will be deleted, Are you sure to delete?',
            onCategoryDelete,
            () => {
              console.log('cancel Pressed');
            },
          );
        }}>
        <DeleteIcon height={20} width={20} fill={Colors.black} />
      </TouchableOpacity>
    </View>
  ) : (
    // @ts-ignore
    <Text title={'Error: 404'} />
  );
};
export default CategoryEditBar;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.cloudyWhite70,
    padding: 5,
  },
  image: {
    flex: 1,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
