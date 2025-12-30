import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoryService } from '../../services/categories.service';
import { Category } from '../../../models/category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  subscription?: Subscription;

  form = {
    name: '',
    image: ''
  };

  editing = false;
  selectedId?: number;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
  this.categoryService.categories$.subscribe(data => {
    this.categories = data;
  });
}


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  save(): void {
  if (!this.form.name || !this.form.image) return;

  if (this.editing && this.selectedId !== undefined) {
    this.categoryService.updateCategory(this.selectedId, this.form)
      .subscribe(() => {
        Swal.fire('Actualizada', 'Categoría actualizada', 'success');
        this.reset();
      });
  } else {
    this.categoryService.createCategory(this.form)
      .subscribe(() => {
        Swal.fire('Creada', 'Categoría creada', 'success');
        this.reset();
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
  if (!id) return;

  Swal.fire({
    title: '¿Eliminar categoría?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar'
  }).then(result => {
    if (result.isConfirmed) {
      this.categoryService.deleteCategory(id)
        .subscribe(() => {
          Swal.fire('Eliminada', 'Categoría eliminada', 'success');
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
