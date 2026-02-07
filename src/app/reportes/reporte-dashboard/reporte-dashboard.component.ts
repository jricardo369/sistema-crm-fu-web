import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { Solicitud } from 'src/model/solicitud';
import { ReporteDetSols } from "src/model/reporte-det-sols";
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { ReporteDash } from 'src/model/reporte-dash';
import { SolicitudList } from 'src/model/solicitud-list';
import { ReportesService } from 'src/app/services/reportes.service';
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

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';
import { DatePipe } from '@angular/common';

import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Stats {
  activeFiles: number;
  completeFiles: number;
  canceledFiles: number;
  noShowFiles: number;
  refusedFiles: number;
}

@Component({
  standalone: true, imports: [RouterModule, FormsModule, WorkspaceNavComponent, ExperimentalMenuComponent,
    CommonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, ReportesNavComponent, DateMMDDYYYYPipe, DatePipe, PhonePipe,
  MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule],
  selector: 'app-reporte-dashboard',
  templateUrl: './reporte-dashboard.component.html',
  styleUrls: ['./reporte-dashboard.component.css'],
  providers: [
    DatePipe
  ]
})
export class ReporteDashboardComponent implements OnInit {


  solicitudes: SolicitudList[] = [];
  solicitudesSinFiltrar: SolicitudList[] = [];
  eventos: EventoSolicitud[] = [];
  eventosSinFiltrar: EventoSolicitud[] = [];
  detSols: ReporteDetSols[] = [];
  detSolsSinFiltrar: ReporteDetSols[] = [];
  reporteDash: ReporteDash = new ReporteDash();
  paginacion: PaginationManager = new PaginationManager();

  stats: Stats | null = null;
  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  arrFilterUsuarios: Usuario[] = [];
  usuarioAll: Usuario = new Usuario();
  filterUsuario: number = 0;
  fechaF: string;
  fechaI: string = '2020-01-01';
  tituloEventos: string;
  tileDashSelected: number;

  // Propiedades auxiliares para los datepickers de Material
    filterStartDateMat: Date | null = null;
    filterEndDateMat: Date | null = null;

  constructor(
    private usuariosService: UsuariosService,
    public utilService: UtilService,
    private reportesService: ReportesService,
  ) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.filterStartDateMat = date ;

    var dateEnd = new Date();
    this.filterEndDateMat = dateEnd ;

    this.fechaI = formatearFecha(this.filterStartDateMat);
    this.fechaF = formatearFecha(this.filterEndDateMat);


    this.obtenerUsuarios();
    this.obtenerDatosDash();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Aquí iría tu lógica para cargar las estadísticas
    // Esto es solo un ejemplo con datos estáticos
    this.stats = {
      activeFiles: 25,
      completeFiles: 5,
      canceledFiles: 3,
      noShowFiles: 6,
      refusedFiles: 2
    };
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.usuariosService
      .obtenerUsuariosParaDash(this.usuario.idUsuario)
      .then(usuarios => {
        this.arrFilterUsuarios = usuarios;
        this.arrFilterUsuarios = [this.usuarioAll].concat(this.arrFilterUsuarios);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  refresh() {
    this.solicitudes = [];
    this.obtenerDatosDash();
  }

  obtenerDatosDash() {

    this.solicitudes = [];
    this.eventos = [];
     this.detSols = [];

    //console.log('usuarioselect:'+this.filterUsuario);

    if (this.filterUsuario === undefined) {
      this.filterUsuario = 0;
    }

    this.cargando = true;
    this.reportesService
      .obtenerDashboard(this.fechaI, this.fechaF, this.usuario.idUsuario, this.filterUsuario)
      .then(reporteDash => {
        this.reporteDash = reporteDash;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerDetalleSolicitudes(tileDash: number) {

    this.solicitudes = [];
    this.eventos = [];

    //console.log('usuarioselect:'+this.filterUsuario);
    if (this.filterUsuario === undefined) {
      this.filterUsuario = 0;
    }

    this.cargando = true;
    this.reportesService
      .obtenerDetalleDashboard(this.fechaI, this.fechaF, this.usuario.idUsuario, this.filterUsuario, tileDash)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes, 10);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerDetallesSolicitudes(tileDash: number, titulo: string) {

    //console.log('tileDashSelected: ' + tileDash);
    var valor = 0;

    if(tileDash == 1){
      valor = this.reporteDash.activas;
    }
    if(tileDash == 2){
      valor = this.reporteDash.completas;
    }
    if(tileDash == 3){
      valor = this.reporteDash.lost;
    }
    //console.log('valor: ' + valor);

    if(valor != 0){

      this.tileDashSelected = tileDash
      this.tituloEventos = titulo;

      this.solicitudes = [];
      this.eventos = [];
      this.detSols = [];

      //console.log('usuarioselect:'+this.filterUsuario);
      if (this.filterUsuario === undefined) {
        this.filterUsuario = 0;
      }

      this.cargando = true;
      this.reportesService
        .obtenerDetalleSolsDashboard(this.fechaI, this.fechaF, this.usuario.idUsuario, this.filterUsuario, tileDash)
        .then(solicitudes => {
          this.solicitudesSinFiltrar = solicitudes;
          this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
          this.paginacion.setArray(this.solicitudes, 10);
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);

    }else{
      this.solicitudes = [];
      this.eventos = [];
    }

  }

  obtenerDetalleEventosSolicitudes(tileDash: number, titulo: string) {

    //console.log('tileDashSelected: ' + tileDash);
    var valor = 0;

    if(tileDash == 4){
      valor = this.reporteDash.noShow;
    }
    if(tileDash == 5){
      valor = this.reporteDash.rejectFile;
    }
    if(tileDash == 6){
      valor = this.reporteDash.cancelSchedules;
    }
    if(tileDash == 7){
      valor = this.reporteDash.ventas;
    }
    //console.log('valor: ' + valor);

    if(valor != 0){

      this.tituloEventos = titulo;
      this.solicitudes = [];
      this.eventos = [];
      this.detSols = [];

      //console.log('usuarioselect:'+this.filterUsuario);
      if (this.filterUsuario === undefined) {
        this.filterUsuario = 0;
      }

      this.cargando = true;
      this.reportesService
        .obtenerDetalleEventosDashboard(this.fechaI, this.fechaF, this.usuario.idUsuario, this.filterUsuario, tileDash)
        .then(eventos => {
          this.eventosSinFiltrar = eventos;
          this.eventos = this.eventosSinFiltrar.filter(e => true);
          this.paginacion.setArray(this.eventos, 10);
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);

    }else{
      this.solicitudes = [];
      this.eventos = [];
    }

  }


  obtenerDetalleSols(titulo: string) {

    this.tituloEventos = titulo;
    this.solicitudes = [];
    this.eventos = [];
    this.detSols = [];

    //console.log('usuarioselect:'+this.filterUsuario);
    if (this.filterUsuario === undefined) {
      this.filterUsuario = 0;
    }

    this.cargando = true;
    this.reportesService
      .reporteDetalleSolsFechas(this.usuario.idUsuario, this.fechaI, this.fechaF, this.filterUsuario)
      .then(detSolsS => {

        this.detSolsSinFiltrar = detSolsS;
        this.detSols = this.detSolsSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.detSols, 10);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);

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
