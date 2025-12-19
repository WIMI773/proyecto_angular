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

  email = ''; //guarda el email
  password = ''; //guarda la contraseña
  errorMessage = '';//guarda el mensaje de error

//se inyectan los servicios necesarios
  constructor(private authService: AuthService, private router: Router) {}

  //FUNCION DEL LOGIN
  onLogin() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log('LOGIN OK:', res);

      // SweetAlert de éxito...
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión correcto',
        text: 'Bienvenido WStore',
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['']); // eniva al home
        }
      });
    },

    error: (err) => {
      console.log('ERROR LOGIN:', err);
      this.errorMessage = 'Credenciales incorrectas';

    
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo o contraseña incorrectos'
      });
    }
  });
  }
}
