import {AsyncStorage} from 'react-native';
import {IStorage} from '../interfaces/Storage.interface';

const AsyncStorageActions = {
  getPhone: async () => {
    return AsyncStorage.getItem('phone');
  },

  getRole: async () => {
    return AsyncStorage.getItem('role');
  },

  getSid: async () => {
    return AsyncStorage.getItem('sid');
  },

  getUserDetails: async () => {
    return JSON.parse(await AsyncStorage.getItem('userDetails'));
  },

  getShopDetails: async () => {
    return JSON.parse(await AsyncStorage.getItem('shopDetails'));
  },

  getData: async (): Promise<Partial<IStorage>> => {
    return JSON.parse(await AsyncStorage.getItem('data'));
  },

  setData: async (data: Partial<IStorage>) => {
    const d: IStorage = JSON.parse(await AsyncStorage.getItem('data'));
    if (data.sid) {
      d.sid = data.sid;
    }
    if (data.role) {
      d.role = data.role;
    }
    if (data.phone) {
      d.phone = data.phone;
    }
    if (data.userDetails) {
      d.userDetails = data.userDetails;
    }
    console.log('setting data', JSON.stringify(d));
    AsyncStorage.setItem('data', JSON.stringify(d));
  },
};

export default AsyncStorageActions;
