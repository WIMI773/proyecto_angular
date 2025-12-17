import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cart = items;
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    } else {
      this.removeItem(item.id);
    }
  }

  

clearCart() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se eliminarán todos los productos del carrito',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#30b264ff',
    cancelButtonColor: 'rgba(165, 160, 160, 1)',
    confirmButtonText: 'Sí, vaciar carrito',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {

      // 🔥 AQUÍ se vacía el carrito
      this.cartService.clearCart();

      Swal.fire({
        title: 'Carrito vacío',
        text: 'Todos los productos fueron eliminados',
        icon: 'success',
        confirmButtonColor: '#30b264ff'
      });
    }
  });
}

  getTotal() {
    return this.cartService.getTotal().toFixed(2);
  }
}
