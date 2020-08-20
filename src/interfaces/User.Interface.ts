export interface IUser {
  name: string;
  imageUrl: string;
  address: string;
  city: string;
  pin: number;
  role: string;
  shops?: any;
}

export interface IAddress {
  address: string;
  city: string;
  pin: string;
}
