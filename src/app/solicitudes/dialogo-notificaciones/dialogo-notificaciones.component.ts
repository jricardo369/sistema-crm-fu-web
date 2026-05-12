import { NotificacionesService } from './../../services/notificaciones.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { UtilService } from 'src/app/services/util.service';
import { Notificacion } from 'src/model/notificacion';
import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';

@Component({
  standalone: true,imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-notificaciones',
  templateUrl: './dialogo-notificaciones.component.html',
  styleUrls: ['./dialogo-notificaciones.component.css']
})
export class DialogoNotificacionesComponent implements OnInit {

  cargando: boolean = false;

  notificacion: Notificacion = new Notificacion;
  idSolicitud: number = null;
  usuario: Usuario = new Usuario;

  isAdministrator: boolean = false;
  isMaster: boolean = false;
  isVendor: boolean = false;
  isBackOffice: boolean = false;
  isInterviewer: boolean = false;
  isVOC: boolean = false;
  isTemplateCreator: boolean = false;
  isInterviewerScales: boolean = false;
  isGhostwriting: boolean = false;

  public fileNotificacion: File[] = [];

  constructor(
    private notificacionesService: NotificacionesService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoNotificacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.usuario = data.usuario;
    this.notificacion.idSolicitud = data.idSolicitud;
    this.notificacion.usuario = this.usuario.idUsuario.toString();
    this.notificacion.titulo = "";
    this.notificacion.cuerpo = "";
    this.notificacion.layout = "";
    this.notificacion.firmasAbogados = data.firmasAbogados;

    this.isAdministrator = this.usuario.rol == ADMINISTRATOR ? true : false;
    this.isMaster = this.usuario.rol == MASTER ? true : false;
    this.isVendor = this.usuario.rol == VENDOR ? true : false;
    this.isBackOffice = this.usuario.rol == BACKOFFICE ? true : false;
    this.isInterviewer = this.usuario.rol == INTERVIEWER ? true : false;
    this.isVOC = this.usuario.rol == VOC ? true : false;
    this.isTemplateCreator = this.usuario.rol == TEMPLATE_CREATOR ? true : false;
    this.isInterviewerScales = this.usuario.rol == INTERVIEWER_SCALES ? true : false;
    this.isGhostwriting = this.usuario.rol == GHOSTWRITING ? true : false;
  }

  ngOnInit(): void {
    this.notificacion.mail = true;
    this.notificacion.mensaje = false;
  }

  onFileSelected(files: FileList) {
    // this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
    for (let i = 0; i < files.length; i++) {
      this.fileNotificacion.push(files.item(i));
    }
  }

  quitarAdjunto(archivo: File) {
    let start = this.fileNotificacion.findIndex(f => f == archivo);
    this.fileNotificacion.splice(start, 1);
  }

  enviar() {
    this.cargando = true;
    this.notificacionesService.enviarNotificacion(this.notificacion, this.fileNotificacion[0])
      .then(() => {
        this.cargando = false;
        this.cerrar('enviado');
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  changeLayout() {
    this.notificacion.titulo = "";
    this.notificacion.cuerpo = "";
    this.fileNotificacion = [];
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
