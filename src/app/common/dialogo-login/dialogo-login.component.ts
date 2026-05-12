import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component,Injector, Output, EventEmitter } from "@angular/core";
import { UtilService } from "src/app/services/util.service";
import { SessionService} from "src/app/services/session.service";
import { Router,RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';



import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { Usuario } from '../../../model/usuario';

@Component({
    standalone: true,
    imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
    selector: 'dialogo-login',
    templateUrl: 'dialogo-login.component.html',
    styleUrls: ['./dialogo-login.component.scss']
})
export class DialogoLoginComponent {

    user: Usuario = new Usuario();
    password: string;
    loading: boolean = false;

    private utilService: UtilService;

     //private utilService: UtilService;
    //recuperarPasswordOnly = false;

    constructor( 
        private injector: Injector,
        private sessionService: SessionService,
        private router: Router,
        public dialogRef: MatDialogRef<DialogoLoginComponent>){
        //@Inject(MAT_DIALOG_DATA) public data: any) {

        //this.utilService = this.injector.get(UtilService);  
        //this.recuperarPasswordOnly = data.recuperarPasswordOnly;

        this.utilService = this.injector.get(UtilService);

    }

    cerrar() { this.dialogRef.close(); }

    salir() {
        this.cerrar();
        //this.utilService.limpiarContadorDeSesion();
        this.sessionService.cerrarSesion();
        this.router.navigate(['/ingresar']);
    }

     ingresar() {
       if (this.user.usuario == localStorage.getItem('usuario')) {
        this.loading = true;
      this.sessionService
        .iniciarSesion(this.user.usuario, this.password)
        .then(success => {
          if (success) {
            this.utilService.iniciarContadorDeSesion();
            this.cerrar();
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