import { ScalesService } from './../../services/scales.service';

import { AdjuntosVocComponent } from 'src/app/solicitudes/adjuntos-voc/adjuntos-voc.component';
import { EventosSolicitudVocComponent } from 'src/app/solicitudes/eventos-solicitud-voc/eventos-solicitud-voc.component';
import { CitasSolicitudComponent } from 'src/app/solicitudes/citas-solicitud/citas-solicitud.component';

import { Component, OnInit, ViewChild,forwardRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TiposPagoService } from "src/app/services/tipos-pago.service";
import { TiposSolicitudService } from "src/app/services/tipos-solicitud.service";
import { EventoSolicitudVocService } from "src/app/services/evento-solicitud-voc.service";
import { UtilService } from "src/app/services/util.service";
import { TipoPago } from "src/model/tipo-pago";
import { TipoSolicitud } from "src/model/tipo-solicitud";
import { Usuario } from "src/model/usuario";
import { DialogoSiguienteProcesoComponent } from "../dialogo-siguiente-proceso/dialogo-siguiente-proceso.component";
import { DialogoNotificacionesComponent } from "../dialogo-notificaciones/dialogo-notificaciones.component";
import { Scale } from 'src/model/scale';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { ADMINISTRATOR, ARR_LANGUAJES, ARR_REFERRALSORUCE, ARR_TYPESOFINTERVIEW,BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, THERAPIST, VENDOR, US_STATES,VOC } from 'src/app/app.config';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DialogoSolicitudCasenumberComponent } from '../dialogo-solicitud-casenumber/dialogo-solicitud-casenumber.component';
import { DialogoSolicitudTelefonoComponent } from '../dialogo-solicitud-telefono/dialogo-solicitud-telefono.component';
import { ReportesService } from '../../services/reportes.service';
import { SolicitudVoc } from 'src/model/solicitud-voc';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { DialogoAsignarTerapeutaComponent } from '../dialogo-asignar-terapeuta/dialogo-asignar-terapeuta.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogoCambioSesionesComponent } from 'src/app/voc/dialogo-cambio-sesiones/dialogo-cambio-sesiones.component';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

import { formatearFecha } from '../../util/date-utils';
import { convertirAFechaMat } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EventoSolicitud } from 'src/model/evento-solicitud';

@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,AdjuntosVocComponent,EventosSolicitudVocComponent,CitasSolicitudComponent
      ,WorkspaceNavComponent,ExperimentalMenuComponent,
        CommonModule,NgClass,MatIconModule,MatDialogModule,MatProgressSpinnerModule,SolicitudesNavComponent,DateMMDDYYYYPipe,
       MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule,
       DialogoCambioSesionesComponent],
  selector: "app-solicitud-voc",
  templateUrl: "./solicitud-voc.component.html",
  styleUrls: ["./solicitud-voc.component.css"],
  providers: [
      { provide: 'ParentComponent', useExisting: forwardRef(() => SolicitudVocComponent) },DatePipe
    ]
})
export class SolicitudVocComponent implements OnInit {
  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  titulo: string = "";

  solicitud: SolicitudVoc = new SolicitudVoc;
  comentarios: string = "";

  public arrTipoSolicitud: TipoSolicitud[] = [];
  public inputTipoSolicitud: TipoSolicitud = new TipoSolicitud;
  public arrEventosSolicitudVoc: EventoSolicitud[] = [];

  arrTipoPago: TipoPago[] = [];
  inputTipoPago: TipoPago = new TipoPago;

  arrScales: Scale[] = [];
  inputScale: Scale = new Scale;

  scales: string[] = ['Scale 1', 'Scale 2', 'Scale 3', 'Scale 4', 'Scale 5'];

    fechaParaNuevoConteoDeVOC: boolean = false;

  miFecha = new Date();
  fechaLimite = new Date('2025-11-01');

  creando: boolean = false;
  editando: boolean = false;

