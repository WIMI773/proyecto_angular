import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  cartCount = 0;
  private cartSubscription?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Suscribirse al BehaviorSubject para actualizar en tiempo real
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
  }

  get isLogged() {
    return this.auth.isLogged();
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  logout() {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Tendrás que iniciar sesión nuevamente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.auth.logout();
      this.closeMenu();

      Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigate(['/login']); // o '/' según tu app
    }
  });
  }
}

