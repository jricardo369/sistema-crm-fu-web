import { Component, Input, OnInit, Optional,Inject } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { Adjunto } from 'src/model/adjunto';
import { MatDialog } from '@angular/material/dialog';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { AdjuntosVocService } from 'src/app/services/adjuntos-voc.service';
import { SolicitudVocComponent } from '../solicitud-voc/solicitud-voc.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule],
  selector: 'app-adjuntos-voc',
  templateUrl: './adjuntos-voc.component.html',
  styleUrls: ['./adjuntos-voc.component.css']
})
export class AdjuntosVocComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idUsuario: number;
  @Input() idEstatusSolicitud: number;

  mostrarAdjuntos: boolean = true;
  arrAdjunto: Adjunto[] = [];

  cargando: boolean = false;

  public file: File[] = [];

  constructor(private adjuntosVocService: AdjuntosVocService, private utilService: UtilService,
    private dialog: MatDialog,
    @Optional() @Inject('ParentComponent') public parent: any) {
    this.mostrarAdjuntos = true;
  }

  ngOnInit(): void {
    this.refresh();
    this.mostrarAdjuntos = true;
  }


  refresh() {
    this.cargando = true;
    this.adjuntosVocService.obtenerAdjuntosSolicitud(Number.parseInt(this.idSolicitud))
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
        this.adjuntosVocService
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
    this.file.forEach(f => promises.push(this.adjuntosVocService.insertarAdjunto(Number.parseInt(this.idSolicitud), f, this.idUsuario)));

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
