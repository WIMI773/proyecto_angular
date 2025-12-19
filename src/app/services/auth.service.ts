import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root' 
})
export class AuthService {

  
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth/login';

  constructor(private http: HttpClient) {} // Inyectamos HttpClient para hacer peticiones HTTP

  // Función para iniciar sesión
  login(email: string, password: string) {
    return this.http.post<any>(this.apiUrl, { email, password })
      .pipe(
        tap((res: any) => {
          // Guardamos el token que nos devuelve la API en el localStorage
          localStorage.setItem('token', res.access_token);
        })
      );
  }

  // Función para saber si el usuario está logueado....
  isLogged(): boolean {
    const token = localStorage.getItem('token'); // se obtiene el token del localStorage
    return token !== null && token !== ''; 
  }

  // Función para cerrar sesión
  logout() {
    localStorage.removeItem('token'); 
  }
}
