import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import * as MasterStyles from '../constants/MasterStyles';

interface IThemeButtonInput {
  title: string;
  onPress: any;
  textUpperCase?: boolean;
}

const ThemeButtonGreen = (props: IThemeButtonInput) => {
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
export default ThemeButtonGreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.toggleGreen,
    padding: 5,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    ...MasterStyles.boldText,
    fontSize:15,
    color: Colors.white,
    padding: 3,
  },
});
