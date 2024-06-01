import { OrderStatus } from "../../enums/order-status";
import { Product } from "../products/product.model";

export interface Order {
  id?: number;
  requestDate: Date | string;
  totalPrice: number;
  status: OrderStatus;
  requesterId: number;
  products: Product[];
}