  isAdministrator: boolean = false;
  isMaster: boolean = false;
  isVendor: boolean = false;
  isBackOffice: boolean = false;
  isInterviewer: boolean = false;
  isVOC: boolean = false;
  isTemplateCreator: boolean = false;
  isInterviewerScales: boolean = false;
  isGhostwriting: boolean = false;
  isTherapist: boolean = false;

  arrStates: any[] = [];
  arrLanguages: any = [];
  arrTypesOfInterview: any = [];
  arrReferralSources: any = [];
  arrUsuariosExternal: Usuario[] = [];

    fechaNacimientoMat: Date;
    fechaDoc1Mat: Date;
    fechaDoc2Mat: Date;

  @ViewChild(EventosSolicitudVocComponent, { static: false }) eventosSolicitudVocComponent: EventosSolicitudVocComponent;
  @ViewChild(AdjuntosVocComponent, { static: false }) adjuntosVocComponent: AdjuntosVocComponent;
  // @ViewChild(MovimientosSolicitudComponent, { static: false }) movimientosSolicitudComponent: MovimientosSolicitudComponent;
  @ViewChild(CitasSolicitudComponent, { static: false }) citasSolicitudComponent: CitasSolicitudComponent;

  constructor(
    route: ActivatedRoute,
    public utilService: UtilService,
    private solicitudesVocService: SolicitudesVocService,
    private eventoSolicitudVOC: EventoSolicitudVocService,
    private tiposSolicitudService: TiposSolicitudService,
    private tiposPagoService: TiposPagoService,
    private scalesService: ScalesService,
    private usuariosService: UsuariosService,
    private reportesService: ReportesService,
    private dialog: MatDialog
  ) {

     // Usar la constante globales
    this.arrStates = US_STATES;
    this.arrLanguages = ARR_LANGUAJES;
    this.arrTypesOfInterview = ARR_TYPESOFINTERVIEW;
    this.arrReferralSources = ARR_REFERRALSORUCE;

    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.isAdministrator = this.usuario.rol == ADMINISTRATOR ? true : false;
    this.isMaster = this.usuario.rol == MASTER ? true : false;
    this.isVendor = this.usuario.rol == VENDOR ? true : false;
    this.isBackOffice = this.usuario.rol == BACKOFFICE ? true : false;
    this.isInterviewer = this.usuario.rol == INTERVIEWER ? true : false;
    this.isVOC = this.usuario.rol == VOC ? true : false;
    this.isTemplateCreator = this.usuario.rol == TEMPLATE_CREATOR ? true : false;
    this.isInterviewerScales = this.usuario.rol == INTERVIEWER_SCALES ? true : false;
    this.isGhostwriting = this.usuario.rol == GHOSTWRITING ? true : false;
    this.isTherapist = this.usuario.rol == THERAPIST ? true : false;

    route.params.subscribe((params) => {
      let codigo = params["id"];
      if (codigo.toString() == "nueva-solicitud") {
        this.titulo = "New File";
        this.creando = true;
        // this.solicitud.asignacionTemplate = false;
        // this.solicitud.waiver = false;
        this.solicitud.paralegalName = null;
        this.solicitud.paralegalEmails = null;
        this.solicitud.paralegalTelefonos = null;
        this.obtenerTiposSolicitud();
        // this.solicitud.external = false;
        this.solicitud.fechaInicio = new Date();
        this.solicitud.numSesiones = 0;
        this.solicitud.numSchedules = 0;
        this.solicitud.sesionesPendientes = 0;
        this.solicitud.documento1 = false;
        this.solicitud.documento2 = false;
      } else {
        this.editando = true;
        this.obtenerSolicitud(Number.parseInt(codigo));
      }
    });

    
  }

  ngOnInit(): void { console.log("MOVIMIENTOS: " + this.isBackOffice);localStorage.setItem('backSolicitudVOC', '1'); 
    }

