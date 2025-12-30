import { Component, Inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';
import { MotivoCancelService } from 'src/app/services/motivo-cancel.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';

import { Usuario } from "src/model/usuario";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MotivoCancel } from 'src/model/motivo-cancel';


@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-no-show-y-reject-solicitud',
  templateUrl: './dialogo-no-show-y-reject-solicitud.component.html',
  styleUrls: ['./dialogo-no-show-y-reject-solicitud.component.css']
})
export class DialogoNoShowYRejectSolicitudComponent implements OnInit {

  cargando: boolean = false;

  titulo: string = "";
  tituloLabel: string = "";
  tipo: string = "";
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
     private citaSolicitudService: CitaSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoNoShowYRejectSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.titulo = data.titulo;
    this.tipo = data.tipo;
    this.idSolicitud = data.idSolicitud;
    this.idCita = data.idCita;
    this.idUsuarioEntrada = data.idUsuario;
    this.tituloLabel = data.tituloLabel;
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
  }

  ngOnInit(): void {
    this.obtenerMotivosCancel();
    if(this.tipo === 'reject'){
      this.obtenerUsuariosRol();
      
    }
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

  envioNoShow() {

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
        this.solicitudesService.noShow(this.idSolicitud, this.usuario.idUsuario, motivoCancelF, true)
          .then(() => {
            this.cargando = false;
            //this.goBack();
            this.router.navigate(['/solicitudes/solicitudes']);
            this.dialogRef.close("");
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }

    }

  }

  envioReject(){

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
        this.solicitudesService.reasignarSolicitud(this.idSolicitud, this.usuario.idUsuario, this.filterUsuario,motivoCancelF, true)
          .then(() => {
            this.cargando = false;
            this.router.navigate(['/solicitudes/solicitudes']);
            this.dialogRef.close("");
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }

    }

  }

  envioLost(){

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


          this.cargando = true;
            this.solicitudesService.actualizarEstatusSolicitud(this.idSolicitud, 7, this.usuario.idUsuario, closed,motivoCancelF)
              .then(() => {
                this.cargando = false;
                this.dialogRef.close("");
              })
              .catch((reason) => this.utilService.manejarError(reason))
              .then(() => (this.cargando = false));
      }

    }

  }

  envioNoShowVoc() {

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
        this.citaSolicitudService.no_show(this.idCita, this.usuario.idUsuario,motivoCancelF)
          .then(() => {
            this.cargando = false;
            this.dialogRef.close("");
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

    var tipoF = '';
    if (this.tipo === 'noshow') {
      tipoF = 'NSH';
    } else if (this.tipo === 'reject') {
      tipoF = 'REJ';
    }
    else if (this.tipo === 'lost') {
      tipoF = 'CNC';
    }
     else if (this.tipo === 'noshowvoc') {
      tipoF = 'NSHVOC';
    }
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
