import React from 'react';
import {View} from 'react-native';
import Colors from '../constants/Colors';

/*
  Use this component where you need to put a border line that extends outside the container.
 */

const ExtendedLine = style => <View style={[styles.container, style]} />;

const styles = {
  container: {
    height: 1,
    backgroundColor: Colors.gray,
    marginHorizontal: -100,
  },
};
export default ExtendedLine;
