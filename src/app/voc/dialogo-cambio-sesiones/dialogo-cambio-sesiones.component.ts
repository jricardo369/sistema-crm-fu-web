import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitudVocService } from 'src/app/services/evento-solicitud-voc.service';

import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-cambio-sesiones',
  templateUrl: './dialogo-cambio-sesiones.component.html',
  styleUrls: ['./dialogo-cambio-sesiones.component.css']
})
export class DialogoCambioSesionesComponent implements OnInit {


  idSolicitud: number = 0;
  titulo: string = '';
  subtitulo: string = '';
  textoRazon: string = '';
  textoSesiones: string = '';
  tipo: string = '';
  

  cargando: boolean = false;
  cancelReason: string = '';
  numSesiones: number = 0;
  usuario: Usuario = new Usuario();



  constructor(
    public dialogRef: MatDialogRef<DialogoCambioSesionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilService: UtilService,
    private EventoSolicitudVocService: EventoSolicitudVocService,
    private router: Router
  ) {

    this.idSolicitud = data.idSolicitud;
    this.titulo = data.titulo;
    this.subtitulo = data.subtitulo;
    this.textoRazon = data.textoRazon;
    this.numSesiones = data.numSesiones;
    this.tipo = data.tipo;
    this.textoSesiones = data.textoSesiones;

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));

  }

  ngOnInit(): void {
    // Lógica de inicialización aquí
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  envioApprovedSessionsAdjustment(): void {
    
    this.EventoSolicitudVocService.actualizarEventoSolicitud(this.idSolicitud, this.numSesiones, this.cancelReason, this.usuario.idUsuario,this.tipo)
      .then((sol) => {
          this.router.navigate(['/solicitudes/solicitudes-voc']);
        })
        .then(() => {
            this.cargando = false;
            this.dialogRef.close("");
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });

        
    }

  
}
