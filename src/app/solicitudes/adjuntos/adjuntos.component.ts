import { Component, Input, OnInit, Optional,Inject } from '@angular/core';
import { AdjuntosService } from 'src/app/services/adjuntos.service';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { Adjunto } from 'src/model/adjunto';
import { SolicitudComponent } from '../solicitud/solicitud.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { Usuario } from 'src/model/usuario';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  selector: 'app-adjuntos',
  templateUrl: './adjuntos.component.html',
  styleUrls: ['./adjuntos.component.css']
})
export class AdjuntosComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idUsuario: number;
  @Input() idEstatusSolicitud: number;

  mostrarAdjuntos: boolean = true;
  arrAdjunto: Adjunto[] = [];

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
  isTherapist: boolean = false;

  puedeVerlo: boolean = true;

  public file: File[] = [];

  constructor(private adjuntosService: AdjuntosService, private utilService: UtilService,
    private dialog: MatDialog,
    @Optional() @Inject('ParentComponent') public parent: any) {

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    this.isAdministrator = this.usuario.rol == ADMINISTRATOR ? true : false;
    this.isMaster = this.usuario.rol == MASTER ? true : false;
    this.isVendor = this.usuario.rol == VENDOR ? true : false;
    this.isBackOffice = this.usuario.rol == BACKOFFICE ? true : false;
    this.isInterviewer = this.usuario.rol == INTERVIEWER ? true : false;
    this.isVOC = this.usuario.rol == VOC ? true : false;
    this.isTemplateCreator = this.usuario.rol == TEMPLATE_CREATOR ? true : false;
    this.isInterviewerScales = this.usuario.rol == INTERVIEWER_SCALES ? true : false;
    this.isGhostwriting = this.usuario.rol == GHOSTWRITING ? true : false;

    this.mostrarAdjuntos = true;
  }

  ngOnInit(): void {

   

    this.refresh();
    this.mostrarAdjuntos = true;
  }

  mostrarContenido(idUsuarioCargo: number) {

   

    if (idUsuarioCargo != 0) {
      if (this.isInterviewer) {
        if (this.idUsuario != idUsuarioCargo) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }

     

  }


  refresh() {
    this.cargando = true;
    this.adjuntosService.obtenerAdjuntosSolicitud(Number.parseInt(this.idSolicitud))
      .then(response => {
        this.arrAdjunto = response;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  onFileSelected(files: FileList) {
    // this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
    for (let i = 0; i < files.length; i++) {
      this.file.push(files.item(i));
    }
  }

  quitarAdjunto(archivo: File) {
    let start = this.file.findIndex(f => f == archivo);
    this.file.splice(start, 1);
  }

  abrirAdjunto(adjunto: Adjunto) {
    window.open(adjunto.urlImagen, '_blank');
  }

  descargarAdjunto(adjunto: Adjunto) {
    let link = window.document.createElement('a');
    link.href = adjunto.urlImagen;
    link.target = '_blank';
    link.download = adjunto.nombre;
    link.click();
  }

  eliminarAdjunto(adjunto: Adjunto) {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete File',
        texto: 'Do you really want to delete the file?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Delete', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.adjuntosService
          .eliminarAdjunto(adjunto.idImagen, this.idUsuario)
          .then(() => {
            this.refresh();
            this.parent.refreshEventosSolicitud();
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cargarAdjunto() {
    let promises = [];
    this.file.forEach(f => promises.push(this.adjuntosService.insertarAdjunto(Number.parseInt(this.idSolicitud), f, this.idUsuario)));

    this.cargando = true;
    Promise
      .all(promises)
      .then(results => {
        console.log(results);
        this.file = [];
        this.refresh();
        this.parent.refreshEventosSolicitud();
      }).catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }
}
