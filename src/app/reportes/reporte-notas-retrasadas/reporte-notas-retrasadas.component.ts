import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { formatearFecha } from '../../util/date-utils';
import { ReporteNotasRetrasadas } from 'src/model/reporte-notas-retrasadas';
import { NotaRetrasada } from 'src/model/nota-retrasada';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { THERAPIST } from 'src/app/app.config';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, WorkspaceNavComponent, ExperimentalMenuComponent, SolicitudesNavComponent, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, DateMMDDYYYYPipe],
  selector: 'app-reporte-notas-retrasadas',
  templateUrl: './reporte-notas-retrasadas.component.html',
  styleUrls: ['./reporte-notas-retrasadas.component.css'],
  providers: [
    DatePipe
  ]
})
export class ReporteNotasRetrasadasComponent implements OnInit {

  resumen: ReporteNotasRetrasadas[] = [];
  resumenFiltrado: ReporteNotasRetrasadas[] = [];
  paginacionResumen: PaginationManager = new PaginationManager();

  detalle: NotaRetrasada[] = [];
  paginacionDetalle: PaginationManager = new PaginationManager();

  terapeutas: Usuario[] = [];
  usuarioAll: Usuario = new Usuario();
  filterTerapeuta: number = 0;

  terapeutaSeleccionado: string = '';

  cargando: boolean = false;

  fechaF: string = '';
  fechaI: string = '';
  filterStartDateMat: Date | null = null;
  filterEndDateMat: Date | null = null;

  constructor(
    private reportesService: ReportesService,
    private usuariosService: UsuariosService,
    private utilService: UtilService,
  ) {
    this.usuarioAll.idUsuario = 0;
    this.usuarioAll.nombre = 'All';

    var date = new Date();
    this.filterStartDateMat = new Date(date.getFullYear(), date.getMonth(), 1);
    this.filterEndDateMat = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.fechaI = formatearFecha(this.filterStartDateMat);
    this.fechaF = formatearFecha(this.filterEndDateMat);
  }

  ngOnInit(): void {
    this.obtenerTerapeutas();
    this.obtenerResumen();
  }

  obtenerTerapeutas() {
    this.usuariosService.obtenerUsuariosPorRol(parseInt(THERAPIST))
      .then((usuarios) => {
        this.terapeutas = [this.usuarioAll].concat(usuarios);
      })
      .catch((reason) => this.utilService.manejarError(reason));
  }

  onStartDateChange() {
    if (this.filterStartDateMat) {
      this.fechaI = formatearFecha(this.filterStartDateMat);
    } else {
      this.fechaI = "";
    }
    this.refresh();
  }

  onEndDateChange() {
    if (this.filterEndDateMat) {
      this.fechaF = formatearFecha(this.filterEndDateMat);
    } else {
      this.fechaF = "";
    }
    this.refresh();
  }

  refresh() {
    this.detalle = [];
    this.terapeutaSeleccionado = '';
    this.obtenerResumen();
  }

  obtenerResumen() {
    this.cargando = true;
    this.reportesService.obtenerNotasCitasTerapeutasRangoFechas(this.fechaI, this.fechaF)
      .then((resumen) => {
        this.resumen = resumen;
        this.aplicarFiltroTerapeuta();
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  aplicarFiltroTerapeuta() {
    if (this.filterTerapeuta > 0) {
      const terapeuta = this.terapeutas.find(t => t.idUsuario === this.filterTerapeuta);
      this.resumenFiltrado = this.resumen.filter(r => terapeuta ? r.nombre === terapeuta.nombre : true);
    } else {
      this.resumenFiltrado = this.resumen.slice();
    }
    this.paginacionResumen.setArray(this.resumenFiltrado, 10);
  }

  onTerapeutaChange() {
    this.aplicarFiltroTerapeuta();
  }

  verDetalle(row: ReporteNotasRetrasadas) {
    this.terapeutaSeleccionado = row.nombre;
    const terapeuta = this.terapeutas.find(t => t.nombre === row.nombre);
    if (!terapeuta) {
      this.detalle = [];
      return;
    }
    this.cargando = true;
    this.reportesService.obtenerNotasCitasTerapeutasDetalleRangoFechas(terapeuta.idUsuario, this.fechaI, this.fechaF)
      .then((detalle) => {
        this.detalle = detalle;
        this.paginacionDetalle.setArray(this.detalle, 10);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

}
