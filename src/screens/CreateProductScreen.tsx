import {View, Text, StyleSheet, Image, Switch} from 'react-native';
import React, {useState} from 'react';
import Colors from '../constants/Colors';
import ExtendedLine from '../components/ExtendedLine';
import ThemeButton from '../components/ThemeButton';
import {db} from '../firebase.config';
import {EProductStatus} from '../constants/Enums';
import {IProduct} from '../interfaces/Product.interface';
import ThemeTextInput from '../components/ThemeTextInput';
import ImagePicker from 'react-native-image-picker';
import * as MasterStyles from '../constants/MasterStyles';
import {ProgressDialog} from 'react-native-simple-dialogs';
import ThemeButtonGray from '../components/ThemeButtonGray';
import {useSelector} from 'react-redux';
import ThemeNumberInput from '../components/ThemeNumberInput';
import Header from '../components/Header';
import {ScreenNames} from '../constants/ScreenNames';
import toast from '../components/toast';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const CreateProductScreen = ({navigation, route}) => {
  const sid = useSelector(state => state.sid);
  const role = useSelector(state => state.role);
  const [imageUrl, setImageUrl] = useState();
  const [loader, setLoader] = useState(false);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [percent, setPercent] = useState(-1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [productId, setProductId] = useState();
  let product: Partial<IProduct>;
  const p: IProduct = route && route.params;
  console.log('previous product details');
  console.log(p);
  console.log(isAvailable);

  const toggleSwitch = () => setIsAvailable(previousState => !previousState);

  const fetchUserData = async () => {
    if (p) {
      // @ts-ignore
      setProductId(p.pid);
      setName(p.name);
      // @ts-ignore
      setPrice(p.price);
      setStock(p.stock);
      setDescription(p.description);
      setIsAvailable(p.isAvailable);
      // @ts-ignore
      setImageUrl(p.image);
    }
  };

  React.useEffect(() => {
    fetchUserData();
    return navigation.addListener('focus', async () => {
      fetchUserData();
    });
  }, [navigation]);

  let onSelectImage = () => {
    // setLoader(true);
    // const options = {
    //   noData: true,
    //   maxWidth: 500,
    //   maxHeight: 500,
    //   aspectRatio: 1,
    // };
    // ImagePicker.launchImageLibrary(options, async response => {
    //   let task;
    //   const storageRef = storage().ref().child(sid);
    //   const name = Date.now();
    //   if (response.uri) {
    //     fetch(response.uri)
    //       .then(res => res.blob())
    //       .then(async blob => {
    //         setLoader(true);
    //         task = storageRef
    //           .child(`/Product Images/${name}.jpg`)
    //           .put(blob)
    //           .then(snapshot => {
    //             console.log(
    //               snapshot.bytesTransferred,
    //               '/',
    //               snapshot.totalBytes,
    //               snapshot.bytesTransferred / snapshot.totalBytes,
    //             );
    //             storageRef
    //               .child(`/Product Images/${name}.jpg`)
    //               .getDownloadURL()
    //               .then(url => {
    //                 setImageUrl(url);
    //                 setLoader(false);
    //                 setPercent(-1);
    //               })
    //               .catch(() => {
    //                 storageRef
    //                   .child(`/Product Images/${name}_200x200.jpg`)
    //                   .getDownloadURL()
    //                   .then(url => {
    //                     setImageUrl(url);
    //                     setLoader(false);
    //                     setPercent(-1);
    //                   });
    //               });
    //           })
    //           .catch(error => {
    //             if (error) {
    //               alert("Can't pick the Image at the moment, Try again Later");
    //             }
    //           });

    //         task.on('state_changed', snapshot => {
    //           setPercent(
    //             Math.round(
    //               (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
    //             ),
    //           );
    //         });
    //       });
    //   }
    //   setLoader(false);
    // });
  };

  let category =
    route && route.params && route.params.category
      ? route.params.category
      : undefined;

  if (typeof category === 'object') {
    category = category.cid;
  }
  console.log('category details from param');
  console.log(category);

  const onSave = () => {
    if (!name || !description || !price || !stock) {
      alert('Please Enter all the Details');
    } else {
      setLoader(true);
      const productRef = database().ref('/products');
      const categoryPids = category
        ? database()
            .ref('/categories')
            .child(sid)
            .child(category)
            .child('pids')
        : [];

      const mPid = `${-1 * Date.now()}`;

      product = {
        pid: productId ? productId : mPid,
        category: category,
        description: description,
        image: imageUrl || '',
        name: name,
        // @ts-ignore
        price: price,
        isAvailable: isAvailable ? isAvailable : false,
        stock: stock,
        status:
          isAvailable && stock > 0
            ? EProductStatus.AVAILABLE
            : EProductStatus.OUT_OF_STOCK,
      };

      productRef
        .child(productId || mPid)
        .update(product)
        .then(() => {
          if (!productId) {
            categoryPids.push(mPid);
          }
          setLoader(false);
          toast('Product Added!');
          navigation.navigate(ScreenNames.CategoryScreen);
        });
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <>
      {/*// @ts-ignore*/}
      <ProgressDialog visible={loader} message="Please, wait..." />
      <View style={{backgroundColor: Colors.white}}>
        <Header
          title={productId ? 'Update Item Details' : 'Add a new Item'}
          navigation={navigation}
          role={role}
          key={Date.now()}
        />
      </View>

      <ExtendedLine />
      <View style={styles.container}>
        <View style={styles.vertical}>
          <Text style={styles.label}>Product Name:</Text>
          <ThemeTextInput
            onChangeText={n => setName(n)}
            placeholder="Product Name"
            value={name}
          />

          <View style={styles.horizontal}>
            <Text style={styles.label}>Price:</Text>
            <ThemeNumberInput
              onChangeText={p => setPrice(p)}
              placeholder="Product Price"
              value={price}
              keyboard={'number-pad'}
            />
          </View>
          <View style={styles.horizontal}>
            <Text style={styles.label}>Stock:</Text>
            <ThemeNumberInput
              onChangeText={s => setStock(s)}
              placeholder="Product Stock"
              // @ts-ignore
              value={stock}
              keyboard={'number-pad'}
            />
          </View>
          <Text style={styles.label}>Description:</Text>
          <View style={{marginBottom: 20}}>
            <ThemeTextInput
              onChangeText={d => setDescription(d)}
              placeholder="Product Description"
              value={description}
            />
          </View>

          <View style={styles.horizontal}>
            <View style={styles.verticalContainer}>
              <ThemeButton
                title="Select Image"
                onPress={onSelectImage}
                textUpperCase={false}
              />
            </View>
            <Image
              style={styles.thumbnail}
              source={{
                uri: imageUrl
                  ? // @ts-ignore
                    imageUrl
                      .replace('_200x200', '')
                      .replace('.jpg', '_200x200.jpg')
                  : '',
              }}
            />
          </View>
          <View style={styles.horizontal}>
            <Text style={styles.label2}>Product Available :</Text>
            <Switch
              trackColor={{false: '#767577', true: '#ada8a8'}}
              thumbColor={isAvailable ? Colors.primaryColor : Colors.gray}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isAvailable}
            />
          </View>
          <View style={styles.buttonBar}>
            <ThemeButtonGray title="cancel" onPress={onCancel} textUpperCase />
            <ThemeButton title="save" onPress={onSave} textUpperCase />
          </View>
        </View>
      </View>
    </>
  );
};
export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    paddingLeft: 5,
    borderColor: Colors.primaryColorDark,
    borderBottomWidth: 1.5,
    overflow: 'hidden',
  },
  textInput: {
    paddingHorizontal: 2,
    paddingBottom: 0,
    paddingTop: 12,
    fontSize: 17,
    fontFamily: 'Nunito-SemiBold',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    paddingTop: 20,
  },
  fullwidth: {
    flex: 1,
  },
  verticalContainer: {
    padding: 10,
    flex: 1,
  },
  title: {
    ...MasterStyles.heading2,
    ...MasterStyles.boldText,
    textAlign: 'center',
    padding: 5,
  },
  label: {
    paddingTop: 12,
    fontSize: 15,
    paddingHorizontal: 5,
  },
  label2: {
    fontSize: 15,
    paddingHorizontal: 5,
  },
  thumbnail: {
    height: 100,
    width: 100,
    backgroundColor: Colors.gray,
    resizeMode: 'cover',
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  uploadingText: {
    color: Colors.red,
    fontSize: 15,
    textAlign: 'left',
    padding: 5,
  },
  buttonBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
});
