import { Injectable } from '@angular/core'; // Importa el decorador Injectable para crear servicios en Angular
import { HttpClient, HttpHeaders } from '@angular/common/http';// Importa HttpClient para hacer peticiones HTTP
import { Observable } from 'rxjs';// Importa Observable, que es la forma en que Angular maneja datos async


@Injectable({ // Decorador que indica que esta clase es un servicio
  
  providedIn: 'root'
})
export class ProductsService {

  
  private api = 'https://api.escuelajs.co/api/v1/products';// Guarda la URL base de la API de productos

  
  constructor(private http: HttpClient) {} // se inyecta el httpclient para hacer peticiones a la api

  // Método privado para obtener los headers de autorización
  private getAuthHeaders() {

    
    const token = localStorage.getItem('token'); // Obtiene el token guardado en el localStorage
    
    return {
      headers: new HttpHeaders({

        // Se envía el token usando el formato Bearer
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Método para obtener todos los productos
  getAll(): Observable<any[]> {

    // Hace una petición GET a la API
    // Devuelve un observable con una lista de productos
    return this.http.get<any[]>(this.api);
  }

  // Método para obtener un producto por su ID
  getById(id: number): Observable<any> {

    // Hace una petición GET con el ID del producto
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // Método para crear un nuevo producto
  create(product: any): Observable<any> {

    // Hace una petición POST
    // Envía el producto y los headers con el token
    return this.http.post(this.api, product, this.getAuthHeaders());
  }

  // Método para actualizar un producto existente
  update(id: number, product: any): Observable<any> {

    // Hace una petición PUT
    // Usa el ID del producto y los headers con token
    return this.http.put(`${this.api}/${id}`, product, this.getAuthHeaders());
  }

  // Método para eliminar un producto
  delete(id: number): Observable<any> {

    // Hace una petición DELETE
    // Usa el ID y el token para autorización
    return this.http.delete(`${this.api}/${id}`, this.getAuthHeaders());
  }
}
