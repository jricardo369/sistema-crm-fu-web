import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitudVocService } from 'src/app/services/evento-solicitud-voc.service';

import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';

import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { convertirAFechaMat, formatearFecha } from '../../util/date-utils';
import { CitaSolicitud } from 'src/model/cita-solicitud';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  selector: 'app-dialogo-actualizar-cita',
  templateUrl: './dialogo-actualizar-cita.component.html',
  styleUrls: ['./dialogo-actualizar-cita.component.css']
})
export class DialogoActualizarCitaComponent implements OnInit {

  idSolicitud: number = 0;
  titulo: string = '';
  subtitulo: string = '';
  cita: CitaSolicitud;

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  fechaCitaString: string = '';
  fechaCitaMat: Date | undefined;

  hora: string = '';
  tipo: string = '';

  concurrent: boolean = false;

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
    public dialogRef: MatDialogRef<DialogoActualizarCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private citaSolicitudService: CitaSolicitudService,
    private utilService: UtilService,
    private eventoSolicitudVocService: EventoSolicitudVocService,
    private router: Router
  ) {
    this.idSolicitud = data.idSolicitud;
    this.titulo = data.titulo;
    this.subtitulo = data.subtitulo;
    this.cita = data.cita;

    console.log('cita fecha:'+ this.cita.fecha);

    const storedUser = localStorage.getItem('objUsuario');
    this.usuario = storedUser ? JSON.parse(storedUser) : new Usuario();
  }

  ngOnInit(): void {
    this.cargando = true;
    this.fechaCitaString = this.cita.fecha;
    this.hora = this.cita.hora;
    this.tipo = this.cita.tipo;
     // Lógica de inicialización aquí
    setTimeout(() => {
    
              if (this.fechaCitaString) {
                 this.fechaCitaMat = convertirAFechaMat(this.fechaCitaString as string);  
                 this.cargando = false;
              }
            }, 2000);
   
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  envioActualizarCita(): void {

    const c: CitaSolicitud = new CitaSolicitud();
    c.fecha = this.fechaCitaString;
    c.hora = this.hora;
    c.tipo = this.tipo;
    c.idCita = this.cita.idCita;
    c.codigoRecurrencia = this.cita.codigoRecurrencia;
    c.idSolicitud = this.cita.idSolicitud

    this.citaSolicitudService
      .actualizarCita(c, this.concurrent,this.usuario.idUsuario)
      .then(() => {
        this.cerrar();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => {this.cargando = false; this.cerrar();});

  
  }

  eliminarConcurrencia(): void {

    const c: CitaSolicitud = new CitaSolicitud();
    c.fecha = this.fechaCitaString;
    c.hora = this.hora;
    c.tipo = this.tipo;
    c.idCita = this.cita.idCita;
    c.codigoRecurrencia = this.cita.codigoRecurrencia;
    c.idSolicitud = this.cita.idSolicitud

    this.citaSolicitudService
     .deleteConcurrenceCita(c,this.concurrent,this.cita.codigoRecurrencia,this.usuario.idUsuario)
      .then(() => {
        this.cerrar();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => {this.cargando = false; this.cerrar();});

  }

   changeFechaCita() {
      console.log('fechaCitaMat changed:', this.fechaCitaMat);
  
      if (this.fechaCitaMat) {
        this.fechaCitaString = formatearFecha(this.fechaCitaMat);
        console.log('Fecha formateada (string):', this.fechaCitaString);
      }
  
      
    }



}