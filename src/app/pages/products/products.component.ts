import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductsService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.isLogged = this.authService.isLogged();
  }

  loadProducts() {
    this.productService.getAll().subscribe(res => {
      this.products = res;
    });
  }

  goToCreate() {
    if (!this.isLogged) return;
    this.router.navigate(['/products/new']);
  }

  edit(id: number) {
    if (!this.isLogged) return;
    this.router.navigate(['/products/edit', id]);
  }

  delete(id: number) {
    if (!this.isLogged) return;
    if (!confirm('¿Eliminar este producto?')) return;

    this.productService.delete(id).subscribe(() => this.loadProducts());
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    alert('✅ Producto agregado al carrito');
  }
}
