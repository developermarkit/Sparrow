import {Image, StyleSheet, Text, View} from 'react-native';
import Colors from '../constants/Colors';
import ExtendedLine from '../components/ExtendedLine';
import ThemeButton from '../components/ThemeButton';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {ICategory} from '../interfaces/Category.interface';
import ThemeTextInput from '../components/ThemeTextInput';
import * as MasterStyles from '../constants/MasterStyles';
import ImagePicker from 'react-native-image-picker';
import ThemeButtonGray from '../components/ThemeButtonGray';
import {ProgressDialog} from 'react-native-simple-dialogs';
import {useSelector} from 'react-redux';
import Header from '../components/Header';
import storage from '@react-native-firebase/storage';

const CreateCategoryScreen = ({navigation, route}) => {
  const [value, onChangeText] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const [percent, setPercent] = useState(-1);
  const [loader, setLoader] = useState(false);
  const [categoryId, setCategoryId] = useState();
  const [pidArray, setPids] = useState([]);
  const role = useSelector(state => state.role);
  let category: ICategory;
  const c: ICategory = route && route.params;
  const sid = useSelector(state => state.sid);
  const fetchUserData = async () => {
    if (c) {
      // @ts-ignore
      setCategoryId(c.cid);
      onChangeText(c.name);
      setImageUrl(c.image);
      setPids(c.pids);
    }
  };

  useEffect(() => {
    fetchUserData();
    return navigation.addListener('focus', async () => {
      fetchUserData();
    });
  }, [navigation]);

  let onSelectImage = () => {
    setLoader(true);
    const options = {
      noData: true,
      maxWidth: 200,
      maxHeight: 200,
      aspectRatio: 1,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      let task;
      const storageRef = storage().ref().child(sid);
      const name = Date.now();
      if (response.uri) {
        fetch(response.uri)
          .then(res => res.blob())
          .then(async blob => {
            setLoader(true);
            task = storageRef
              .child(`/categories/${name}.jpg`)
              .put(blob)
              .then(snapshot => {
                console.log(
                  snapshot.bytesTransferred,
                  '/',
                  snapshot.totalBytes,
                  snapshot.bytesTransferred / snapshot.totalBytes,
                );
                storageRef
                  .child(`/categories/${name}.jpg`)
                  .getDownloadURL()
                  .then(url => {
                    console.log('url', url);
                    setImageUrl(url);
                    setLoader(false);
                    setPercent(-1);
                  })
                  .catch(() => {
                    storageRef
                      .child(`/categories/${name}_200x200.jpg`)
                      .getDownloadURL()
                      .then(url => {
                        console.log('url', url);
                        setImageUrl(url);
                        setLoader(false);
                        setPercent(-1);
                      });
                  });
              })
              .catch(error => {
                if (error) {
                  alert("Can't pick the Image at the moment, Try again Later");
                }
              });
            task.on('state_changed', snapshot => {
              setPercent(
                Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                ),
              );
            });
          });
      }
      setLoader(false);
    });
  };

  let onSave = () => {
    if (value === '') {
      alert('enter the name');
    } else if (imageUrl === undefined) {
      alert('select an Image');
    } else {
      setLoader(true);
      const cid = categoryId || `${Date.now()}`;
      const categoryRef = database().ref('/categories').child(sid);

      category = {
        cid,
        image: imageUrl,
        name: value,
        pids: pidArray ? pidArray : [],
      };
      JSON.parse(JSON.stringify(category));
      categoryRef
        .child(cid)
        .update(category)
        .then(() => {
          setLoader(false);
          navigation.goBack();
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
      <View style={styles.container}>
        <Header
          title={categoryId ? 'Update Category' : 'Create a new Category'}
          navigation={navigation}
          role={role}
        />
        <ExtendedLine />
        <View style={styles.verticalContainer}>
          <Text style={styles.text}>
            Enter name of category and select Image to show
          </Text>
          <View style={styles.horizontal}>
            <View style={styles.verticalContainer}>
              <ThemeTextInput
                placeholder="Name of Category"
                value={value}
                onChangeText={text => onChangeText(text)}
              />
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
                  ? imageUrl
                      .replace('_200x200', '')
                      .replace('.jpg', '_200x200.jpg')
                  : '',
              }}
            />
          </View>
          <View style={styles.horizontal}>
            <View style={styles.fullwidth}>
              <ThemeButtonGray
                title="cancel"
                onPress={onCancel}
                textUpperCase
              />
            </View>
            <View style={styles.fullwidth}>
              <ThemeButton title="save" onPress={onSave} textUpperCase />
            </View>
          </View>
          {percent >= 0 ? (
            <Text
              style={
                styles.uploadingText
              }>{`Uploading image... ${percent}%`}</Text>
          ) : null}
        </View>
      </View>
    </>
  );
};
export default CreateCategoryScreen;

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
  },
  fullwidth: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  verticalContainer: {
    padding: 5,
    flex: 1,
  },
  title: {
    ...MasterStyles.heading2,
    ...MasterStyles.boldText,
    textAlign: 'center',
    padding: 5,
  },
  text: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  thumbnail: {
    height: 100,
    width: 100,
    backgroundColor: Colors.gray,
    resizeMode: 'stretch',
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
});
