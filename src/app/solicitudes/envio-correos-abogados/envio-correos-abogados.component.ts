import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';
import { PaginationManager } from 'src/util/pagination';
import { DialogoNotificacionesComponent } from '../dialogo-notificaciones/dialogo-notificaciones.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,imports: [RouterModule,FormsModule
    ,WorkspaceNavComponent,ExperimentalMenuComponent,
        CommonModule,NgClass,MatIconModule,MatDialogModule,MatProgressSpinnerModule,SolicitudesNavComponent
  ],
  selector: 'app-envio-correos-abogados',
  templateUrl: './envio-correos-abogados.component.html',
  styleUrls: ['./envio-correos-abogados.component.css']
})
export class EnvioCorreosAbogadosComponent implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  arrReporteCorreosEnviados: ReporteCorreosEnviados[] = [];
  paginacion: PaginationManager = new PaginationManager();
  fechaF: string;
  fechaI: string = '2020-01-01';

  seleccion: string[] = [];

  constructor(
    private reportesService: ReportesService,
    public utilService: UtilService,
    private dialog: MatDialog
  ) {
    var today = new Date().toISOString();
    this.fechaF = today.split('T', 1)[0];
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.fechaI = ((date.toISOString()).split('T', 1))[0];

    this.obtenerCorreosEnviados();
  }

  ngOnInit(): void {
  }

  obtenerCorreosEnviados() {
    this.cargando = true;
    this.reportesService.obtenerCorreosEnviados(this.fechaI, this.fechaF)
      .then((reporteCorreosEnviados) => {
        this.arrReporteCorreosEnviados = reporteCorreosEnviados;
        this.paginacion.setArray(this.arrReporteCorreosEnviados,10);
        this.seleccion = [];
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  estanTodosSeleccionados() {
    return this.seleccion.length == this.arrReporteCorreosEnviados.length;
  }

  checkAll() {
    if (this.estanTodosSeleccionados()) this.seleccion = [];
    else {
      this.seleccion = [];
      this.arrReporteCorreosEnviados.forEach(u => this.seleccion.push(u.nombre));
    }
  }

  estaSeleccionado(nombre: string) {
    return this.seleccion.find(e => e == nombre) != null;
  }

  check(event: Event, nombre: string) {
    if ((event.srcElement as HTMLInputElement).checked) {
      //add
      if (!this.estaSeleccionado(nombre)) this.seleccion.push(nombre);
    } else {
      //remove
      if (this.estaSeleccionado(nombre)) this.seleccion.splice(this.seleccion.indexOf(nombre), 1);
    }
  }

  enviarNotificaciones() {
    this.dialog.open(DialogoNotificacionesComponent, {
      data: {
        usuario: this.usuario,
        firmasAbogados: this.seleccion.toString()
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      //if (valor == 'enviado') this.refreshEventosSolicitud();
    }).catch(reason => this.utilService.manejarError(reason));
  }
}
