import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Router,RouterModule } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomI18nService } from 'src/app/custom-i18n.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,imports: [RouterModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  baseHref = document.baseURI;

  user: Usuario = new Usuario();
  loading = false;

  password: string = null;

  cargando = false;

  constructor(
    private utilService: UtilService,
    private sessionService: SessionService,
    private seguridadService: SeguridadService,
    private router: Router,
    private i18n: CustomI18nService,
  ) {
    this.utilService.deshabilitaRetroceso();
  }

  ingresar() {
    if (localStorage.getItem('usuario') == null) {
      this.loading = true;
      this.sessionService
        .iniciarSesion(this.user.usuario, this.user.contrasenia)
        .then(success => {

          if (success) {
            this.utilService.iniciarContadorDeSesion();
            this.router.navigate(['/inicio']);
          } else {
            //this.loading = false;
            this.utilService.mostrarDialogoSimple(
              'Wrong credentials',
              'User or password does not match, please verify your credentials and try again.'
            );
          }
        }).catch(reason => {
          if (reason instanceof HttpErrorResponse && (reason as HttpErrorResponse).status == 0) {
            //this.loading = false;
            this.utilService.mostrarDialogoSimple(
              'Connection error',
              'Failed to connect to server'
            );
          } else {
            this.utilService.manejarError(reason)
          }
        }).then(() => this.loading = false);
    } else {
      this.utilService.mostrarDialogoSimple(
        'An active session',
        'There is currently an active session in this web browser. Please log out in order to start a new session.'
      );
    }
  }

  changeLang(lang) {
    document.location.href = document.location.href
      .replace('/en', '/$lang')
      .replace('/es', '/$lang')
      .replace('$lang', lang);
  }

  getBrowserInfo() {
    var ua = navigator.userAgent, tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  };

  recuperar() {
    let campos = [];
    campos.push({ label: "Email", type: "email", placeholder: "Enter your email", value: "", });
    this.utilService
      .mostrarDialogoConFormulario(
        "Reset password",
        "Enter your email address to begin the password reset process.",
        "Send email",
        "Cancel",
        campos
      ).then(result => {
        if (result == 'ok') {
          if (campos[0].value.trim() == "" || campos[0].value.length === 0) {
            this.utilService.mostrarDialogoSimple("Error", "Please enter a valid email address");
          } else {
            this.cargando = true;
            this.seguridadService
              .resetPasswordRequest(campos[0].value)
              .then(response => {
                if (response.status == 200) {
                  this.utilService.mostrarDialogoSimple("Sent", "The message has been sent successfully.");
                } else {
                  this.utilService.mostrarDialogoSimple("Error", "The message could not be sent.");
                }
              })
              .catch(r => this.utilService.manejarError(r))
              .then(() => this.cargando = false);
          }
        }
      });
  }
}
