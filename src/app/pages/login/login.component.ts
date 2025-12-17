import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log('LOGIN OK:', res);

      // SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión correcto',
        text: 'Bienvenido WStore',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['']); // o '/home' según tu ruta
        }
      });
    },

    error: (err) => {
      console.log('ERROR LOGIN:', err);
      this.errorMessage = 'Credenciales incorrectas';

      // (opcional) alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo o contraseña incorrectos'
      });
    }
  });
  }
}
