import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/product.service';
import Swal from 'sweetalert2';
import { CreateProductDTO } from '../../../models/create-product.dto';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  form!: FormGroup;
  id?: number;
  editing = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.editing = !!this.id;

    this.form = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      categoryId: [1, Validators.required],
      images: ['']
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
          categoryId: p.category?.id,
          images: p.images?.[0] || ''
        });
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const data: CreateProductDTO = {
      title: this.form.value.title,
      price: Number(this.form.value.price),
      description: this.form.value.description,
      categoryId: Number(this.form.value.categoryId),
      images: this.form.value.images ? [this.form.value.images] : []
    };

    if (this.editing) {
      this.productService.update(this.id!, data).subscribe(() => {
        Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.create(data).subscribe(() => {
        Swal.fire('Creado', 'Producto creado correctamente', 'success');
        this.router.navigate(['/products']);
      });
    }
  }
}
