import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
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
  private cartService: CartService
) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe(res => {
      this.product = res;
      this.loading = false;
    });
  }

  addToCart(product: any) {
  this.cartService.addToCart(product);
  alert('Producto agregado al carrito');
}

goBack() {
  window.history.back();
}

}
