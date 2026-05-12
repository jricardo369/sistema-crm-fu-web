import { EventoSolicitudService } from './../../services/evento-solicitud.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventoSolicitudVocService } from 'src/app/services/evento-solicitud-voc.service';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-evento-solicitud-voc',
  templateUrl: './dialogo-evento-solicitud-voc.component.html',
  styleUrls: ['./dialogo-evento-solicitud-voc.component.css']
})
export class DialogoEventoSolicitudVocComponent implements OnInit {

  cargando: boolean = false;
  public eventoSolicitud: EventoSolicitud = new EventoSolicitud;
  usuario: Usuario = new Usuario;

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
    private eventoSolicitudVocService: EventoSolicitudVocService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoEventoSolicitudVocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.eventoSolicitud.idSolicitud = data.idSolicitud;
    this.eventoSolicitud.usuario = this.usuario.nombre;
  }

  ngOnInit(): void {
  }

  typeSelected() { }

  crear() {
    this.cargando = true;
    this.eventoSolicitudVocService
      .crearEventoSolicitud(this.eventoSolicitud)
      .then(() => {
        this.cerrar('creado');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
