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


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  
  searchQuery = ''; //guarda lo que se busca
  allProducts: any[] = []; //productos de la API
  filteredProducts: any[] = []; 
  loading = true;
  error = '';

  
  cart: CartItem[] = []; //variables del carrito
  cartSubscription?: Subscription;
  searchSubscription?: Subscription;

  //Carrusel...
  currentSlide = 0;
  totalSlides = 3;
  carouselInterval: any;

  constructor(
    //se inyectan todos los servicios necesarios
    private productsService: ProductsService,
    private router: Router,
    public authService: AuthService,
    private cartService: CartService,
    private searchService: SearchService
  ) {}

  
  ngOnInit(): void {
    // Cargar productos desde la API
    this.loadProducts();

    // Escuchar búsqueda del navbar
    this.searchSubscription = this.searchService.search$.subscribe(search => {
      this.searchQuery = search;
      this.searchProducts();

      if (this.filteredProducts.length === 1) {
        this.navigateToProductDetail(this.filteredProducts[0].id);
      }
    });

    //carrito se actualiza automaticamente
    this.cartSubscription = this.cartService.cart$.subscribe(cart => { 
      this.cart = cart;
    });

    
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    clearInterval(this.carouselInterval);
  }

  
  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }, 5000);
  }

  //Cambiar slide manualmente
  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  scrollToProducts(): void {
    document
      .querySelector('.products-section-full')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  
  loadProducts(): void {
    this.loading = true;
    this.productsService.getAll().subscribe({
      next: products => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los productos. Intenta más tarde.';
        this.loading = false;
      }
    });
  }

  // Filtrar productos mientras escribes
  searchProducts(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      // Mostrar todos los productos si el input está vacío
      this.filteredProducts = this.allProducts;
      return;
    }

    this.filteredProducts = this.allProducts.filter(product =>
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
      text: 'No se encontraron productos con ese nombre'
    });
  }
  
  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  
  addToCart(product: any): void {
    if (!this.authService.isLogged()) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para agregar productos al carrito',
        showCancelButton: true,
        confirmButtonText: 'Ir a Login',
        cancelButtonText: 'Cancelar'
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
