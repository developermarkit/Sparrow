import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

interface IThemeTextInput {
  onChangeText: any;
  placeholder: string;
  value: string;
  keyboard?: string;
  maxLength?: number;
}

const ThemeTextInput = (props: IThemeTextInput) => {
  const {onChangeText, placeholder, value, maxLength, keyboard} = props;
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        numberOfLines={1}
        // @ts-ignore
        keyboardType={keyboard}
        maxLength={maxLength}
      />
    </View>
  );
};
export default ThemeTextInput;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    paddingLeft: 5,
    borderRadius: 5,
    borderColor: Colors.primaryColorDark,
    borderBottomWidth: 1.5,
    overflow: 'hidden',
  },
  textInput: {
    paddingHorizontal: 2,
    paddingBottom: 0,
    paddingTop: 12,
    fontSize: 17,
    fontFamily: 'Nunito-Regular',
  },
});
