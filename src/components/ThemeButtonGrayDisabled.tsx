import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import {boldText} from '../constants/MasterStyles';

interface IThemeButtonInput {
  title: string;
  onPress: any;
  textUpperCase?: boolean;
}

const ThemeButtonGrayDisabled = (props: IThemeButtonInput) => {
  const {title, onPress, textUpperCase} = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/*// @ts-ignore*/}
      <Text style={styles.button}>
        {textUpperCase ? title.toUpperCase() : title}
      </Text>
    </TouchableOpacity>
  );
};
export default ThemeButtonGrayDisabled;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray,
    padding: 5,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    ...boldText,
    color: Colors.white,
    fontSize: 18,
    padding: 3,
  },
});
