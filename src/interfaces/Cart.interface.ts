import {IProduct} from './Product.interface';

export interface ICart {
  pid: string;
  quantity: number;
  product?: Partial<IProduct>;
}
