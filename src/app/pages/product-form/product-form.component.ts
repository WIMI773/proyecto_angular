import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup; //Representa el formulario
  id?: number; //Guarda el id del producto
  editing = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    // Verifica si es edición
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.editing = !!this.id;

    // Inicializa formulario
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      categoryId: [1, Validators.required],
      images: [''] // Input como string, se convertirá a array al enviar
    });

    if (this.editing) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.productService.getById(this.id!).subscribe({
      next: (p) => {
        this.form.patchValue({
          title: p.title,
          price: p.price,
          description: p.description,
          categoryId: p.category.id,
          images: p.images[0] || '' // Solo la primera URL
        });
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        alert('❌ Error al cargar el producto');
      }
    });
  }

  save() {
    if (!this.form.valid) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.loading = true;

    // Construye el objeto para la API...
    const data = {
      title: this.form.value.title,
      price: Number(this.form.value.price),
      description: this.form.value.description,
      categoryId: Number(this.form.value.categoryId),
      images: this.form.value.images ? [this.form.value.images] : []
    };

    console.log('Datos que se envían a la API:', data); // Para depuración

    if (this.editing) {
      this.productService.update(this.id!, data).subscribe({
        next: () => {
          alert('✅ Producto actualizado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          alert('❌ Error al actualizar el producto');
          this.loading = false;
        }
      });
    } else {
      this.productService.create(data).subscribe({
        next: () => {
          alert('✅ Producto creado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          alert('❌ Error al crear el producto');
          this.loading = false;
        }
      });
    }
  }
}