  validateCS(){
    if (this.solicitud.numeroDeCaso === null || typeof this.solicitud.numeroDeCaso === 'undefined' || this.solicitud.numeroDeCaso.length === 0) {
      this.utilService.mostrarDialogoSimple("Warning", "The case number field is empty.");
    } else {
      this.dialog.open(DialogoSolicitudCasenumberComponent, {
        data: {
          numeroCaso: this.solicitud.numeroDeCaso
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this phone.");
      }).catch(reason => this.utilService.manejarError(reason));
    }
  }

  obtenerSolicitud(idSolicitud: number) {
    this.cargando = true;
    Promise.all([
      this.tiposSolicitudService.obtenerTiposSolicitud(),
      //this.tiposPagoService.obtenerTiposPago(),
      this.solicitudesVocService.obtenerSolicitud(idSolicitud, this.usuario.idUsuario),
      this.eventoSolicitudVOC.obtenerHistorialSesionesSolicitud(idSolicitud)
    ])
      .then((results) => {
        this.arrTipoSolicitud = results[0];
        this.solicitud = results[1];
        this.arrEventosSolicitudVoc = results[2];
        this.arrScales.sort((a, b) => b.idScale - a.idScale);
        this.inputTipoSolicitud = this.arrTipoSolicitud[this.arrTipoSolicitud.findIndex(tipo => tipo.idTipoSolicitud == this.solicitud.idTipoSolicitud)];
        //this.inputTipoPago = this.arrTipoPago[this.arrTipoPago.findIndex(tipo => tipo.idTipoPago == this.solicitud.id)];
        this.onPhoneNumberInput(this.solicitud.telefono);
        this.titulo = "File " + this.solicitud.idSolicitud;

        //console.log('fechaInicio: '+this.solicitud.fechaInicio+ " - fechaLimite: "+this.fechaLimite);
        const fechaInicioD: Date = new Date(this.solicitud.fechaInicio);
        //console.log('fechaInicioD: '+fechaInicioD);
        this.fechaParaNuevoConteoDeVOC = fechaInicioD > this.fechaLimite;
        //console.log('fechaParaNuevoConteoDeVOC: '+this.fechaParaNuevoConteoDeVOC);  


        //this.fechaParaNuevoConteoDeVOC = this.miFecha > this.fechaLimite;

        // Esperar 2 segundos antes de asignar fechaNacimientoMat
        setTimeout(() => {

          if (this.solicitud.fechaNacimiento) {
            this.fechaNacimientoMat = convertirAFechaMat(this.solicitud.fechaNacimiento as string);
          }
          if (this.solicitud.fechaDoc1) {
            this.fechaDoc1Mat = convertirAFechaMat(this.solicitud.fechaDoc1 as string);
          }

          if (this.solicitud.fechaDoc2) {
            this.fechaDoc2Mat = convertirAFechaMat(this.solicitud.fechaDoc2 as string);
          }

        }, 2000);

      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  refreshSolicitudCompleta() {
    this.obtenerSolicitud(this.solicitud.idSolicitud);
    this.refreshEventosSolicitud
  }

  refreshSolicitudCompletaByIdSolicitud(idSolicitud: number) {
    this.obtenerSolicitud(idSolicitud);
    this.refreshEventosSolicitud();
    this.refreshCitasSolicitud();
  }

  obtenerTiposSolicitud() {
    this.cargando = true;
    this.tiposSolicitudService
      .obtenerTiposSolicitud()
      .then((tiposSolicitud) => {
        this.arrTipoSolicitud = tiposSolicitud;
        this.inputTipoSolicitud = this.arrTipoSolicitud[0];
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerTiposPago() {
    this.cargando = true;
    this.tiposPagoService
      .obtenerTiposPago()
      .then((tiposPago) => {
        this.arrTipoPago = tiposPago;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  crearSolicitud() {
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    console.log(this.solicitud)
    this.cargando = true;
    this.solicitudesVocService
      .insertarSolicitud(
        this.usuario.idUsuario,
        this.solicitud
      )
      .then((solicitud) => {
        /*window.history.replaceState({}, '',
                        '/solicitudes/solicitudes/' + solicitud.idSolicitud);
                    this.creando = false;
                    this.obtenerSolicitud(solicitud.idSolicitud);*/
        this.goBack();
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambios() {
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesVocService.actualizarSolicitud(this.solicitud).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  goBack() {
    this.utilService.goBack();
  }

  envioInterviewerScales() {
    this.dialog.open(DialogoSiguienteProcesoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
        interviewerScales: true
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') this.goBack();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  enviarNotificaciones() {
    this.dialog.open(DialogoNotificacionesComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        usuario: this.usuario
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') this.refreshEventosSolicitud();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  asignarTerapeuta() {
    this.dialog.open(DialogoAsignarTerapeutaComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
        terapeuta: this.solicitud.terapeuta
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'asignado') this.obtenerSolicitud(this.solicitud.idSolicitud);
      this.eventosSolicitudVocComponent.refresh();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cambiarEstatusSolicitud(idEstatusSolicitud: number, closed?: boolean) {
    this.cargando = true;
    this.solicitudesVocService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
      .then(() => {
        this.obtenerSolicitud(this.solicitud.idSolicitud);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  syncSolicitudSesiones() {
    this.cargando = true;
    this.solicitudesVocService.syncSolicitudSesiones(this.solicitud.idSolicitud, this.usuario.idUsuario)
      .then(() => {
        this.obtenerSolicitud(this.solicitud.idSolicitud);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  refreshEventosSolicitud() {
    this.eventosSolicitudVocComponent.refresh();
  }

  refreshCitasSolicitud() {
    this.citasSolicitudComponent.refresh();
  }

  viewDoc(url: string) {
    console.log(url)
    window.open(url, '_blank');
  }

  addScale() {
    this.cargando = true;
    this.scalesService.insertarScale(this.solicitud.idSolicitud, this.inputScale, this.usuario.idUsuario)
      .then(() => {
        this.scalesService.obtenerScalesSolicitud(this.solicitud.idSolicitud)
          .then(response => {
            this.arrScales = response;
            this.arrScales.sort((a, b) => b.idScale - a.idScale);
          })
          .catch((reason) => this.utilService.manejarError(reason))
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  removeScale(idScale: number) {
    this.cargando = true;
    this.scalesService.eliminarScale(idScale)
      .then(() => {
        this.scalesService.obtenerScalesSolicitud(this.solicitud.idSolicitud)
          .then(response => {
            this.arrScales = response;
            this.arrScales.sort((a, b) => b.idScale - a.idScale);
          })
          .catch((reason) => this.utilService.manejarError(reason))
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  onPhoneNumberInput(inputText: string): void {
    let trimmedValue = inputText.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    if (trimmedValue.length > 10) {
      trimmedValue = trimmedValue.slice(0, 10); // Limitar a 10 dígitos (formato de teléfono sin código de país)
    }

    // Aplicar la máscara (###) ###-####
    if (trimmedValue.length > 6) {
      trimmedValue = `(${trimmedValue.slice(0, 3)}) ${trimmedValue.slice(3, 6)}-${trimmedValue.slice(6)}`;
    } else if (trimmedValue.length > 3) {
      trimmedValue = `(${trimmedValue.slice(0, 3)}) ${trimmedValue.slice(3)}`;
    }
    this.solicitud.telefono = trimmedValue;
  }

  // usuarioExternalChange() {
  //   this.solicitud.external = !this.solicitud.external;

  //   if (this.solicitud.external) {
  //     this.cargando = true;
  //     this.usuariosService.obtenerUsuariosPorRol(9).then(usuariosExternal => {
  //       this.cargando = false;
  //       this.arrUsuariosExternal = usuariosExternal;
  //     }).catch(e => {
  //       this.utilService.manejarError(e);
  //       this.cargando = false;
  //     });
  //   }
  // }

  validatePhone() {
    if (this.solicitud.telefono === null || typeof this.solicitud.telefono === 'undefined' || this.solicitud.telefono.length === 0) {
      this.utilService.mostrarDialogoSimple("Warning", "The Phone field is empty.");
    } else {
      this.dialog.open(DialogoSolicitudTelefonoComponent, {
        data: {
          telefono: this.solicitud.telefono
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this phone.");
      }).catch(reason => this.utilService.manejarError(reason));
    }
  }

  validateEmptyField(field: any): boolean {
    return field === null || typeof field === 'undefined' || field.length === 0;
  }

  generateProcessLetter() {
    this.cargando = true;
    this.solicitudesVocService.generateProcessLetter(this.solicitud.idSolicitud, this.usuario.idUsuario).then(response => {
      this.utilService.saveByteArray("progress-letter_file-" + this.solicitud.idSolicitud, response, 'pdf');
    }).catch(e => this.utilService.manejarError(e))
      .finally(() => this.cargando = false);
  }

  completeFile() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Complete File',
        texto: 'Do you really want to complete this file?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesVocService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, 11, this.usuario.idUsuario, false)
          .then(() => {
            this.obtenerSolicitud(this.solicitud.idSolicitud);
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  reopenFile() {
    this.cargando = true;
    this.solicitudesVocService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, 14, this.usuario.idUsuario, false)
      .then(() => {
        this.obtenerSolicitud(this.solicitud.idSolicitud);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  document1CheckChange() {
    this.solicitud.documento1 = !this.solicitud.documento1;

    if (!this.solicitud.documento1) {
      this.solicitud.fechaDoc1 = null;
      this.fechaDoc1Mat = null;
    }
  }

  document2CheckChange() {
    this.solicitud.documento2 = !this.solicitud.documento2;

    if (!this.solicitud.documento2) {
      this.solicitud.fechaDoc2 = null;
      this.fechaDoc2Mat = null;
    }
  }

  changeFechaNacimientoMat() {
    console.log('fechaNacimientoMat changed:', this.fechaNacimientoMat);

    if (this.fechaNacimientoMat) {
      this.solicitud.fechaNacimiento = formatearFecha(this.fechaNacimientoMat);
      console.log('Fecha formateada (string):', this.solicitud.fechaNacimiento);
    }
  }

  changeFechaDoc1() {
    console.log('fechaDoc1Mat changed:', this.fechaNacimientoMat);

    if (this.fechaDoc1Mat) {
      this.solicitud.fechaDoc1 = formatearFecha(this.fechaDoc1Mat);
      console.log('Fecha formateada (string):', this.solicitud.fechaDoc1);
    }
  }

  changeFechaDoc2() {
    console.log('fechaDoc2Mat changed:', this.fechaNacimientoMat);

    if (this.fechaDoc2Mat) {
      this.solicitud.fechaDoc2 = formatearFecha(this.fechaDoc2Mat);
      console.log('Fecha formateada (string):', this.solicitud.fechaDoc2);
    }
  }

  changeApprovedSessions() {

     this.dialog.open(DialogoCambioSesionesComponent, {
                  data: {
                    idSolicitud: this.solicitud.idSolicitud,
                    titulo: 'Approved Sessions Adjustment',
                    subtitulo: 'Change number of approved sessions for file '+this.solicitud.idSolicitud,
                    textoRazon: 'Reason for adjusting approved sessions',
                    numSesiones: this.solicitud.numSesiones,
                    textoSesiones: 'Number of Sessions',
                    tipo: 'ASA'
                  },
                  disableClose: true,
                }).afterClosed().toPromise().then(valor => {
                  //this.refesh();
                }).catch(reason => this.utilService.manejarError(reason));

  }

  addTratmentPlan(){

     this.dialog.open(DialogoCambioSesionesComponent, {
                  data: {
                    idSolicitud: this.solicitud.idSolicitud,
                    titulo: 'Additional Treatment Plan',
                    subtitulo: 'Add sessions per new treatment plan to the file '+this.solicitud.idSolicitud,
                    textoRazon: 'Reason for the new treatment',
                    numSesiones: 0,
                    textoSesiones: 'Number of New Sessions',
                    tipo: 'ATP'
                  },
                  disableClose: true,
                }).afterClosed().toPromise().then(valor => {
                  //this.refesh();
                }).catch(reason => this.utilService.manejarError(reason));

  }

}
