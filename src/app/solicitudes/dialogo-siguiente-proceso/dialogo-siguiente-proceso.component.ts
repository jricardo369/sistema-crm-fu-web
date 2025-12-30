import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { DisponibilidadUsuario } from 'src/model/disponibilidad-usuario';
import { PaginationManager } from 'src/util/pagination';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule,DateMMDDYYYYPipe],
  selector: 'app-dialogo-siguiente-proceso',
  templateUrl: './dialogo-siguiente-proceso.component.html',
  styleUrls: ['./dialogo-siguiente-proceso.component.css'],
  providers:[
    DatePipe
  ]
})
export class DialogoSiguienteProcesoComponent implements OnInit {

  cargando: boolean = false;

  fecha: string = "";
  fechaAnterior: boolean = false;

  arrDisponibilidadUsuario: DisponibilidadUsuario[] = [];
  paginacion: PaginationManager = new PaginationManager();
  idDisponibilidadSelected: number = null;
  idSolicitud: number = null;
  idUsuario: number = null;
  interviewerCaseManager: boolean = false;
  interviewerScales: boolean = false;
  interviewerClinician: boolean = false;

  constructor(
    private disponibilidadUsuariosService: DisponibilidadUsuariosService,
    private solicitudesService: SolicitudesService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoSiguienteProcesoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.idSolicitud = data.idSolicitud;
      this.idUsuario = data.idUsuario;
      this.interviewerCaseManager = data.interviewerCaseManager;
      this.interviewerScales = data.interviewerScales;
      this.interviewerClinician = data.interviewerClinician;
      this.paginacion.size = 5;
      
  }

  ngOnInit(): void {
  }

  estaSeleccionado(idDisponibilidad: number) {
    return this.idDisponibilidadSelected == idDisponibilidad;
  }

  check(event: Event, idDisponibilidad: number) {
    console.log((event.srcElement as HTMLInputElement).checked)
    if ((event.srcElement as HTMLInputElement).checked) {
      if (!this.estaSeleccionado(idDisponibilidad)) this.idDisponibilidadSelected = idDisponibilidad;
    } else {
      if (this.estaSeleccionado(idDisponibilidad)) this.idDisponibilidadSelected = null;
    }
    console.log(this.idDisponibilidadSelected)
  }

  obtenerDisponibilidadUsuarios() {
    if(this.fecha == "") return;
    this.cargando = true;
    var clinician = this.interviewerClinician;
    this.disponibilidadUsuariosService.obtenerDisponibilidadUsuariosPorDia(this.fecha, this.fechaAnterior, (this.interviewerScales ? 8 : 5),this.idSolicitud, clinician)
      .then((disponibilidadUsuarios) => {
        this.arrDisponibilidadUsuario = disponibilidadUsuarios;
        this.paginacion.setArray(this.arrDisponibilidadUsuario,10);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  enviar() {
    let disponibilidadSelected = this.arrDisponibilidadUsuario[this.arrDisponibilidadUsuario.findIndex(disponibilidad => disponibilidad.idDisponibilidad == this.idDisponibilidadSelected)];
    console.log(disponibilidadSelected)
    this.cargando = true;
    
    let choosePromise;
    if (this.interviewerScales) {
      choosePromise = this.solicitudesService.envioInterviewerScales(this.idSolicitud, this.fechaAnterior, this.idUsuario, disponibilidadSelected.idDisponibilidad);
    } else if (this.interviewerClinician) {
      choosePromise = this.solicitudesService.envioClinicianProcess(this.idSolicitud, this.fechaAnterior, this.idUsuario, disponibilidadSelected.idDisponibilidad);
    }else if (this.interviewerCaseManager) {
      choosePromise = this.solicitudesService.envioCaseManager(this.idSolicitud, this.fechaAnterior, this.idUsuario, disponibilidadSelected.idDisponibilidad);
    } else {
      choosePromise = this.solicitudesService.envioSiguienteProceso(this.idSolicitud, this.fechaAnterior, this.idUsuario, disponibilidadSelected.idDisponibilidad);
    }
    
    choosePromise
    .then(() => {
      this.cargando = false;
      this.cerrar('enviado');
    })
    .catch((reason) => this.utilService.manejarError(reason))
    .then(() => (this.cargando = false));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
