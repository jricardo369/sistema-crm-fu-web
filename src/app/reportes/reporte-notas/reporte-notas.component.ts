import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { NotaCitaService } from 'src/app/services/nota-cita.service';
import { formatearFecha } from '../../util/date-utils';
import { UtilService } from 'src/app/services/util.service';
import { ReporteNotasCitas } from 'src/model/reporte-notas-citas';
import { NotaCita } from 'src/model/nota-cita';
import { EventoDescargaCita } from 'src/model/evento-descarga-cita';
import { PaginationManager } from 'src/util/pagination';
import { EventoSolicitudVocService } from 'src/app/services/evento-solicitud-voc.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, WorkspaceNavComponent, ExperimentalMenuComponent, MatIconModule, MatDialogModule, MatProgressSpinnerModule, ReportesNavComponent, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, DateMMDDYYYYPipe],
  selector: 'app-reporte-notas',
  templateUrl: './reporte-notas.component.html',
  styleUrls: ['./reporte-notas.component.css'],
  providers: [
    DatePipe
  ]
})
export class ReporteNotasComponent implements OnInit {

  reporteNotasCitas: ReporteNotasCitas = new ReporteNotasCitas();

  notas: NotaCita[] = [];
  paginacion: PaginationManager = new PaginationManager();

  notasDescarga: EventoDescargaCita[] = [];
  paginacionDescarga: PaginationManager = new PaginationManager();

  verNotas: boolean = false;
  verNotasDescarga: boolean = false;

  cargando: boolean = false;

  fechaF: string = '';
  fechaI: string = '';
  filterStartDateMat: Date | null = null;
  filterEndDateMat: Date | null = null;

  constructor(
    private reportesService: ReportesService,
    private notaCitaService: NotaCitaService,
    private eventoSolicitudVocService: EventoSolicitudVocService,
    private utilService: UtilService,
  ) {

    var date = new Date();
    this.filterStartDateMat = new Date(date.getFullYear(), date.getMonth(), 1);
    this.filterEndDateMat = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.fechaI = formatearFecha(this.filterStartDateMat);
    this.fechaF = formatearFecha(this.filterEndDateMat);

  }

  ngOnInit(): void {
    this.obtenerNotasCitas();
  }

  onStartDateChange() {
    if (this.filterStartDateMat) {
      this.fechaI = formatearFecha(this.filterStartDateMat);
    } else {
      this.fechaI = "";
    }
  }

  onEndDateChange() {
    if (this.filterEndDateMat) {
      this.fechaF = formatearFecha(this.filterEndDateMat);
    } else {
      this.fechaF = "";
    }
  }

  refresh() {
    this.obtenerNotasCitas();
  }

  obtenerNotas() {
    this.notas = [];
    this.cargando = true;
    this.verNotas = true;
    this.verNotasDescarga = false;
    this.notaCitaService.obtenerNotasCitasRangoFechas(this.fechaI, this.fechaF)
      .then((notas) => {
        this.notas = notas;
        this.paginacion.setArray(this.notas, 10);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerNotasDescarga() {
    this.notasDescarga = [];
    this.cargando = true;
    this.verNotas = false;
    this.verNotasDescarga = true;
    this.eventoSolicitudVocService.obtenerEventosDescargaCita(this.fechaI, this.fechaF)
      .then((notasDescarga) => {
        this.notasDescarga = notasDescarga;
        this.paginacionDescarga.setArray(this.notasDescarga, 10);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerNotasCitas() {
    this.cargando = true;
    this.reportesService.obtenerNotasCitasRangoFechas(this.fechaI, this.fechaF)
      .then((rep) => {
        this.reporteNotasCitas = rep;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

}
