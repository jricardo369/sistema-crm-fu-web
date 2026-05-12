import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';
import { MotivoCancelService } from 'src/app/services/motivo-cancel.service';
import { Usuario } from "src/model/usuario";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MotivoCancel } from 'src/model/motivo-cancel';

@Component({
  standalone: true,imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-cancelar-cita-solicitud',
  templateUrl: './dialogo-cancelar-cita-solicitud.component.html',
  styleUrls: ['./dialogo-cancelar-cita-solicitud.component.css']
})
export class DialogoCancelarCitaSolicitudComponent implements OnInit {

  cargando: boolean = false;

  arrCitasActivas: CitaActivaSolicitud[] = [];
  idEventoSelected: string = "";
  cancelReason: string = "";
  idSolicitud: number = null;
  idUsuarioEntrada: number = null;
  usuario: Usuario = new Usuario();

  filterMotivoCancel: string;
  arrFilterMotivoCancel: MotivoCancel[] = [];

  constructor(
    private eventoSolicitudService: EventoSolicitudService,
    private motivoCancelService: MotivoCancelService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoCancelarCitaSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idSolicitud = data.idSolicitud;
    this.idUsuarioEntrada = data.idUsuario;
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.obtenerCitasActivas();
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

  obtenerCitasActivas() {
    this.cargando = true;
    var usuarioEnvio: number  = 0;
    if(this.usuario.rol == '11'){
      usuarioEnvio = this.usuario.idUsuario;
    }
    this.eventoSolicitudService.obtenerCitasActivas(this.idSolicitud,usuarioEnvio)
      .then(citasActivas => {
        this.arrCitasActivas = citasActivas;
        if (this.arrCitasActivas.length == 0) this.cerrar('vacio');
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  enviar() {

    //console.log('movito:'+this.filterMotivoCancel);

    if(this.filterMotivoCancel === undefined){
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
      }else{
          motivoCancelF = this.filterMotivoCancel;
      }

      //console.log('booleanSeguir:'+booleanSeguir);
      //console.log('motivo cancel:'+motivoCancelF);

      if(booleanSeguir){
      

      this.cargando = true;
      this.eventoSolicitudService.cancelarCita(this.idEventoSelected, this.idUsuarioEntrada,motivoCancelF)
        .then(() => {
          this.cargando = false;
          this.cerrar('enviado');
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
      }

    }

  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

  obtenerMotivosCancel() {
    this.cargando = true;
    this.motivoCancelService
      .obtenerMotivosCancel("CNC",this.usuario.idUsuario)
      .then(motivos => {
        this.arrFilterMotivoCancel = motivos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }
}
