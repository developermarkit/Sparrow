import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, View, StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {EUserRole} from './src/constants/Enums';
import store from './src/react-redux/store';
import AppNavigation from './src/react-navigation/NavigationContainer';
import {NavigationContainer} from '@react-navigation/native';
import Colors from './src/constants/Colors';

export let sid: string = '';
export let role: string = EUserRole.SELLER;

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={Colors.primaryColorStatusBar}
          translucent={true}
        />
        <NavigationContainer>
          <View
            style={
              Platform.OS === 'ios'
                ? styles.appContainerIOS
                : styles.appContainerAndroid
            }>
            <AppNavigation />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};
const styles = StyleSheet.create({
  appContainerAndroid: {
    paddingTop: 24,
    flex: 1,
  },
  appContainerIOS: {
    flex: 1,
  },
});
export default App;
