import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteMovimientos } from 'src/model/reporte-movimientos';
import { ReporteAdeudosUsuario } from 'src/model/reporte-adeudos-usuario';
import { Usuario } from 'src/model/usuario';
import { DialogoDetalleMovimientosComponent } from '../dialogo-detalle-movimientos/dialogo-detalle-movimientos.component';
import { PaginationManager } from 'src/util/pagination';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';
import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';

import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule,WorkspaceNavComponent,ExperimentalMenuComponent,ReportesNavComponent,CommonModule,MatIconModule,MatProgressSpinnerModule,
    DatePipe,DateMMDDYYYYPipe,PhonePipe,
    MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule
  ],
  selector: 'app-reporte-movimientos-usuario',
  templateUrl: './reporte-movimientos-usuario.component.html',
  styleUrls: ['./reporte-movimientos-usuario.component.css'],
  providers: [DatePipe]
})
export class ReporteMovimientosUsuarioComponent implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

    paginacion: PaginationManager = new PaginationManager();

  reporteMovimientos: ReporteMovimientos = new ReporteMovimientos;
  adeudos: ReporteAdeudosUsuario[] = [];
  adeudosSinFiltrar: ReporteAdeudosUsuario[] = [];
  fechaF: string;
  fechaI: string = '2020-01-01';
  inputCliente: string = "";
  inputTipoReporte: string = "1";
  arrFilterType: string[] = ['All','Unpaid','Paid'];
  arrFilterTypeF: string[] = ['All','Customer','File','Phone','Email'];
  filterType: string = "";
  filterTypeF: string = "";
  filterInputText: string = "";

   mostrarEncabecadoPagos: boolean = false;
  mostrarEncabecadoNoPagos: boolean = false;
   mostrarEncabecadoBalance: boolean = false;

  // Propiedades auxiliares para los datepickers de Material
    filterStartDateMat: Date | null = null;
    filterEndDateMat: Date | null = null;

  constructor(
    private movimientoSolicitudService: MovimientoSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog
  ) {

    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.filterStartDateMat = date ;

    var dateEnd = new Date();
    this.filterEndDateMat = dateEnd ;

    this.fechaI = formatearFecha(this.filterStartDateMat);
    this.fechaF = formatearFecha(this.filterEndDateMat);

    this.filterType = 'Unpaid';
    this.filterTypeF = 'All';
    this.obtenerMovimientosUsuario();
  }

  ngOnInit(): void {
  }

  obtenerMovimientosUsuario() {
    let servicio: Promise<ReporteMovimientos> = null;
    switch (this.inputTipoReporte) {
      case "1":
        servicio = this.movimientoSolicitudService.obtenerReporteAdeudos(this.inputCliente, this.fechaI, this.fechaF, this.usuario.idUsuario,this.filterType,this.filterTypeF,this.filterInputText);
        break;
      case "2":
        servicio = this.movimientoSolicitudService.obtenerReporteMovimientos(this.inputCliente, this.fechaI, this.fechaF);
        break;
      default:
        break;
    }
    this.cargando = true;
    servicio
      .then((reporteMovimientos) => {
        this.reporteMovimientos = reporteMovimientos;

        this.adeudosSinFiltrar = this.reporteMovimientos.adeudos;
        this.adeudos = this.adeudosSinFiltrar.filter(e => true);

        if(this.filterType == 'All' ) {
      this.mostrarEncabecadoPagos = true;
       this.mostrarEncabecadoNoPagos = true;
       this.mostrarEncabecadoBalance = true;
    }else if(this.filterType == 'Unpaid'){ 
      this.mostrarEncabecadoPagos = false;
      this.mostrarEncabecadoNoPagos = true;
      this.mostrarEncabecadoBalance = false;
    }else if(this.filterType == 'Paid'){ 
      this.mostrarEncabecadoPagos = true;
      this.mostrarEncabecadoNoPagos = false;
      this.mostrarEncabecadoBalance = false;
    }
       
        this.paginacion.setArray(this.adeudos,20);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }
  

  abrirDetalle(idSolicitud: number) {
    this.dialog.open(DialogoDetalleMovimientosComponent, {
      data: {
        idSolicitud: idSolicitud
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      //if (valor == 'enviado') this.goBack();
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

      }
    
      onEndDateChange() {
        if (this.filterEndDateMat) {
          this.fechaF = formatearFecha(this.filterEndDateMat);
        } else {
          this.fechaF = "";
        }

      }

}
