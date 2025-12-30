import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../model/usuario';
import { SessionService } from '../../services/session.service';
import { Router,RouterModule } from '@angular/router';
import { UtilService } from '../../services/util.service';
import { CustomI18nService } from 'src/app/custom-i18n.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule],
  selector: 'app-tus-credenciales',
  templateUrl: './tus-credenciales.component.html',
  styleUrls: ['./tus-credenciales.component.css']
})
export class TusCredencialesComponent implements OnInit {
  usuario: Usuario = new Usuario();

  cambiandoContrasena: boolean = false;
  cambiandoCorreo: boolean = false;
  cambiandoImage: boolean = false;

  public file: File[] = [];

  password: string = "";
  confirmPassword: string = "";

  email1: string = "";
  email2: string = "";

  cargando = false;

  constructor(
    private usuariosService: UsuariosService,
    private sessionService: SessionService,
    private seguridadService: SeguridadService,
    private router: Router,
    private i18n: CustomI18nService,
    private utilService: UtilService) {
    this.usuariosService
      .obtenerUsuarioPorId(parseInt(localStorage.getItem('idUsuario'))).then(u => {
        this.usuario = u;
      }).catch(r => this.utilService.manejarError(r));
  }

  ngOnInit(): void {
    console.log('TusCredencialesComponent initialized');
    console.log('cambiandoContrasena:', this.cambiandoContrasena);
  }

  cambiarPassword() {
    this.utilService
      .mostrarDialogoSimple(
        "Change password",
        "You are about to change your password, once changed the session will be closed and you will have to log in with your new credentials.",
        "Change password",
        "Cancel"
      ).then(result => {
        if (result == 'ok') {
          this.cargando = true;
          this.seguridadService
            .cambioPassword(this.usuario.idUsuario, this.password, this.confirmPassword)
            .then(exito => {
              if (exito) {
                this.sessionService.cerrarSesion();
                this.router.navigate(['/ingresar']);
              } else {
                this.utilService.mostrarDialogoSimple("Error", "Password has not been changed, check that your session is valid.");
              }
            })
            .catch(r => this.utilService.mostrarDialogoSimple("Error", r))
            .then(() => this.cargando = false);
        }
      });
  }

  cambiarCorreo() {
    this.utilService
      .mostrarDialogoSimple(
        "Change email address",
        "You are about to change your email address, once changed, you will be logged out for the changes to take effect.",
        "Change email address",
        "Cancel"
      ).then(result => {
        if (result == 'ok') {
          this.cargando = true;
          this.seguridadService
            .cambioEmail(this.usuario.idUsuario, this.email1, this.email2)
            .then(exito => {
              if (exito) {
                this.sessionService.cerrarSesion();
                this.router.navigate(['/ingresar']);
              } else {
                this.utilService.mostrarDialogoSimple("Error", "Email address has not been changed, check that your session is valid.");
              }
            })
            .catch(r => this.utilService.mostrarDialogoSimple("Error", r))
            .then(() => this.cargando = false);
        }
      });
  }

  onFileSelected(files: FileList) {
    // this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
    for (let i = 0; i < files.length; i++) {
      this.file.push(files.item(i));
    }
  }

  quitarAdjunto(archivo: File) {
    let start = this.file.findIndex(f => f == archivo);
    this.file.splice(start, 1);
  }

  cargarAdjunto() {
   let promises = [];
    this.file.forEach(f => promises.push(this.usuariosService.actualizarImagen(f,this.usuario.idUsuario)));

    this.cargando = true;
    Promise
      .all(promises)
      .then(results => {
        console.log(results);
        this.file = [];
        this.cambiandoImage = false;
      }).catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

}
