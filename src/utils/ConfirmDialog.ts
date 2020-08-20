import React from 'react';
import {Alert} from 'react-native';

const ConfirmDialog = (title, message, onConfirmPressed, onCancelPressed) =>
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: onCancelPressed,
        style: 'cancel',
      },
      {text: 'Confirm', onPress: onConfirmPressed},
    ],
    {cancelable: false},
  );

export default ConfirmDialog;
