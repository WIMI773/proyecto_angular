import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private api = 'https://api.escuelajs.co/api/v1/categories';

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  loadCategories() {
    return this.http.get<Category[]>(this.api)
      .subscribe(data => this.categoriesSubject.next(data));
  }

  createCategory(category: Omit<Category, 'id'>) {
    return this.http.post<Category>(this.api, category).pipe(
      tap(() => this.loadCategories())
    );
  }

  updateCategory(id: number, category: Omit<Category, 'id'>) {
    return this.http.put<Category>(`${this.api}/${id}`, category).pipe(
      tap(() => this.loadCategories())
    );
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.api}/${id}`).pipe(
      tap(() => this.loadCategories())
    );
  }
}
