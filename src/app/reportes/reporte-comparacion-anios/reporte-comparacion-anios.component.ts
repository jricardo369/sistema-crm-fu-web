import { Component, OnInit } from '@angular/core';
import { EstatusSolicitudService } from 'src/app/services/estatus-solicitud.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UtilService } from 'src/app/services/util.service';
import { EstatusSolicitud } from 'src/model/estatus-solicitud';
import { ReporteComparacionAnios } from 'src/model/reporte-comparacion-anios';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';
import { PaginationManager } from 'src/util/pagination';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatDialogModule } from '@angular/material/dialog';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,WorkspaceNavComponent,ExperimentalMenuComponent,
    CommonModule,MatIconModule,MatDialogModule,MatProgressSpinnerModule,ReportesNavComponent],
  selector: 'app-reporte-comparacion-anios',
  templateUrl: './reporte-comparacion-anios.component.html',
  styleUrls: ['./reporte-comparacion-anios.component.css']
})
export class ReporteComparacionAniosComponent implements OnInit {

  cargando: boolean = false;

  reporteComparacionAnios: ReporteComparacionAnios = new ReporteComparacionAnios();
  inputYear: number = null;
  inputFileStatus: string = "";

  arrFilterFileStatus: EstatusSolicitud[] = [{
    "idEstatusSolicitud": 0,
    "descripcion": "All"
  }];
  arrYears: number[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private estatusSolicitudService: EstatusSolicitudService,
    public utilService: UtilService
  ) {
    this.inputYear = new Date().getFullYear();
    this.inputFileStatus = "All";
    console.log('cargando reporte');
    this.cargando = true;
    this.obtenerReporteComparacionAnios();
  }

  ngOnInit(): void {
    
  }

  obtenerEstatusSolicitudes() {
    this.cargando = true;
    this.estatusSolicitudService
      .obtenerEstatusSolicitudes()
      .then(estatusSolicitudes => {
        this.arrFilterFileStatus = estatusSolicitudes;
        this.arrFilterFileStatus = [{
          "idEstatusSolicitud": 0,
          "descripcion": "All"
        }].concat(this.arrFilterFileStatus);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerReporteComparacionAnios() {
    this.cargando = true;
    this.solicitudesService.obtenerReporteComparacionAnios(this.inputYear, this.inputFileStatus)
      .then((reporteComparacionAnios) => {
        this.reporteComparacionAnios = reporteComparacionAnios;
        this.obtenerEstatusSolicitudes();
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }
}
