import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Usuario } from '../../../model/usuario';
import { SessionService } from '../../services/session.service';
import { Router,RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilService } from '../../services/util.service';
import { CustomI18nService } from 'src/app/custom-i18n.service';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,MatIconModule],
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  @Output()
  onLogin: EventEmitter<any> = new EventEmitter();

  user: Usuario = new Usuario();
  password: string;
  loading: boolean = false;
  navigateToHomeAfterLogin: boolean = false;

  constructor(
    private sessionService: SessionService,
    private i18n: CustomI18nService,
    private router: Router,
    private utilService: UtilService,
    private dialog: MatDialog) {
  }

  ngOnInit() { }

  ingresar() {
    if (this.user.usuario == localStorage.getItem('usuario')) {
      this.loading = true;
      this.sessionService
        .iniciarSesion(this.user.usuario, this.password)
        .then(success => {
          if (success) {
            this.utilService.iniciarContadorDeSesion();
            this.onLogin.emit(success);
          } else {
            console.log('mostrar dialogo wrong credentials');
            this.utilService.mostrarDialogoSimple(
              "Wrong credentials",
              "User or password does not match, please verify your credentials and try again.");
          }
        }).catch(reason => {
          if (reason instanceof HttpErrorResponse && (reason as HttpErrorResponse).status == 0) {
            // this.loading = false;
            this.utilService.mostrarDialogoSimple(
              'Connection error',
              'Failed to connect to server'
            );
          } else {
            this.utilService.manejarError(reason)
          }
        }).then(() => this.loading = false);
    }
    else {
      this.utilService.mostrarDialogoSimple(
        "Unable to resume the session",
        "The user with which you are trying to resume the session does not match the user of the current session, please check."
      );
    }
  }
}
