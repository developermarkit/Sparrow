import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Switch,
} from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import RadioForm from 'react-native-simple-radio-button';
import React, {useState} from 'react';
import {ProgressDialog} from 'react-native-simple-dialogs';
import ExtendedLine from '../components/ExtendedLine';
import ThemeTextInput from '../components/ThemeTextInput';
import Colors from '../constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  EDeliveryType,
  EModeOfPayment,
  EShopCategory,
  EShopStatus,
} from '../constants/Enums';
import {IShop} from '../interfaces/Shop.Interface';
import {db, storage} from '../firebase.config';
import {ScreenNames} from '../constants/ScreenNames';
import ImagePicker from 'react-native-image-picker';
import {useSelector} from 'react-redux';
// @ts-ignore
import CameraIcon from '../assets/camera.svg';
import ThemeNumberInput from '../components/ThemeNumberInput';
import {boldText} from '../constants/MasterStyles';
import {ICategory} from '../interfaces/Category.interface';
import ThemeButtonGrayDisabled from '../components/ThemeButtonGrayDisabled';
import ThemeButton from '../components/ThemeButton';

const SellerSignupScreen = ({navigation}) => {
  const user = useSelector(state => state.userDetails);
  const phoneNumber = useSelector(state => state.phoneNumber);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [percent, setPercent] = useState(-1);
  const [loader, setLoader] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [modeOfPayment, setModeOfPayment] = useState(EModeOfPayment.CASH);
  const [phone, setPhone] = useState(phoneNumber.substring(3, 13));
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [sid, setSid] = useState('');
  const [ownerName, setOwnerName] = useState(user.name);
  const [ownerPhone, setOwnerPhone] = useState(phoneNumber.substring(3, 13));
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');
  const [shopCategory, setShopCategory] = useState(EShopCategory.GENERAL_STORE);
  const [bankName, setBankName] = useState('');
  const [IFSC, setIFCS] = useState('');
  const [upi, setUpi] = useState('');
  const [gettingPassword, getPassword] = useState(false);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeValid, setISValid] = useState(true);
  const [gettingSid, setGettingSid] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deliveryType, setDeliveryType] = useState(EDeliveryType.SELF);
  const status = EShopStatus.COMING_SOON;
  const rating = 3;
  const [showcase, setShowCase] = useState(false);
  const [isSingleCategoryShop, setIsSingleCategoryShop] = useState(false);
  const toggleSwitch = () => setShowCase(previousState => !previousState);
  const toggleSwitchSingleCategoryShop = () =>
    setIsSingleCategoryShop(previousState1 => !previousState1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const radio_props = [
    {label: EModeOfPayment.CASH, value: 1},
    {label: EModeOfPayment.ANY, value: 0},
  ];

  const checkValidity = async (id: string): Promise<boolean> => {
    setLoader(true);
    if (id.length < 4) {
      setISValid(false);
      setLoader(false);
      return false;
    }

    const shop = db.ref('/shops').child(id);
    let validity = false;
    setLoader(true);
    await shop.once('value', s => {
      if (s.val()) {
        validity = false;
      } else {
        validity = true;
      }
      console.log('v', s.val(), validity);
      setISValid(validity);
      setLoader(false);
    });
    validity && getPassword(true);
    setLoader(false);
    return validity;
  };
  let onSelectImage = () => {
    const options = {
      noData: true,
      maxWidth: 200,
      maxHeight: 200,
      aspectRatio: 1,
    };
    ImagePicker.launchImageLibrary(options, async response => {
      let task;
      const storageRef = storage.ref();
      const id = Date.now();
      if (response.uri) {
        fetch(response.uri)
          .then(res => res.blob())
          .then(async blob => {
            setLoader(true);
            task = storageRef
              .child(`/ShopImages/${id}.jpg`)
              .put(blob)
              .then(snapshot => {
                console.log(
                  snapshot.bytesTransferred,
                  '/',
                  snapshot.totalBytes,
                  snapshot.bytesTransferred / snapshot.totalBytes,
                );
                storageRef
                  .child(`/ShopImages/${id}.jpg`)
                  .getDownloadURL()
                  .then(url => {
                    setLoader(false);
                    setImageUrl(url);
                    setPercent(-1);
                  })
                  .catch(() => {
                    storageRef
                      .child(`/ShopImages/${id}_200x200.jpg`)
                      .getDownloadURL()
                      .then(url => {
                        setLoader(false);
                        console.log('url', url);
                        setImageUrl(url);
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

  const onSave = () => {
    console.log('>>>>>', sid, isCodeValid);
    checkValidity(sid.toUpperCase()).then(v => {
      if (v) {
        // setLoader(true);
        console.log(imageUrl);
        if (isCodeValid) {
          const shop: IShop = {
            sid: sid.toUpperCase(),
            deliveryType,
            image: imageUrl || '',
            name,
            phone: `+91${phoneNumber}`,
            rating: rating || 3,
            status: status || EShopStatus.COMING_SOON,
            showcase: showcase || false,
            address: `${address},${city},${pin}`,
            ownerName,
            firmName,
            email,
            bankName: bankName || '',
            IFSC: IFSC || '',
            upi: upi || '',
            shopCategory,
            agentID: 5689945366,
            agentScore: 3,
            commissionPercent: 5,
            modeOfPayment,
            ownerPhone: `+91${ownerPhone}`,
            isSingleCategoryShop,
          };
          setLoader(true);
          db.ref('/shops')
            .child(sid.toUpperCase())
            .update(shop)
            .then(() => {
              db.ref('/Users')
                .child(phoneNumber)
                .child('shops')
                .child(sid.toUpperCase())
                .set(password)
                .then(() => {
                  if (isSingleCategoryShop) {
                    const category: ICategory = {
                      cid: `${Date.now()}`,
                      image: '',
                      name: name,
                      pids: [],
                    };
                    db.ref('/categories')
                      .child(sid.toUpperCase())
                      .child(category.cid)
                      .update(category);
                  }
                  setLoader(false);
                  navigation.navigate(ScreenNames.ShopCodeScreen);
                });
            });
        }
      }
    });
  };

  return (
    <>
      {/*// @ts-ignore*/}
      <ProgressDialog visible={loader} message="Please, wait..." />
      <ScrollView style={styles.parentContainer}>
        {/*// @ts-ignore*/}
        <Text style={styles.title}>New Shop Signup</Text>
        <ExtendedLine />
        {!gettingSid ? (
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{
                  uri: imageUrl
                    ? imageUrl
                        .replace('_200x200', '')
                        .replace('.jpg', '_200x200.jpg')
                    : '',
                }}
              />
              <View style={styles.addImage}>
                <TouchableOpacity onPress={onSelectImage}>
                  <CameraIcon height={30} width={30} fill={Colors.black} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cont}>
              <Text style={styles.subheadings}>Shop Details</Text>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Shop's Display Name (required)</Text>
                <ThemeTextInput
                  onChangeText={n => setName(n)}
                  placeholder="ABC Shop"
                  value={name}
                />
              </View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>
                  Phone Number (without code +91)
                </Text>
                <ThemeNumberInput
                  onChangeText={p => setPhone(p)}
                  placeholder="9797123456"
                  value={phone}
                  maxLength={10}
                  keyboard={'number-pad'}
                />
              </View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Firm Name (required)</Text>
                <ThemeTextInput
                  onChangeText={n => setFirmName(n)}
                  placeholder="White Enterprises"
                  value={firmName}
                />
              </View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Shop Address (required)</Text>
                <ThemeTextInput
                  onChangeText={a => setAddress(a)}
                  placeholder="Ghaziabad"
                  value={address}
                />
                <ThemeTextInput
                  onChangeText={a => setCity(a)}
                  placeholder="City"
                  value={city}
                />
                <ThemeNumberInput
                  onChangeText={a => setPin(a)}
                  placeholder="Pin code"
                  value={pin}
                  keyboard={'number-pad'}
                />
              </View>

              <View>
                <View style={styles.horizontal}>
                  <Text style={styles.labelHorizontal}>Shop Category:</Text>
                  <DropDownPicker
                    items={[
                      {
                        label: EShopCategory.GENERAL_STORE,
                        value: EShopCategory.GENERAL_STORE,
                      },
                      {label: EShopCategory.DAIRY, value: EShopCategory.DAIRY},
                      {
                        label: EShopCategory.MEDICAL_SHOP,
                        value: EShopCategory.MEDICAL_SHOP,
                      },
                      {
                        label: EShopCategory.SUPPLEMENT_STORE,
                        value: EShopCategory.SUPPLEMENT_STORE,
                      },
                    ]}
                    // @ts-ignore
                    defaultIndex={0}
                    containerStyle={{height: 40, width: 180}}
                    onChangeItem={item => {
                      setShopCategory(item.value);
                      console.log(shopCategory);
                    }}
                  />
                </View>
              </View>
              {/*<View>*/}
              {/*  <View style={styles.horizontal}>*/}
              {/*    <Text style={styles.labelHorizontal}>Delivery Type:</Text>*/}
              {/*    <DropDownPicker*/}
              {/*      items={[*/}
              {/*        {label: EDeliveryType.SELF, value: EDeliveryType.SELF},*/}
              {/*        {*/}
              {/*          label: EDeliveryType.TAKE_AWAY,*/}
              {/*          value: EDeliveryType.TAKE_AWAY,*/}
              {/*        },*/}
              {/*      ]}*/}
              {/*      defaultLabel={EDeliveryType.MarkIT}*/}
              {/*      defaultIndex={0}*/}
              {/*      containerStyle={{height: 40, width: 180}}*/}
              {/*      onChangeItem={item => setDeliveryType(item.value)}*/}
              {/*    />*/}
              {/*  </View>*/}
              {/*</View>*/}
              <View style={styles.horizontal}>
                <View style={styles.vertical}>
                  <Text style={styles.labelHorizontal}>
                    Shop for Showcasing only :
                  </Text>
                  <Text style={styles.smallText}>
                    (Note: if you enable this option your shop will lose access
                    from selling and buying products)
                  </Text>
                </View>
                <Switch
                  trackColor={{false: '#767577', true: '#ada8a8'}}
                  thumbColor={showcase ? Colors.primaryColor : Colors.gray}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={showcase}
                />
              </View>
              <View style={styles.horizontal}>
                <View style={styles.vertical}>
                  <Text style={styles.labelHorizontal}>
                    Single Category Shop :
                  </Text>
                  <Text style={styles.smallText}>
                    (Note: if you enable this option your shop will have no
                    category ie only products will be shown)
                  </Text>
                </View>
                <Switch
                  trackColor={{false: '#767577', true: '#ada8a8'}}
                  thumbColor={
                    isSingleCategoryShop ? Colors.primaryColor : Colors.gray
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitchSingleCategoryShop}
                  value={isSingleCategoryShop}
                />
              </View>
              <ExtendedLine />

              <Text style={styles.subheadings}>Shop Owner Details</Text>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Owner Name (required)</Text>
                <ThemeTextInput
                  onChangeText={n => setOwnerName(n)}
                  placeholder="Walter White"
                  value={ownerName}
                />
              </View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>
                  Owner's phone Number (required)
                </Text>
                <ThemeNumberInput
                  onChangeText={n => setOwnerPhone(n)}
                  placeholder="9898234512"
                  value={ownerPhone}
                  maxLength={10}
                  keyboard={'number-pad'}
                />
              </View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Email ID (required)</Text>
                <ThemeTextInput
                  onChangeText={n => setEmail(n)}
                  placeholder="walter7white@gmail.com"
                  value={email}
                />
              </View>

              <ExtendedLine />
              <Text style={styles.subheadings}>Bank Details</Text>
              <ExtendedLine />
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Bank Name</Text>
                <ThemeTextInput
                  onChangeText={n => setBankName(n)}
                  placeholder="myCity Bank"
                  value={bankName}
                />
              </View>

              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>IFSC code</Text>
                <ThemeTextInput
                  onChangeText={n => setIFCS(n)}
                  placeholder="ABC Shop"
                  value={IFSC}
                />
              </View>
              <View style={styles.formContainer}>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>UPI Number</Text>
                <ThemeTextInput
                  onChangeText={n => setUpi(n)}
                  placeholder="ABC Shop"
                  value={upi}
                />
              </View>

              <ExtendedLine />
              {/*<Text style={styles.subheadings}>Preferred Mode of Payment:</Text>*/}
              {/*<RadioForm*/}
              {/*  radio_props={radio_props}*/}
              {/*  formHorizontal={true}*/}
              {/*  style={{paddingVertical: 10, justifyContent: 'space-around'}}*/}
              {/*  labelHorizontal={true}*/}
              {/*  initial={0}*/}
              {/*  onPress={value => {*/}
              {/*    setModeOfPayment(*/}
              {/*      value ? EModeOfPayment.CASH : EModeOfPayment.ANY,*/}
              {/*    );*/}
              {/*    return !value;*/}
              {/*  }}*/}
              {/*/>*/}
              <View style={styles.actionBar}>
                {name &&
                address &&
                city &&
                pin &&
                phone &&
                firmName &&
                email &&
                ownerPhone &&
                ownerName ? (
                  <ThemeButton
                    title={'Continue'}
                    onPress={() => setGettingSid(true)}
                  />
                ) : (
                  <ThemeButtonGrayDisabled
                    title={'Continue'}
                    onPress={() =>
                      alert('Please fill all the required details')
                    }
                  />
                )}
              </View>
            </View>
          </View>
        ) : (
          <View>
            {/*// @ts-ignore*/}
            <Text style={styles.label}>
              Select a Shop ID That you will be able to share with your
              customers. It will be used to find your shop
            </Text>
            <ThemeTextInput
              onChangeText={c => !gettingPassword && setSid(c)}
              placeholder="AbcStore21"
              value={sid}
            />
            {gettingPassword && (
              <View>
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Create a Password</Text>
                <ThemeTextInput
                  onChangeText={c => {
                    setPassword(c);
                  }}
                  placeholder="*******"
                  value={password}
                />
                {/*// @ts-ignore*/}
                <Text style={styles.label}>Confirm Password</Text>
                <ThemeTextInput
                  onChangeText={c => {
                    setConfirmPassword(c);
                  }}
                  placeholder="*******"
                  value={confirmPassword}
                />
              </View>
            )}
            <View>
              <Text
                style={
                  isCodeValid ? styles.errorTextHidden : styles.errorTextVisible
                }>
                This Id is not available, try again
              </Text>
            </View>
            <View style={styles.actionBar}>
              {sid ? (
                <ThemeButton
                  onPress={() =>
                    gettingPassword
                      ? password && password === confirmPassword
                        ? onSave()
                        : alert('passwords do not match')
                      : checkValidity(sid)
                  }
                  title={gettingPassword ? 'Create Shop' : 'Check Availability'}
                />
              ) : (
                <ThemeButtonGrayDisabled
                  title={'Check Availability'}
                  onPress={() => console.log('hello')}
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const imageRadius = 70;

const styles = StyleSheet.create({
  cont: {
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: Colors.white,
    // shadowOffset: {width: 0, height: -5},
    // shadowColor: Colors.primaryColorDark,
    // shadowOpacity: 0.3,
    elevation: 10,
    paddingTop: 15,
  },
  parentContainer: {
    backgroundColor: Colors.white,
  },
  smallText: {
    fontSize: 11,
    paddingHorizontal: 6,
  },
  formContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  horizontal: {
    paddingVertical: 10,
    marginBottom: 5,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    width: '65%',
  },
  title: {
    padding: 10,
    alignSelf: 'center',
    ...boldText,
    fontSize: 18,
    color: Colors.charcoalGrey80,
    fontFamily: 'Nunito-Light',
  },
  subheadings: {
    alignSelf: 'center',
    color: Colors.primaryColorDark,
    fontSize: 17,
    padding: 10,
    fontWeight: 'bold',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Colors.accentColorRGBA,
  },
  actionBar: {
    marginVertical: 20,
    marginHorizontal: 100,
    padding: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 20,
    margin: 5,
  },
  inactive: {
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.charcoalGrey,
    borderWidth: 3,
    padding: 5,
  },
  active: {
    alignItems: 'center',
    borderRadius: 5,
    borderColor: Colors.primaryColorDark,
    borderWidth: 3,
    padding: 5,
  },
  image: {
    height: imageRadius * 2,
    width: imageRadius * 2,
    borderRadius: imageRadius,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
  },
  label: {
    marginTop: 10,
    paddingHorizontal: 8,
    color: Colors.charcoalGreyMediocre,
    ...boldText,
  },
  labelHorizontal: {
    marginHorizontal: 5,
    color: Colors.primaryColorDark,
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorTextVisible: {
    color: Colors.red,
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
  },
  errorTextHidden: {
    color: Colors.white,
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
    marginBottom: 15,
  },
  imageContainer: {
    paddingVertical: 20,
  },
  addImage: {
    position: 'absolute',
    right: 40,
    bottom: 60,
    padding: 15,
    borderRadius: 30,
    backgroundColor: Colors.lightgray,
  },
});

export default SellerSignupScreen;
