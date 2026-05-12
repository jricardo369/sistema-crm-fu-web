import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';
import { MotivoCancelService } from 'src/app/services/motivo-cancel.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';

import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MotivoCancel } from 'src/model/motivo-cancel';
import { ProspectoAbogado } from 'src/model/prospecto-abogado';
import { ProspectosAbogadoService } from 'src/app/services/prospectos-abogado.service';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-not-interesed',
  templateUrl: './dialogo-not-interesed.component.html',
  styleUrls: ['./dialogo-not-interesed.component.css']
})
export class DialogoNotInteresedComponent implements OnInit {

  //Datos entrada
  prospecto: ProspectoAbogado | null = null;
  idEstatusProspecto: number = 0;
  titulo: string = '';
  subtitulo: string = '';
  textolabel: string = '';

  cargando: boolean = false;

  arrCitasActivas: CitaActivaSolicitud[] = [];
  idEventoSelected: string = '';
  cancelReason: string = '';
  usuario: Usuario = new Usuario();

  filterMotivoCancel: string;
  arrFilterMotivoCancel: MotivoCancel[] = [];

  filterUsuario: number = 0;
  arrFilterUsuarios: Usuario[] = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private motivoCancelService: MotivoCancelService,
    public utilService: UtilService,
    private prospectosAbogadoService: ProspectosAbogadoService,
    public dialogRef: MatDialogRef<DialogoNotInteresedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.prospecto = data.prospecto;
    this.idEstatusProspecto = data.idEstatusProspecto;
    this.titulo = data.titulo;
    this.subtitulo = data.subtitulo;
    this.textolabel = data.textolabel;
  
    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    console.log('prospecto estatus:'+this.prospecto?.idEstatusProspecto);

    this.prospecto.idEstatusProspecto = this.idEstatusProspecto;
  }

  ngOnInit(): void {
    this.obtenerMotivosCancel();
  }

  estaSeleccionado(idEvento: string) {
    return this.idEventoSelected == idEvento; 
  }

  check(event: Event, idEvento: string) {
    if ((event.srcElement as HTMLInputElement).checked) {
      if (!this.estaSeleccionado(idEvento)) this.idEventoSelected = idEvento;
    } else {
      if (this.estaSeleccionado(idEvento)) this.idEventoSelected = null;
    }
  }

  envioNotInteresed() {

    if (this.filterMotivoCancel === undefined) {
      this.utilService.mostrarDialogoSimple('Warning', 'Reason for cancellation cannot be empty');

    } else {

      var motivoCancelF = '';
      var booleanSeguir = true;
      if (this.filterMotivoCancel === 'other') {
        if (this.cancelReason === '' || this.cancelReason == null) {
          this.utilService.mostrarDialogoSimple('Warning', 'Cancellation reason cannot be empty');
          booleanSeguir = false;
        } else {
          motivoCancelF = this.cancelReason;
        }
      } else {
        motivoCancelF = this.filterMotivoCancel;
      }

      if (booleanSeguir) {
        
        console.log('Guardar cambios para el prospecto:', this.prospecto);
        this.prospectosAbogadoService.actualizarProspectoAbogado(this.prospecto,0,this.usuario.idUsuario,motivoCancelF).then((prospecto) => {
          this.router.navigate(['/marketing/lawyers-prospects']);
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

  }

  

  cerrar(accion: string = '') { this.dialogRef.close(accion); }


  obtenerMotivosCancel() {

    var tipoF = 'NINT';
    
    this.cargando = true;
    this.motivoCancelService
      .obtenerMotivosCancel(tipoF, this.usuario.idUsuario)
      .then(motivos => {
        this.arrFilterMotivoCancel = motivos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);

  }
}
