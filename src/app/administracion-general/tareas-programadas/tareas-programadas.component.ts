import { Component, OnInit } from '@angular/core';
import { TareasProgramadasService } from 'src/app/services/tareas-programadas.service';
import { UtilService } from 'src/app/services/util.service';
import { TareaProgramada } from 'src/model/tarea-programada';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GeneralNavComponent } from 'src/app/administracion-general/general-nav/general-nav.component';

import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,GeneralNavComponent,WorkspaceNavComponent,ExperimentalMenuComponent,CommonModule,MatIconModule,MatProgressSpinnerModule,PhonePipe],
  selector: 'app-tareas-programadas',
  templateUrl: './tareas-programadas.component.html',
  styleUrls: ['./tareas-programadas.component.css']
})
export class TareasProgramadasComponent {
  arrTareas: Array<TareaProgramada> = [];
  tarea = new TareaProgramada;
  todayISOString: string = new Date().toISOString();

  cargando: boolean = false;
  dias: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  cambiandoDiaEnvioRecordatorioPago: boolean = false;
  diaEnvioRecordatorioPago: string = 'Monday';
  diaEnvioRecordatorioPagoOld: string = 'Monday';
  horaEnvioRecordatorioPago: string = '00:00';
  horaEnvioRecordatorioPagoOld: string = '00:00';
  tituloRecordatorioPagoOld: string = '';
  subtituloRecordatorioPagoOld: string = '';
  activoPago: boolean = false;
  activoPagoOld: boolean = false;

  cambiandoDiaEnvioRecordatorioSolicitudes: boolean = false;
  diaEnvioRecordatorioSolicitudes: string = 'Monday';
  diaEnvioRecordatorioSolicitudesOld: string = 'Monday';
  horaEnvioRecordatorioSolicitudes: string = '00:00';
  horaEnvioRecordatorioSolicitudesOld: string = '00:00';
  tituloRecordatorioSolicitudesOld: string = '00:00';
  subtituloRecordatorioSolicitudesOld: string = '00:00';
  activoRecordatorioSolicitudes: boolean = false;
  activoRecordatorioSolicitudesOld: boolean = false;

  cambiandoCitasRecordatorio: boolean = false;
  horaCitasRecordatorio: string = '00:00';
  horaCitasRecordatorioOld: string = '00:00';
  tituloCitasRecordatorioOld: string = '00:00';
  subtituloCitasRecordatorioOld: string = '00:00';
  activoCitasRecordatorio: boolean = false;
  activoCitasRecordatorioOld: boolean = false;

  cambiandoVocEndSession: boolean = false;
  horaVocEndSession: string = '00:00';
  horaVocEndSessionOld: string = '00:00';
  tituloVocEndSessionOld: string = '00:00';
  subtituloVocEndSessionOld: string = '00:00';
  activoVocEndSession: boolean = false;
  activoVocEndSessionOld: boolean = false;

  constructor(public tareasService: TareasProgramadasService,
    public utilService: UtilService) {
    this.obtenerTareas();
  }

  obtenerTareas() {
    this.cargando = true;
    this.tareasService.getTareas()
      .subscribe(result => {
        this.arrTareas = result;
        this.procesarTareas();
      },
        error => {
          this.utilService.manejarError(error);
        });
  }

  procesarTareas() {
    console.log(this.arrTareas);
    for (let index = 0; index < this.arrTareas.length; index++) {
      switch (Number(this.arrTareas[index].idTareaProgramada)) {
        case 1:
          this.diaEnvioRecordatorioPago = this.arrTareas[index].dia;
          this.horaEnvioRecordatorioPago = this.arrTareas[index].hora;
          this.diaEnvioRecordatorioPagoOld = this.diaEnvioRecordatorioPago;
          this.horaEnvioRecordatorioPagoOld = this.horaEnvioRecordatorioPago;
          this.tituloRecordatorioPagoOld = this.arrTareas[index].titulo;
          this.subtituloRecordatorioPagoOld = this.arrTareas[index].subtitulo;
          this.activoPago = this.arrTareas[index].activo;
          this.activoPagoOld = this.activoPago;
          break;
        case 2:
          this.diaEnvioRecordatorioSolicitudes = this.arrTareas[index].dia;
          this.horaEnvioRecordatorioSolicitudes = this.arrTareas[index].hora;
          this.diaEnvioRecordatorioSolicitudesOld = this.diaEnvioRecordatorioSolicitudes;
          this.horaEnvioRecordatorioSolicitudesOld = this.horaEnvioRecordatorioSolicitudes;
          this.tituloRecordatorioSolicitudesOld = this.arrTareas[index].titulo;
          this.subtituloRecordatorioSolicitudesOld = this.arrTareas[index].subtitulo;
          this.activoRecordatorioSolicitudes = this.arrTareas[index].activo;
          this.activoRecordatorioSolicitudesOld = this.activoRecordatorioSolicitudes;
          break;
        case 3:
          this.horaCitasRecordatorio = this.arrTareas[index].hora;
          this.horaCitasRecordatorioOld = this.horaCitasRecordatorio;
          this.tituloCitasRecordatorioOld = this.arrTareas[index].titulo;
          this.subtituloCitasRecordatorioOld = this.arrTareas[index].subtitulo;
          this.activoCitasRecordatorio = this.arrTareas[index].activo;
          this.activoCitasRecordatorioOld = this.activoCitasRecordatorio;
          break;
        case 4:
          this.horaVocEndSession = this.arrTareas[index].hora;
          this.horaVocEndSessionOld = this.horaVocEndSession;
          this.tituloVocEndSessionOld = this.arrTareas[index].titulo;
          this.subtituloVocEndSessionOld = this.arrTareas[index].subtitulo;
          this.activoVocEndSession = this.arrTareas[index].activo;
          this.activoVocEndSessionOld = this.activoVocEndSession;
          break;
        default:
          break;
      }
    }
    this.cargando = false;
  }

