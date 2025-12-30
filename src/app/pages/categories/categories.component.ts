import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoryService } from '../../services/categories.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  // ✅ FORMULARIO SIMPLE (NO Category)
  form = {
    name: '',
    image: ''
  };

  editing = false;
  selectedId?: number;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data.slice(0, 5); // muestra 5;
    });
  }

  save(): void {
    if (!this.form.name || !this.form.image) return;

    if (this.editing && this.selectedId !== undefined) {
      this.categoryService.updateCategory(this.selectedId, this.form)
        .subscribe(() => {
          Swal.fire('Actualizada', 'Categoría actualizada', 'success');
          this.reset();
          this.loadCategories();
        });
    } else {
      this.categoryService.createCategory(this.form)
        .subscribe(() => {
          Swal.fire('Creada', 'Categoría creada', 'success');
          this.reset();
          this.loadCategories();
        });
    }
  }

  edit(category: Category): void {
    this.form = {
      name: category.name,
      image: category.image
    };
    this.selectedId = category.id;
    this.editing = true;
  }

  delete(id?: number): void {
    if (id === undefined) return;

    Swal.fire({
      title: '¿Eliminar categoría?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe(() => {
          Swal.fire('Eliminada', 'Categoría eliminada', 'success');
          this.loadCategories();
        });
      }
    });
  }

  reset(): void {
    this.form = { name: '', image: '' };
    this.editing = false;
    this.selectedId = undefined;
  }
}
