import { Component, Inject, OnInit,Optional,Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { NotaCitaService } from 'src/app/services/nota-cita.service';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { UtilService } from 'src/app/services/util.service';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { NotaCita } from 'src/model/nota-cita';
import { SolicitudVoc } from 'src/model/solicitud-voc';
import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true, imports: [RouterModule, FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-cita-solicitud',
  templateUrl: './dialogo-cita-solicitud.component.html',
  styleUrls: ['./dialogo-cita-solicitud.component.css']
})
export class DialogoCitaSolicitudComponent implements OnInit {

  @Output() notificar = new EventEmitter<string>();

  cargando: boolean = false;
  public citaSolicitud: CitaSolicitud = new CitaSolicitud;
  notaCita: NotaCita = new NotaCita();
  usuario: Usuario = new Usuario;
  creando: boolean = false;
  verCampoSolicitud: boolean = false;
  arrSolicitudesVoc: SolicitudVoc[] = [];

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

  arrTipoNota: string[] = [
    'Clinical Record'
  ];

  arrReferencia: string[] = ['VOC'];

  tipoContenidoSesion1: boolean = false;
  tipoContenidoSesion2: boolean = false;
  tipoContenidoSesion3: boolean = false;
  tipoContenidoSesion4: boolean = false;
  tipoContenidoSesion5: boolean = false;
  tipoContenidoSesion6: boolean = false;
  tipoContenidoSesion7: boolean = false;

  inputSiHiAsignado: string = "";
  inputLocacionVerificada: string = "";

  constructor(
    private solicitudesVOCService: SolicitudesVocService,
    private citaSolicitudService: CitaSolicitudService,
    private notaCitaService: NotaCitaService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoCitaSolicitudComponent>,
     @Optional() @Inject('ParentComponent') public parent: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.citaSolicitud.idSolicitud = data.idSolicitud;
    this.creando = data.creando;
    this.verCampoSolicitud = data.verCampoSolicitud;
    if (!this.creando) {
      this.citaSolicitud = data.citaSolicitud;
      this.obtenerNotasCita();
    }
    if (this.verCampoSolicitud) this.obtenerSolicitudesActivasUsuario();
    this.citaSolicitud.dosCitas = false;
  }

  ngOnInit(): void {
  }

  crear() {
    this.cargando = true;
    this.citaSolicitudService
      .crearCitaSolicitud(this.citaSolicitud, this.usuario.idUsuario)
      .then(() => {
        this.cerrar('guardar');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => {this.cargando = false; this.parent.refresh()});
  }

  descargarCita() {
    this.cargando = true;
    this.citaSolicitudService.descargarCita(this.citaSolicitud.idCita, this.usuario.idUsuario).then(response => {
      this.utilService.saveByteArray("schedule_file-" + this.citaSolicitud.idSolicitud + "_" + this.citaSolicitud.idCita, response, 'pdf');
    }).catch(e => this.utilService.manejarError(e))
      .finally(() => this.cargando = false);
  }

  obtenerNotasCita() {
    this.cargando = true;
    this.notaCitaService
      .obtenerNotasCita(this.citaSolicitud.idCita)
      .then(notas => {
        // this.nuevaNotaCita.idCita = this.citaSolicitud.idCita;
        if (notas[0]) this.notaCita = notas[0];
        console.log(this.notaCita)

        if (!this.notaCita.idNota) {
          this.notaCita.tipo = this.arrTipoNota[0];
          this.notaCita.referencia = this.arrReferencia[0];
          this.notaCita.idCita = this.citaSolicitud.idCita;
          this.notaCita.descripcion = "";
          this.notaCita.hora = "";
          this.notaCita.fechaCreacion = (new Date().toISOString()).split('T', 1)[0];
        }

        if (this.notaCita.siHiAsignado === true) this.inputSiHiAsignado = "Yes";
        else if (this.notaCita.siHiAsignado === false) this.inputSiHiAsignado = "No";

        if (this.notaCita.locacionVerificada === true) this.inputLocacionVerificada = "Yes";
        else if (this.notaCita.locacionVerificada === false) this.inputLocacionVerificada = "No";

        if (this.notaCita.tipoContenidoSesion) {
          this.tipoContenidoSesion1 = this.notaCita.tipoContenidoSesion.includes("Symptoms/Behavior");
          this.tipoContenidoSesion2 = this.notaCita.tipoContenidoSesion.includes("Home Situation");
          this.tipoContenidoSesion3 = this.notaCita.tipoContenidoSesion.includes("Psychological Stressors");
          this.tipoContenidoSesion4 = this.notaCita.tipoContenidoSesion.includes("Medical");
          this.tipoContenidoSesion5 = this.notaCita.tipoContenidoSesion.includes("Risk Factors");
          this.tipoContenidoSesion6 = this.notaCita.tipoContenidoSesion.includes("Environmental");
          this.tipoContenidoSesion7 = this.notaCita.tipoContenidoSesion.includes("Other");
        }
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  guardarNota() {

    this.notaCita.tipoContenidoSesion = "";
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion1 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Symptoms/Behavior" : "");
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion2 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Home Situation" : "");
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion3 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Psychological Stressors" : "");
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion4 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Medical" : "");
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion5 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Risk Factors" : "");
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion6 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Environmental" : "");
    this.notaCita.tipoContenidoSesion += (this.tipoContenidoSesion7 ? (this.notaCita.tipoContenidoSesion.length > 0 ? "," : "") + "Other" : "");

    this.notaCita.siHiAsignado = this.inputSiHiAsignado == "Yes";

    this.notaCita.locacionVerificada = this.inputLocacionVerificada == "Yes";

    this.cargando = true;
    this.notaCitaService
      .guardarNota(this.notaCita)
      .then(() => {
        //this.obtenerNotasCita();
        this.utilService.mostrarDialogoSimple("Info", "The note has been saved successfully");
        this.cerrar('guardar');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => {this.cargando = false;this.parent.refresh()});
  }

   eliminarNota() {
    this.notaCitaService
      .eliminarNotasCita(this.notaCita.idNota,this.usuario.idUsuario)
      .then(() => {
        //this.obtenerNotasCita();
        this.utilService.mostrarDialogoSimple("Info", "The note has been deleted successfully");
        this.cerrar('guardar');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
   }

  obtenerSolicitudesActivasUsuario() {
    this.cargando = true;
    this.solicitudesVOCService
      .obtenerSolicitudesActivasUsuario(this.usuario.idUsuario)
      .then(solicitudes => {
        this.arrSolicitudesVoc = solicitudes;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  cerrar(accion: string) {


    if (accion == 'guardar') {
      this.dialogRef.close(accion);
    } else {
      this.dialog.open(DialogoSimpleComponent, {
        data: {
          titulo: 'Close',
          texto: 'Are you sure you want to close? Any unsaved data will be lost.',
          botones: [
            { texto: 'Cancel', color: '', valor: '' },
            { texto: 'Yes', color: 'primary', valor: 'ok' },
          ]
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'ok') {
          this.dialogRef.close(accion);
        }
      }).catch(reason => this.utilService.manejarError(reason));

    }

  }

  eliminar(accion: string) {


   
      this.dialog.open(DialogoSimpleComponent, {
        data: {
          titulo: 'Delete note',
          texto: 'Do you really want to delete this note? The information cannot be recovered once deleted',
          botones: [
            { texto: 'Cancel', color: '', valor: '' },
            { texto: 'Yes', color: 'primary', valor: 'ok' },
          ]
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'ok') {
          this.eliminarNota();
          this.dialogRef.close(accion);
        }
      }).catch(reason => this.utilService.manejarError(reason));

    

  }

}
