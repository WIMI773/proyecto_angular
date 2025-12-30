import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { CreateCategoryDTO } from '../../models/create-category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'https://api.escuelajs.co/api/v1/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  createCategory(data: CreateCategoryDTO): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, data);
  }

  updateCategory(id: number, data: CreateCategoryDTO): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
