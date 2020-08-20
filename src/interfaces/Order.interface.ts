import {IOrderItem} from './OrderItem.Interface';
import {IAddress} from './User.Interface';
export interface IOrder {
  sid: string;
  name: string;
  userPhone: string;
  phone: string;
  shippingAddress: string;
  modeOfPayment: string;
  orderNumber: string;
  orderSTATUS: string;
  totalPrice: number;
  orderItems: IOrderItem[];
  transactionId?: number;
  address?: Partial<IAddress>;
}
