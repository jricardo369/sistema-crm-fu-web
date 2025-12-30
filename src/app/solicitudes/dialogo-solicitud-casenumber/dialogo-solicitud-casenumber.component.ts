import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { UtilService } from 'src/app/services/util.service';
import { SolicitudNumeroCaso } from 'src/model/solicitud-numerocaso';
import { PaginationManager } from 'src/util/pagination';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-solicitud-casenumber',
  templateUrl: './dialogo-solicitud-casenumber.component.html',
  styleUrls: ['./dialogo-solicitud-casenumber.component.css']
})
export class DialogoSolicitudCasenumberComponent implements OnInit {

  cargando: boolean = false;
    numeroCaso: string = "";
    arrSolicitudNumeroCaso: SolicitudNumeroCaso[] = [];
    paginacion: PaginationManager = new PaginationManager();
  
    constructor(private solicitudesVocService: SolicitudesVocService,
      public utilService: UtilService,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogoSolicitudCasenumberComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        this.numeroCaso = data.numeroCaso;
  
        this.paginacion.size = 5;
  
        this.obtenerSolicitudesDeNumeroCasos();
      }
  
    ngOnInit(): void {
    }
  
    obtenerSolicitudesDeNumeroCasos() {
      this.cargando = true;
      this.solicitudesVocService.obtenerSolicitudesDeNumerosCasos(this.numeroCaso)
        .then((solicitudTelefono) => {
          this.arrSolicitudNumeroCaso = solicitudTelefono;
          if(!(this.arrSolicitudNumeroCaso.length > 0)) {
            this.cerrar("vacio");
          }
          this.paginacion.setArray(this.arrSolicitudNumeroCaso,10);
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
    }
  
    cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
