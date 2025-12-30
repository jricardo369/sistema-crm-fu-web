import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { DetalleMovimientosSolicitud } from '../../../model/datalle-movimientos-solicitud';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { Notificacion } from 'src/model/notificacion';
import { NotificacionesService } from './../../services/notificaciones.service';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule,DatePipe,DateMMDDYYYYPipe],
  selector: 'app-dialogo-detalle-movimientos',
  templateUrl: './dialogo-detalle-movimientos.component.html',
  styleUrls: ['./dialogo-detalle-movimientos.component.css'],
  providers: [DatePipe]
})
export class DialogoDetalleMovimientosComponent implements OnInit {

  cargando: boolean = false;
  idSolicitud: number = null;
  detalleMovimientos: DetalleMovimientosSolicitud = new DetalleMovimientosSolicitud();
  notificacion: Notificacion = new Notificacion;
  titulo: string = '';

  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService,
    private movimientoSolicitudService: MovimientoSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoDetalleMovimientosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idSolicitud = data.idSolicitud;
    this.obtenerDetalleMovimientosSolicitud();
  }

  ngOnInit(): void {
    this.titulo = 'Payments for file ' + this.idSolicitud;
  }

  goBack() {
    this.utilService.goBack();
  }

  verSolicitud() {
    this.dialogRef.close("");
    this.router.navigateByUrl('/solicitudes/solicitudes/' + this.idSolicitud);
  }

  obtenerDetalleMovimientosSolicitud() {
    this.cargando = true;
    this.movimientoSolicitudService.obtenerDetalleMovimientosSolicitud(this.idSolicitud)
      .then((detalleMovimientos) => {
        this.detalleMovimientos = detalleMovimientos;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  // enviar() {
  //   let disponibilidadSelected = this.arrDisponibilidadUsuario[this.arrDisponibilidadUsuario.findIndex(disponibilidad => disponibilidad.idDisponibilidad == this.idDisponibilidadSelected)];
  //   console.log(disponibilidadSelected)
  //   this.cargando = true;
  //   let choosePromise = this.interviewerScales ? this.solicitudesService.envioInterviewerScales(this.idSolicitud, this.idUsuario, disponibilidadSelected.idDisponibilidad) : this.solicitudesService.envioSiguienteProceso(this.idSolicitud, this.idUsuario, disponibilidadSelected.idDisponibilidad);
  //   choosePromise
  //   .then(() => {
  //     this.cargando = false;
  //     this.cerrar('enviado');
  //   })
  //   .catch((reason) => this.utilService.manejarError(reason))
  //   .then(() => (this.cargando = false));
  // }

  enviarRecordatorio() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'No-show',
        texto: 'Do you really want to do this action?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        console.log('Enviar recordatorio');
        this.cargando = true;
        this.notificacion.layout = 'Payment';
        this.notificacion.mensaje = true;
        this.notificacion.mail = true;
        this.notificacion.idSolicitud = this.idSolicitud;
        this.notificacion.usuario = "1";
        this.notificacionesService.enviarNotificacion(this.notificacion, null)
          .then(() => {
            this.cargando = false;
            this.cerrar('enviado');

          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));

      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
