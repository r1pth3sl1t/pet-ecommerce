import { CartItem } from "./cart-item";

export class OrderItem {
  imageUrl: string;
  unitPrice: number;
  totalQuantity: number;
  productId: number;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.unitPrice = cartItem.unitPrice;
    this.productId = cartItem.id;
    this.totalQuantity = cartItem.quantity;
  }
}
