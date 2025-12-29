import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule], // Eliminamos CategoriesComponent
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  isLogged = false;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLogged = this.authService.isLogged();
    this.loadProducts();
  }

  // Cargar todos los productos
  loadProducts(): void {
    this.productService.getAll().subscribe(res => {
      this.products = res;
    });
  }

  goToCreate(): void {
    if (!this.isLogged) return;
    this.router.navigate(['/products/new']);
  }

  edit(id: number): void {
    if (!this.isLogged) return;
    this.router.navigate(['/products/edit', id]);
  }

  delete(id: number): void {
    if (!this.isLogged) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto se eliminará definitivamente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#30b264ff',
      cancelButtonColor: 'rgba(165, 160, 160, 1)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(id).subscribe(() => {
          // ELIMINAR DEL CARRITO SI ESTÁ
          this.cartService.removeFromCart(id);

          // Recargar productos
          this.loadProducts();

          Swal.fire({
            title: 'Eliminado',
            text: 'El producto fue eliminado correctamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        });
      }
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    Swal.fire('Agregado', 'Producto agregado al carrito', 'success');
  }

  viewDetail(id: number): void {
    this.router.navigate(['/products', id]);
  }
}
