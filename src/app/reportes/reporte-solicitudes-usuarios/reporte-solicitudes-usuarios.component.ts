import { ReportesService } from './../../services/reportes.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ReporteSolicitudesUsuarios } from 'src/model/reporte-solicitudes-usuarios';
import { PaginationManager } from 'src/util/pagination';
import { DialogoSolicitudesUsuarioComponent } from "src/app/reportes/dialogo-solicitudes-usuario/dialogo-solicitudes-usuario.component";
import { MatDialog } from "@angular/material/dialog";
import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { formatearFecha } from '../../util/date-utils';


export const MY_DATE_FORMATS = {
  parse: { dateInput: 'MM/DD/YYYY' },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
    standalone: true,
    imports: [FormsModule,RouterModule,SolicitudesNavComponent,WorkspaceNavComponent,ExperimentalMenuComponent,
    CommonModule,MatIconModule,MatDialogModule,MatDialogModule, 
    MatDialogContent, 
    MatDialogActions,MatProgressSpinnerModule,ReportesNavComponent,
    MatDatepickerModule,MatInputModule,MatFormFieldModule,MatNativeDateModule,
  MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule],
    selector: 'app-reporte-solicitudes-usuarios',
    templateUrl: './reporte-solicitudes-usuarios.component.html',
    styleUrls: ['./reporte-solicitudes-usuarios.component.css'],
    providers: [
        provideNativeDateAdapter(),
     { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS, }
    ]
})
export class ReporteSolicitudesUsuariosComponent implements OnInit {

    cargando: boolean = false;

    arrReporteSolicitudesUsuarios: ReporteSolicitudesUsuarios[] = [];
    paginacion: PaginationManager = new PaginationManager();
    fechaF: string;
    fechaI: string = '2020-01-01';
    usuario: Usuario = new Usuario();
    baseHref = document.baseURI;
    imageUsuario: string = this.baseHref+'assets/svg/avatar.svg';

    // Propiedades auxiliares para los datepickers de Material
    filterStartDateMat: Date | null = null;
    filterEndDateMat: Date | null = null;

    constructor(
        private dialog: MatDialog,
        private reportesService: ReportesService,
        public utilService: UtilService

    ) {

        this.usuario = JSON.parse(localStorage.getItem('objUsuario'));

        var date = new Date();
        date.setMonth(date.getMonth() - 1);
        this.filterStartDateMat = date ;

        var dateEnd = new Date();
        this.filterEndDateMat = dateEnd ;

        this.fechaI = formatearFecha(this.filterStartDateMat);
        this.fechaF = formatearFecha(this.filterEndDateMat);

        this.obtenerSolicitudesUsuarios();
    }

    ngOnInit(): void {
        console.log('inicio');
    }
    obtenerSolicitudesUsuarios() {
        this.cargando = true;
        this.reportesService.obtenerUsersRequests(this.fechaI, this.fechaF,this.usuario.idUsuario)
            .then((reporteSolicitudesUsuarios) => {
                this.arrReporteSolicitudesUsuarios = reporteSolicitudesUsuarios;
                this.paginacion.setArray(this.arrReporteSolicitudesUsuarios,20);
            })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));
    }

    verSolicitudesUsuario(idUsuario: number,nombre: string){
        if(!nombre.includes("Teraphist")){
        this.dialog.open(DialogoSolicitudesUsuarioComponent, {
                data: {
                  idUsuario: idUsuario,
                  fechaI: this.fechaI,
                  fechaF: this.fechaF
                },
                disableClose: true,
              }).afterClosed().toPromise().then(valor => {
                if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this user.");
              }).catch(reason => this.utilService.manejarError(reason));
            }
    }

    onStartDateChange() {
        if (this.filterStartDateMat) {
          this.fechaI = formatearFecha(this.filterStartDateMat);
        } else {
          this.fechaI = "";
        }

        this.obtenerSolicitudesUsuarios();
      }
    
      onEndDateChange() {
        if (this.filterEndDateMat) {
          this.fechaF = formatearFecha(this.filterEndDateMat);
        } else {
          this.fechaF = "";
        }

        this.obtenerSolicitudesUsuarios();
      }

}
