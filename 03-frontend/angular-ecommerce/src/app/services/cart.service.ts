import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;

      this.computeCartTotals();
    };
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(cartItem: CartItem) {

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = {} as CartItem;

    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);

    alreadyExistsInCart = (existingCartItem != undefined);
    console.log('exists: ' + alreadyExistsInCart);
    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    }
    else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

   computeCartTotals() {
     let totalPrice: number = 0.0;
     let totalQuantity: number = 0;


     for (let tempCartItem of this.cartItems) {
       
       totalPrice += tempCartItem.unitPrice * tempCartItem.quantity;
       totalQuantity += tempCartItem.quantity;
     }

     this.totalPrice.next(totalPrice);
     this.totalQuantity.next(totalQuantity);

     this.logCartData(totalPrice, totalQuantity);
     this.persistCartItems();
   }

  logCartData(totalPrice: number, totalQuantity: number) {
    console.log('Contents of cart: ');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, price: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }
    console.log(`Total price: ${totalPrice.toFixed(2)}, total quantity: ${totalQuantity.toFixed(2)}`);
    console.log('---');
  }

  decrementQuantity(cartItem: CartItem) {
    let itemIndex: number = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id); {
      if (itemIndex > -1) {
        if (this.cartItems[itemIndex].quantity > 1) this.cartItems[itemIndex].quantity--;
        else this.remove(cartItem);
      }
    }

    this.computeCartTotals();
  }

  remove(cartItem: CartItem) {

    let itemIndex: number = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
    }
    this.computeCartTotals();
  }
}
