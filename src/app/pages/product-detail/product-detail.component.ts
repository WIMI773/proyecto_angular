import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: any;
  loading = true;

  constructor(
     private route: ActivatedRoute,
  private productService: ProductsService,
  private cartService: CartService,
    private authService: AuthService,
    private router: Router

) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe(res => {
      this.product = res;
      this.loading = false;
    });
  }

  addToCart(product: any) {
  if (!this.authService.isLogged()) {
    Swal.fire({
      icon: 'info',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para agregar productos al carrito',
      confirmButtonText: 'Ir al login'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      }
    });

    return;
  }

  this.cartService.addToCart(product);

  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    text: 'El producto fue agregado al carrito correctamente',
    timer: 1500,
    showConfirmButton: false
  });
}

goBack() {
  window.history.back();
}

}

// ======================
