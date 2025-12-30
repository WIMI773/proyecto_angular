import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SearchService } from '../../services/search.service';
import { CategoryService } from '../../services/categories.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  //  BÚSQUEDA
  searchQuery = '';
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  error = '';

  //  CATEGORÍAS
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  //  CARRITO
  cart: CartItem[] = [];
  cartSubscription?: Subscription;
  searchSubscription?: Subscription;

  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private router: Router,
    public authService: AuthService,
    private cartService: CartService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    
    this.searchSubscription = this.searchService.search$.subscribe(search => {
      this.searchQuery = search;
      this.searchProducts();

      if (this.filteredProducts.length === 1) {
        this.navigateToProductDetail(this.filteredProducts[0].id);
      }
    });

   
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

  
  //  PRODUCTOS
  loadProducts(): void {
    this.loading = true;
    this.productsService.getAll().subscribe({
      next: products => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos';
        this.loading = false;
      }
    });
  }

  
  //  CATEGORÍAS
  loadCategories(): void {
  this.categoryService.getCategories().subscribe(categories => {
    this.categories = categories.slice(0, categories.length - 2); // Excluir las últimas 5 categorías
  });
}

  

  filterByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.loading = true;

    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: products => {
        this.filteredProducts = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  clearCategoryFilter(): void {
    this.selectedCategoryId = null;
    this.filteredProducts = this.allProducts;
  }

  
  //  BÚSQUEDA
  searchProducts(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredProducts = this.selectedCategoryId
        ? this.filteredProducts
        : this.allProducts;
      return;
    }

    this.filteredProducts = this.filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query)
    );
  }

  handleSearchNavigation(): void {
    if (!this.searchQuery.trim()) return;

    this.searchProducts();

    if (this.filteredProducts.length === 1) {
      this.navigateToProductDetail(this.filteredProducts[0].id);
      return;
    }

    if (this.filteredProducts.length > 1) {
      this.router.navigate(['/products'], {
        queryParams: { q: this.searchQuery }
      });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Sin resultados',
      text: 'No se encontraron productos'
    });
  }

  // ======================
  // 🧭 NAVEGACIÓN
  // ======================
  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  viewDetail(id: number): void {
    this.router.navigate(['/products', id]);
  }

  scrollToProducts(): void {
    document
      .querySelector('.products-section-full')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  // ======================
  // 🛒 CARRITO
  // ======================
  addToCart(product: any): void {
    if (!this.authService.isLogged()) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos',
        confirmButtonText: 'Ir al login'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.cartService.addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      quantity: 1
    });

    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: 'Producto agregado al carrito',
      timer: 800,
      showConfirmButton: false
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/250x250?text=Sin+imagen';
  }
}
