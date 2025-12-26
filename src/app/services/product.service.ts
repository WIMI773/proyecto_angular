import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { CreateProductDTO } from '../../models/create-product.dto';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
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

  getAll(): Observable<Product[]> {
  return this.http.get<Product[]>(this.api).pipe(
    retry(2), // reintenta 2 veces
    catchError(err => {
      console.error('Error API productos', err);
      return of([]); // evita pantalla vacía
    })
  );
}

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  // Crear
  create(data: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(this.api, data, this.getAuthHeaders());
  }

  //  Actualizar
  update(id: number, data: CreateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, data, this.getAuthHeaders());
  }

  //Eliminar
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`, this.getAuthHeaders());
  }
}
