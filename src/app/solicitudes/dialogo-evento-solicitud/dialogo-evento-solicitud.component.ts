import { EventoSolicitudService } from './../../services/evento-solicitud.service';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-evento-solicitud',
  templateUrl: './dialogo-evento-solicitud.component.html',
  styleUrls: ['./dialogo-evento-solicitud.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogoEventoSolicitudComponent implements OnInit {

 
  cargando: boolean = false;
  public eventoSolicitud: EventoSolicitud = new EventoSolicitud;
  usuario: Usuario = new Usuario;
  rol: string;

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
    private eventoSolicitudService: EventoSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoEventoSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.eventoSolicitud.idSolicitud = data.idSolicitud;
    this.eventoSolicitud.usuario = this.usuario.nombre;
    this.eventoSolicitud.tipo = 'Info';
    this.rol = this.usuario.rol;
    this.eventoSolicitud.timeZone = 'PST';
  }

  ngOnInit(): void {
  }

  typeSelected() { }

  crear() {
    this.cargando = true;
    this.eventoSolicitudService
      .crearEventoSolicitud(this.eventoSolicitud,this.usuario.idUsuario)
      .then(() => {
        this.cerrar('creado');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
