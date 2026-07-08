import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { DisponibilidadUsuario } from 'src/model/disponibilidad-usuario';
import { PaginationManager } from 'src/util/pagination';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from "src/model/usuario";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosService } from '../../services/usuarios.service';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

import { SolicitudVoc } from 'src/model/solicitud-voc';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { THERAPIST, VOC } from 'src/app/app.config';

@Component({
	standalone: true, imports: [RouterModule, FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, DateMMDDYYYYPipe],
	selector: 'app-dialogo-cita-solicitud-voc-dispo',
	templateUrl: './dialogo-cita-solicitud-voc-dispo.component.html',
	styleUrls: ['./dialogo-cita-solicitud-voc-dispo.component.css'],
	providers: [
		DatePipe
	]
})
export class DialogoCitaSolicitudVocDispoComponent implements OnInit {
	readonly concurrentAppointmentCutoff = '2025-11-01';

    isTherapist: boolean = false;
    isVOC: boolean = false;

	usuario: Usuario = new Usuario();
	cargando: boolean = false;
	creando: boolean = true;

	fecha: string = "";
	availability: boolean = false;
	concurrent: boolean = false;

	citaSolicitud: CitaSolicitud = new CitaSolicitud();
	disponibilidad: DisponibilidadUsuario | null = null;
	arrDisponibilidadUsuario: DisponibilidadUsuario[] = [];
	paginacion: PaginationManager = new PaginationManager();
	idDisponibilidadSelected: number | null = null;
	idSolicitud: number ;
	idUsuario: number | null = null;
    idUsuarioTerapeuta: number;
	rol: string = '';
	arrSolicitudesVoc: SolicitudVoc[] = [];
    solicitud: SolicitudVoc = new SolicitudVoc;

	verConcurrence: boolean = false;

	arrTime: string[] = [
    '12:00',
    '12:30',
    '1:00',
    '1:30',
    '2:00',
    '2:30',
    '3:00',
    '3:30',
    '4:00',
    '4:30',
    '5:00',
    '5:30',
    '6:00',
    '6:30',
    '7:00',
    '7:30',
    '8:00',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30'
  ];

	constructor(
        private citaSolicitudService: CitaSolicitudService,
        private solicitudesVOCService: SolicitudesVocService,
		private disponibilidadUsuariosService: DisponibilidadUsuariosService,
		private solicitudesService: SolicitudesService,
		public utilService: UtilService,
		private usuariosService: UsuariosService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoCitaSolicitudVocDispoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {

		const usuarioStorage = localStorage.getItem("objUsuario");
		if (usuarioStorage) {
			this.usuario = JSON.parse(usuarioStorage);
		}

        this.isTherapist = this.usuario.rol == THERAPIST ? true : false;
        this.isVOC = this.usuario.rol == VOC ? true : false;

		this.idSolicitud = data.idSolicitud;
		this.idUsuario = data.idUsuario;
        this.idUsuarioTerapeuta = data.idUsuarioTerapeuta;
        console.log('idUsuarioTerapeuta:'+this.idUsuarioTerapeuta);
		this.citaSolicitud.idSolicitud = data.idSolicitud;
		this.creando = data.creando ?? true;
		this.paginacion.size = 5;
        this.rol = this.usuario.rol;
        //this.obtenerSolicitudesActivasUsuario();

		 if (this.idSolicitud != 0){
			 this.obtenerSolVoc(this.idSolicitud);
		 } else{
			this.obtenerSolicitudesActivasUsuario();
		 }
        
		 

	}

	ngOnInit(): void {
        
    }

	validarFecha() {

		console.log('fechaLimite: ' + this.concurrentAppointmentCutoff);
		console.log('fechaSolicitud: ' + this.solicitud.fechaInicio);

		const fechaLimite = new Date(this.concurrentAppointmentCutoff);
		const fechaSolicitud = new Date(this.solicitud.fechaInicio);
		
		console.log('fecha sol >= fecha limite? ' + (fechaSolicitud >= fechaLimite));
		this.verConcurrence = fechaSolicitud >= fechaLimite;
	}

	estaSeleccionado(idDisponibilidad: number) {
		return this.idDisponibilidadSelected == idDisponibilidad;
	}

	check(event: Event, idDisponibilidad: number) {
		if ((event.srcElement as HTMLInputElement).checked) {
			if (!this.estaSeleccionado(idDisponibilidad)) this.idDisponibilidadSelected = idDisponibilidad;
		} else {
			if (this.estaSeleccionado(idDisponibilidad)) this.idDisponibilidadSelected = null;
		}
	}

	obtenerDisponibilidadUsuarios() {
		if (this.fecha == "") return;
		this.cargando = true;
		this.disponibilidadUsuariosService.obtenerDisponibilidadUsuariosVocPorDia(this.fecha, this.idUsuarioTerapeuta)
			.then((disponibilidadUsuarios) => {
				this.arrDisponibilidadUsuario = disponibilidadUsuarios;
				this.paginacion.setArray(this.arrDisponibilidadUsuario, 10);
			})
			.catch((reason) => this.utilService.manejarError(reason))
			.then(() => (this.cargando = false));
	}

	enviar() {
		
		this.cargando = true;
		this.disponibilidad = this.arrDisponibilidadUsuario.find(
			d => d.idDisponibilidad === this.idDisponibilidadSelected
		) ?? null;

		if (!this.disponibilidad) {
			this.cargando = false;
			return;
		}

        this.citaSolicitud.idUsuario = this.usuario.idUsuario;
        this.citaSolicitud.fecha = this.disponibilidad.fecha;
        this.citaSolicitud.hora = this.disponibilidad.hora;
        this.citaSolicitud.tipo = this.disponibilidad.tipo;
		

        console.log('citaSolicitud:'+JSON.stringify(this.citaSolicitud));

		this.citaSolicitudService
			.crearCitaSolicitud(this.citaSolicitud, this.usuario.idUsuario)
			.then(() => {
				this.cerrar('guardar');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => { this.cargando = false;  });
	}

    obtenerSolicitudesActivasUsuario() {
    this.cargando = true;
    this.solicitudesVOCService
      .obtenerSolicitudesActivasUsuario(this.idUsuarioTerapeuta)
      .then(solicitudes => {
        this.arrSolicitudesVoc = solicitudes;
        console.log(this.arrSolicitudesVoc);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

	crear() {

		this.citaSolicitud.idUsuario = this.usuario.idUsuario;
		this.citaSolicitud.recurrente = this.concurrent;

		this.cargando = true;
		this.citaSolicitudService
			.crearCitaSolicitud(this.citaSolicitud, this.usuario.idUsuario)
			.then(() => {
				this.cerrar('guardar');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => { this.cargando = false; });
	
	}

  obtenerSolVoc(idSolicitud: number){
     this.cargando = true;
      this.solicitudesVOCService.obtenerSolicitud(this.idSolicitud,this.usuario.idUsuario)
        .then((solicitud) => {
          this.solicitud = solicitud;
		  this.validarFecha();
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
  }

	cerrar(accion: string = "") { this.dialogRef.close(accion); }


	
}
