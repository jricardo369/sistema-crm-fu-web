import { Component, Input, OnInit, Optional,Inject,Output, EventEmitter } from '@angular/core';


import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { DialogoCitaSolicitudComponent } from '../dialogo-cita-solicitud/dialogo-cita-solicitud.component';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { DialogoNoShowYRejectSolicitudComponent } from '../dialogo-no-show-y-reject-solicitud/dialogo-no-show-y-reject-solicitud.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DatePipe } from '@angular/common';

@Component({
  standalone: true,imports: [RouterModule,FormsModule
    ,WorkspaceNavComponent,ExperimentalMenuComponent,
        CommonModule,NgClass,AsyncPipe,MatIconModule,MatDialogModule,MatProgressSpinnerModule,
  ],
  selector: 'app-citas-solicitud',
  templateUrl: './citas-solicitud.component.html',
  styleUrls: ['./citas-solicitud.component.css'],
  providers: [
    DatePipe
  ]
})
export class CitasSolicitudComponent implements OnInit {

  @Output() citaActualizada = new EventEmitter<void>();

  @Input() idSolicitud: string;
  @Input() idUsuario: number;

  mostrarCitas: boolean = true;
  arrCitaSolicitud: CitaSolicitud[] = [];
  paginacion: PaginationManager = new PaginationManager();

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    private utilService: UtilService,
    private dialog: MatDialog,
    @Optional() @Inject('ParentComponent') public parent: any) {
    this.mostrarCitas = true;
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
  }

  ngOnInit(): void {
    this.refresh();
    this.mostrarCitas = true;
  }

  recibirMensaje(texto: string) {
    console.log("Mensaje recibido: " + texto);
    this.refresh();
  }


  refresh() {
    this.cargando = true;
    this.citaSolicitudService
      .obtenerCitasSolicitud(Number.parseInt(this.idSolicitud))
      .then(response => {
        this.arrCitaSolicitud = response;
        this.paginacion.setArray(this.arrCitaSolicitud,10);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  crearCita() {
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: this.idSolicitud,
        creando: true,
        verCampoSolicitud: false
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'guardar') { this.refresh();  this.citaActualizada.emit();};
    }).catch(reason => this.utilService.manejarError(reason));
  }

  verCita(cita: CitaSolicitud) {
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: this.idSolicitud,
        creando: false,
        verCampoSolicitud: false,
        citaSolicitud: cita
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
       this.refresh();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  no_show(cita: CitaSolicitud) {

    this.dialog.open(DialogoNoShowYRejectSolicitudComponent, {
      data: {
        titulo: "No show",
        tipo: "noshowvoc",
        idCita: cita.idCita,
        tituloLabel: "Reason for no show"
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      /*if (valor == 'enviado') { this.parent.obtenerSolicitud(parseInt(this.idSolicitud)); }
      else if (valor == 'vacio') { this.utilService.mostrarDialogoSimple("Error", "Error"); }*/
      this.parent.refreshSolicitudCompletaByIdSolicitud(parseInt(this.idSolicitud));
      
    }).catch(reason => this.utilService.manejarError(reason));


    /*
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'No-show',
        texto: 'Do you really want to mark your appointment as a No show"?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.citaSolicitudService
          .no_show(cita.idCita, this.usuario.idUsuario)
          .then(() => { this.refresh(); 
            this.parent.obtenerSolicitud(parseInt(this.idSolicitud));
            })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
    */

  }

  eliminarCita(cita: CitaSolicitud) {

    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete schedule',
        texto: 'Do you really want to delete this schedule? The information cannot be recovered once deleted',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.citaSolicitudService
          .deleteCita(cita.idCita, this.usuario.idUsuario)
          .then(response => {

            this.refresh();
            this.utilService.mostrarDialogoSimple("Info", "The schedule has been deleted successfully");

          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => { this.cargando = false;this.parent.obtenerSolicitud(parseInt(this.idSolicitud));
             this.parent.eventosSolicitudComponent.refresh();
           });
      }
    }).catch(reason => this.utilService.manejarError(reason));



  }

}