  cambiarDato(caso: number) {
    var fecha = this.todayISOString.split('T', 1);
    this.tarea.idTareaProgramada = caso;
    this.tarea.codigo = this.arrTareas[caso - 1].codigo;
    this.tarea.titulo = this.arrTareas[caso - 1].titulo;
    this.tarea.fechaModificacion = fecha.toString();
    switch (caso) {
      case 1:
        this.tarea.dia = this.diaEnvioRecordatorioPago;
        this.tarea.hora = this.horaEnvioRecordatorioPago;
        this.tarea.activo = this.activoPago;
        break;
      case 2:
        this.tarea.dia = this.diaEnvioRecordatorioSolicitudes;
        this.tarea.hora = this.horaEnvioRecordatorioSolicitudes;
        this.tarea.activo = this.activoRecordatorioSolicitudes;
        break;
      case 3:
        this.tarea.hora = this.horaCitasRecordatorio;
        this.tarea.activo = this.activoCitasRecordatorio;
        break;
      case 4:
        this.tarea.hora = this.horaVocEndSession;
        this.tarea.activo = this.activoVocEndSession;
        break;
      default:
        break;
    }

    this.cargando = true;
    this.tareasService
      .asignarVariable(this.tarea)
      .then(response => {
        this.utilService.mostrarDialogoSimple("Change made successfully", "");
        if (response.status === 200) {
          switch (caso) {
            case 1:
              this.diaEnvioRecordatorioPagoOld = this.diaEnvioRecordatorioPago;
              this.horaEnvioRecordatorioPagoOld = this.horaEnvioRecordatorioPago;
              this.cambiandoDiaEnvioRecordatorioPago = false;
              break;
            case 2:
              this.diaEnvioRecordatorioSolicitudesOld = this.diaEnvioRecordatorioSolicitudes;
              this.horaEnvioRecordatorioSolicitudesOld = this.horaEnvioRecordatorioSolicitudes;
              this.cambiandoDiaEnvioRecordatorioSolicitudes = false;
              break;
            case 3:
              this.horaCitasRecordatorioOld = this.horaCitasRecordatorio;
              this.cambiandoCitasRecordatorio = false;
              break;
            case 4:
              this.horaVocEndSessionOld = this.horaVocEndSession;
              this.cambiandoVocEndSession = false;
              break;
            default:
              break;
          }
          this.obtenerTareas();
          this.cargando = false;
        }
      }).catch(error => {
        this.cargando = false;
        this.utilService.mostrarDialogoSimple("Error: " + error.message, "It was not possible to make the change.");
        this.cancelarCambio(caso);
      });
  }

  cancelarCambio(caso: number) {
    switch (caso) {
      case 1:
        this.cambiandoDiaEnvioRecordatorioPago = false;
        this.diaEnvioRecordatorioPago = this.diaEnvioRecordatorioPagoOld;
        this.horaEnvioRecordatorioPago = this.horaEnvioRecordatorioPagoOld;
        break;
      case 2:
        this.cambiandoDiaEnvioRecordatorioSolicitudes = false;
        this.diaEnvioRecordatorioSolicitudes = this.diaEnvioRecordatorioSolicitudesOld;
        this.horaEnvioRecordatorioSolicitudes = this.horaEnvioRecordatorioSolicitudesOld;
        break;
      case 3:
        this.cambiandoCitasRecordatorio = false;
        this.horaCitasRecordatorio = this.horaCitasRecordatorioOld;
        break;
      case 4:
        this.cambiandoVocEndSession = false;
        this.horaVocEndSession = this.horaVocEndSessionOld;
        break
      default:
        break;
    }
  }

  ejecutarTarea(caso: number) {
    let dialogoConfirmacion: Promise<any> = null;
    let campos = [];
    if (this.arrTareas[caso - 1].codigo == "payments") {
      campos.push({ label: "Start Date", type: "date", value: "", });
      campos.push({ label: "End Date", type: "date", placeholder: "fecha", value: "", });
      dialogoConfirmacion = this.utilService
        .mostrarDialogoConFormulario(
          "Execute Task",
          "The task will be executed manually. Please enter the date range for execution.",
          "Execute", "Cancel",
          campos);
    }
    else {
      dialogoConfirmacion = this.utilService.mostrarDialogoSimple(
        "Execute Task",
        "The task will be executed manually.",
        "Execute", "Cancel");
    }
    dialogoConfirmacion
      .then(valor => {
        console.log(valor)
        if (valor == 'ok') {
          this.cargando = true;
          this.tareasService
            .ejecutarTarea(this.arrTareas[caso - 1].codigo, (campos.length > 0 ? campos[0].value : null), (campos.length > 0 ? campos[1].value : null))
            .then(() => {
              this.utilService.mostrarDialogoSimple("Task executed correctly", "");
              this.cargando = false;
            }).catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
        }
      }).catch(reason => this.utilService.manejarError(reason));
  }
}
