import { Component, Input, OnInit, Optional,EventEmitter, Output  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { MovimientoSolicitud } from 'src/model/movimiento-solicitud';
import { DialogoMovimientoSolicitudComponent } from '../dialogo-movimiento-solicitud/dialogo-movimiento-solicitud.component';
import { Usuario } from 'src/model/usuario';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule],
  selector: 'app-movimientos-solicitud',
  templateUrl: './movimientos-solicitud.component.html',
  styleUrls: ['./movimientos-solicitud.component.css']
})
export class MovimientosSolicitudComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idUsuario: number;
  @Input() idEstatusSolicitud: number;
  @Output() actionCompleted = new EventEmitter<void | any>();

  mostrarMovimientos: boolean = true;
  arrMovimientoSolicitud: MovimientoSolicitud[] = [];

  cargando: boolean = false;

  usuario: Usuario = new Usuario();
  isAdministrator: boolean = false;
  isMaster: boolean = false;
  isVendor: boolean = false;
  isBackOffice: boolean = false;
  isInterviewer: boolean = false;
  isVOC: boolean = false;
  isTemplateCreator: boolean = false;
  isInterviewerScales: boolean = false;
  isGhostwriting: boolean = false;

  constructor(
    private movimientoSolicitudService: MovimientoSolicitudService,
    private utilService: UtilService,
    private dialog: MatDialog) {
    this.mostrarMovimientos = true;

    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
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
    this.refresh();
    this.mostrarMovimientos = true;
  }


  refresh() {
    this.cargando = true;
    this.movimientoSolicitudService
      .obtenerMovimientosSolicitud(Number.parseInt(this.idSolicitud))
      .then(response => {
        this.arrMovimientoSolicitud = response;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  agregarMovimiento() {
    this.dialog.open(DialogoMovimientoSolicitudComponent, {
      data: {
        idSolicitud: this.idSolicitud,
        idUsuario: this.idUsuario
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      //if (valor == 'creado') { this.refresh(); this.parent.obtenerSolicitud(parseInt(this.idSolicitud)); this.parent.refreshEventosSolicitud(); };
      if (valor == 'creado') { this.refresh(); };
      this.actionCompleted.emit("ok");
    }).catch(reason => this.utilService.manejarError(reason));
  }

  eliminarMovimiento(movimiento: MovimientoSolicitud) {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete movement',
        texto: 'Do you really want to delete the movement?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Delete', color: 'primary', valor: 'eliminar' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'eliminar') {
        this.cargando = true;
        this.movimientoSolicitudService
          .eliminarMovimientoSolicitud(movimiento.idMovimiento, this.usuario.idUsuario)
          //.then(() => { this.refresh(); this.parent.obtenerSolicitud(parseInt(this.idSolicitud)); this.parent.refreshEventosSolicitud(); })
           .then(() => { this.refresh(); this.actionCompleted.emit("ok");})
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));

  }

}
