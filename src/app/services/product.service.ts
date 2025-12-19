import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ 
  
  providedIn: 'root'
})
export class ProductsService {

  
  private api = 'https://api.escuelajs.co/api/v1/products';

  constructor(private http: HttpClient) {} // se inyecta el httpclient para hacer peticiones a la api
  
  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // Obtiene el token guardado en el localStorage
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Método para obtener todos los productos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // Método para obtener un producto por su ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // Método para crear un nuevo producto
  create(product: any): Observable<any> {
    return this.http.post(this.api, product, this.getAuthHeaders());
  }

  // Método para actualizar un producto existente
  update(id: number, product: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, product, this.getAuthHeaders());
  }

  // Método para eliminar un producto
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, this.getAuthHeaders());
  }
}
