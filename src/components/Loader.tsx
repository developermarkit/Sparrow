import {ActivityIndicator} from 'react-native';
import React from 'react';

const Loader = isLoading => {
  // @ts-ignore
  return <ActivityIndicator size="large" animate={isLoading} />;
};

export default Loader;
