import { Injectable } from '@angular/core'; // Permite que este servicio se pueda inyectar en otros componentes
import { HttpClient } from '@angular/common/http'; // Para hacer peticiones HTTP
import { tap } from 'rxjs/operators'; // Para ejecutar algo cuando la petición HTTP tenga respuesta

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {

  // URL de la API de login
  private apiUrl = 'https://api.escuelajs.co/api/v1/auth/login';

  constructor(private http: HttpClient) {} // Inyectamos HttpClient para hacer peticiones HTTP

  // Función para iniciar sesión
  login(email: string, password: string) {
    // Hacemos una petición POST a la API con el email y la contraseña
    return this.http.post<any>(this.apiUrl, { email, password })
      .pipe(
        // tap nos permite ejecutar algo con la respuesta sin modificarla
        tap((res: any) => {
          // Guardamos el token que nos devuelve la API en el localStorage
          localStorage.setItem('token', res.access_token);
        })
      );
  }

  // Función para saber si el usuario está logueado
  isLogged(): boolean {
    const token = localStorage.getItem('token'); // Obtenemos el token del localStorage
    return token !== null && token !== ''; // Retorna true si existe el token
  }

  // Función para cerrar sesión
  logout() {
    localStorage.removeItem('token'); // Eliminamos el token del localStorage
  }
}
