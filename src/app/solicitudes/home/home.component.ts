import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { MASTER, BACKOFFICE, GHOSTWRITING, THERAPIST, VOC } from 'src/app/app.config';
import { Usuario } from 'src/model/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,imports: [RouterModule,FormsModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  usuario: Usuario = new Usuario;

  constructor(private router: Router) {
    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    if (this.usuario.rol == VOC || this.usuario.rol == THERAPIST) {
      this.router.navigateByUrl('/solicitudes/solicitudes-voc');
    }
    else {
      this.router.navigateByUrl('/solicitudes/solicitudes');
    }
  }

}
