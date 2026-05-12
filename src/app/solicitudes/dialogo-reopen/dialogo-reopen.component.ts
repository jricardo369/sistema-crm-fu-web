import { Component, Inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';
import { MotivoCancelService } from 'src/app/services/motivo-cancel.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { Usuario } from "src/model/usuario";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MotivoCancel } from 'src/model/motivo-cancel';


@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-reopen',
  templateUrl: './dialogo-reopen.component.html',
  styleUrls: ['./dialogo-reopen.component.css']
})
export class DialogoReopenComponent implements OnInit {

  cargando: boolean = false;

  titulo: string = "";
  tituloLabel: string = "";
  arrCitasActivas: CitaActivaSolicitud[] = [];
  idEventoSelected: string = "";
  cancelReason: string = "";
  idSolicitud: number = null;
  idCita: number = null;
  idUsuarioEntrada: number = null;
  usuario: Usuario = new Usuario();

  filterMotivoCancel: string;
  arrFilterMotivoCancel: MotivoCancel[] = [];

    filterUsuario: number = 0;
  arrFilterUsuarios: Usuario[] = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private solicitudesService: SolicitudesService,
    private eventoSolicitudService: EventoSolicitudService,
    private motivoCancelService: MotivoCancelService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoReopenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.titulo = 'Reopen file';
    this.idSolicitud = data.idSolicitud;
    this.idCita = data.idCita;
    this.idUsuarioEntrada = data.idUsuario;
    this.tituloLabel = data.tituloLabel;
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
  }

  ngOnInit(): void {
    this.obtenerMotivosCancel();
  }

  estaSeleccionado(idEvento: string) {
    return this.idEventoSelected == idEvento;
  }

  check(event: Event, idEvento: string) {
    if ((event.srcElement as HTMLInputElement).checked) {
      if (!this.estaSeleccionado(idEvento)) this.idEventoSelected = idEvento;
    } else {
      if (this.estaSeleccionado(idEvento)) this.idEventoSelected = null;
    }
  }

  

  

  envioReopen() {

    if (this.filterMotivoCancel === undefined) {
      
      this.utilService.mostrarDialogoSimple("Warning", "Reason for cancellation cannot be empty");

    }else{

      var motivoCancelF = "";
      var booleanSeguir = true;
      if (this.filterMotivoCancel === 'other') {
        if (this.cancelReason === '' || this.cancelReason == null) {
          this.utilService.mostrarDialogoSimple("Warning", "Cancellation reason cannot be empty");
          booleanSeguir = false;
        } else {
          motivoCancelF = this.cancelReason;
        }
      } else {
        motivoCancelF = this.filterMotivoCancel;
      }

      //console.log('booleanSeguir:'+booleanSeguir);
      //console.log('motivo cancel:'+motivoCancelF);

      if (booleanSeguir) {
        this.solicitudesService.reopenSolicitud(this.idSolicitud, this.usuario.idUsuario, motivoCancelF)
          .then(() => {
            this.cargando = false;
            this.dialogRef.close("enviado");    
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }

    }

  }


  cerrar(accion: string = "") { this.dialogRef.close(accion); }

  obtenerUsuariosRol(){
     this.usuariosService.obtenerUsuariosPorRol(4, 1)
     .then(usuarios => {
        this.arrFilterUsuarios = usuarios;
        console.log('a:'+this.arrFilterUsuarios[0].idUsuario);
        this.filterUsuario = this.arrFilterUsuarios[0].idUsuario;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerMotivosCancel() {

    var tipoF = 'OPN';
    this.cargando = true;
    this.motivoCancelService
      .obtenerMotivosCancel(tipoF, this.usuario.idUsuario)
      .then(motivos => {
        this.arrFilterMotivoCancel = motivos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
      
  }
}
