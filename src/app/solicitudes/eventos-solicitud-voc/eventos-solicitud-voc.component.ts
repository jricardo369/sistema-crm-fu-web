import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { EventoSolicitudVocService } from 'src/app/services/evento-solicitud-voc.service';
import { DialogoEventoSolicitudVocComponent } from '../dialogo-evento-solicitud-voc/dialogo-evento-solicitud-voc.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { THERAPIST, VOC } from 'src/app/app.config';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-eventos-solicitud-voc',
  templateUrl: './eventos-solicitud-voc.component.html',
  styleUrls: ['./eventos-solicitud-voc.component.css']
})
export class EventosSolicitudVocComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idEstatusSolicitud: number;

   isTherapist: boolean = false;
    isVOC: boolean = false;

  mostrarEventos: boolean = true;
  verEventos: boolean = true;
  arrEventoSolicitud: EventoSolicitud[] = [];
  paginacion: PaginationManager = new PaginationManager();

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  constructor(
      private eventoSolicitudVocService: EventoSolicitudVocService,
      private utilService: UtilService,
      private dialog: MatDialog) {
      this.mostrarEventos = true;
      this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
      this.verEventos = false;

      this.isTherapist = this.usuario.rol == THERAPIST ? true : false;
          this.isVOC = this.usuario.rol == VOC ? true : false;
  }

  ngOnInit(): void {
      this.refresh();
      this.mostrarEventos = true;
      this.verEventos = false;
  }


  refresh() {
      this.cargando = true;
      this.eventoSolicitudVocService
          .obtenerEventosSolicitud(Number.parseInt(this.idSolicitud), this.usuario.idUsuario)
          .then(response => {
              this.arrEventoSolicitud = response;
              this.paginacion.setArray(this.arrEventoSolicitud,10);
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false)
  }

    actualizarTipoEvento(idEvento: number, tipoEvento: string) {


        this.dialog.open(DialogoSimpleComponent, {
            data: {
                titulo: 'Change event type',
                texto: 'Do you really want to change the event type from Important to Info?',
                botones: [
                    { texto: 'Cancel', color: '', valor: '' },
                    { texto: 'Yes', color: 'primary', valor: 'ok' },
                ]
            },
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'ok') {

                this.cargando = true;
                this.eventoSolicitudVocService
                    .actualizarTipoEventoSolicitudVoc(idEvento, tipoEvento)
                    .then(response => {
                        this.refresh();
                    })
                    .catch(reason => this.utilService.manejarError(reason))
                    .then(() => this.cargando = false);

            }
        }).catch(reason => this.utilService.manejarError(reason));

    }

  crearEvento() {
      this.dialog.open(DialogoEventoSolicitudVocComponent, {
          data: {
              idSolicitud: this.idSolicitud
          },
          disableClose: true,
      }).afterClosed().toPromise().then(valor => {
          if (valor == 'creado') this.refresh();
      }).catch(reason => this.utilService.manejarError(reason));
      
  }
}
