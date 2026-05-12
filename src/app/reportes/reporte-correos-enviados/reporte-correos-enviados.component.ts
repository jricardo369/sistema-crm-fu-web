import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';
import { PaginationManager } from 'src/util/pagination';
import { DialogoFilesLawyerComponent } from "src/app/reportes/dialogo-files-lawyer/dialogo-files-lawyer.component";
import { MatDialog } from "@angular/material/dialog";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule,WorkspaceNavComponent,ExperimentalMenuComponent,
    CommonModule,MatIconModule,MatDialogModule,MatProgressSpinnerModule,ReportesNavComponent,
  MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule],
  selector: 'app-reporte-correos-enviados',
  templateUrl: './reporte-correos-enviados.component.html',
  styleUrls: ['./reporte-correos-enviados.component.css']
})
export class ReporteCorreosEnviadosComponent implements OnInit {

  expandedRow: number | null = null;

  cargando: boolean = false;

  arrReporteCorreosEnviados: ReporteCorreosEnviados[] = [];
  paginacion: PaginationManager = new PaginationManager();
  fechaF: string;
  fechaI: string = '2020-01-01';

  // Propiedades auxiliares para los datepickers de Material
    filterStartDateMat: Date | null = null;
    filterEndDateMat: Date | null = null;

  constructor(
    private dialog: MatDialog,
    private reportesService: ReportesService,
    public utilService: UtilService
  ) {

     var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.filterStartDateMat = date ;

    var dateEnd = new Date();
    this.filterEndDateMat = dateEnd ;

    this.fechaI = formatearFecha(this.filterStartDateMat);
    this.fechaF = formatearFecha(this.filterEndDateMat);

    this.obtenerCorreosEnviados();

  }

  getMonthsBetweenDates(date1, date2) {

    // Asegurar que date1 sea la menor fecha para el cálculo
    const start = date1 < date2 ? new Date(date1) : new Date(date2);
    const end = date1 < date2 ? new Date(date2) : new Date(date1);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();

    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const endDay = end.getDate();

    // Cálculo base de meses
    let months = (endYear - startYear) * 12 + (endMonth - startMonth);

    // Ajuste por días: si el día del final es menor que el día del inicio
    if (endDay < startDay) {
      months--;
    }

    return months;
  }


  ngOnInit(): void {
  }
  
  obtenerCorreosEnviados() {

    const mesesTranscurridos = this.getMonthsBetweenDates(this.fechaI, this.fechaF);
    console.log(`Meses entre las fechas: ${mesesTranscurridos}`);

    if (mesesTranscurridos > 4) {
      this.utilService.mostrarDialogoSimple("Warning", "It is not possible to consult more than 4 months.");
    } else {

      this.cargando = true;
      this.reportesService.obtenerCorreosEnviados(this.fechaI, this.fechaF)
        .then((reporteCorreosEnviados) => {
          this.arrReporteCorreosEnviados = reporteCorreosEnviados;
          this.paginacion.setArray(this.arrReporteCorreosEnviados, 15);
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
    }

  }

  descargarExcel() {

    this.cargando = true;
    this.reportesService.obtenerFilesFirmasAbogadosExcel(this.fechaI, this.fechaF)
      .subscribe(
        data => {
          const file = new Blob([data], { type: 'application/vnd.ms-excel' });
          var fileUrl = URL.createObjectURL(file);
          let link: any = window.document.createElement('a');
          link.href = fileUrl;
          let aux = fileUrl.split('/');
          link.download = aux[aux.length - 1] + ".xlsx";
          link.click();
          this.cargando = false;
        }
      )

  }

  verSolicitudesLawyer(nombre: string,idAbogado: number,firma: string) {

    this.dialog.open(DialogoFilesLawyerComponent, {
      data: {
        nombre: nombre,
        fechaI: this.fechaI,
        fechaF: this.fechaF,
        idAbogado: idAbogado,
        firma: firma
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this user.");
    }).catch(reason => this.utilService.manejarError(reason));

  }

  limpiarFechas() {
    this.fechaI = "";
    this.fechaF = "";
  }

  onStartDateChange() {
    if (this.filterStartDateMat) {
      this.fechaI = formatearFecha(this.filterStartDateMat);
    } else {
      this.fechaI = "";
    }
     this.obtenerCorreosEnviados();
  }

  onEndDateChange() {
    if (this.filterEndDateMat) {
      this.fechaF = formatearFecha(this.filterEndDateMat);
    } else {
      this.fechaF = "";
    }
     this.obtenerCorreosEnviados();
  }

}
