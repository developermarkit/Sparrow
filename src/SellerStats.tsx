import React from 'react';
import {Dimensions, StyleSheet, Text, View , Image, TouchableOpacity} from 'react-native';
const {height} = Dimensions.get('screen');

const SellerStats = () => {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text>GovindaV</Text>
        <TouchableOpacity onPress={()=>{
          alert('hello');
        }}>
        <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});

export default SellerStats;
