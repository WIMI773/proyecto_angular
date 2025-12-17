import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  mobileMenuOpen = false;
  cartCount = 0;
  search = '';
  private cartSubscription?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  get isLogged(): boolean {
    return this.auth.isLogged();
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  // 🔹 Función al hacer click en el botón Buscar o presionar Enter
  searchProduct(): void {
    const query = this.search.trim();
    if (!query) {
      // Si está vacío, mostramos todos los productos
      this.searchService.setSearch('');
      this.router.navigate(['/']);
      this.closeMenu();
      return;
    }

    // Guardar búsqueda en el servicio
    this.searchService.setSearch(query);

    // Navegar a Home (o a /products si prefieres)
    this.router.navigate(['/']);
    this.closeMenu();
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que iniciar sesión nuevamente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.auth.logout();
        this.closeMenu();
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/login']);
      }
    });
  }
}
