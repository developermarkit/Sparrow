import {IUser} from './User.Interface';

export interface IStorage {
  userDetails: IUser;
  sid: string;
  phone: string;
  role: string;
}
