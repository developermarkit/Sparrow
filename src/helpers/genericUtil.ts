import {Dimensions} from 'react-native';

import _ from 'lodash';

const {width, height} = Dimensions.get('window');

class GenericUtil {
  static getDimension() {
    return {width, height};
  }

  static getFormattedPrice(price) {
    return `${price}`
      .replace(/\D/g, '')
      .replace(/(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g, '$1,');
  }

  static isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static isEmptyArray(arr) {
    return !arr || arr.length === 0;
  }

  static getDeepCopy(obj) {
    return _.cloneDeep(obj);
  }
}

export default GenericUtil;
