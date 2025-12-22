import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private api = 'https://api.escuelajs.co/api/v1/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Obtener todos los productos
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  // Obtener producto por ID
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  // Crear producto
  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.api, product, this.getAuthHeaders());
  }

  // Actualizar producto
  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, product, this.getAuthHeaders());
  }

  // Eliminar producto
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`, this.getAuthHeaders());
  }
}
