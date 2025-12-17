import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  images?: string[];
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.cart = this.loadCart();
  }

  addToCart(product: CartItem) {
    const existing = this.cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.updateCart();
  }

  removeFromCart(id: number) {
    this.cart = this.cart.filter(item => item.id !== id);
    this.updateCart();
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.cart.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      this.updateCart();
    }
  }

  clearCart() {
    this.cart = [];
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
  }

  getTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  private updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next([...this.cart]);
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  }
}
