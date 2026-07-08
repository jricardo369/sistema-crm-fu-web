import { ScalesService } from './../../services/scales.service';

import { AdjuntosComponent } from 'src/app/solicitudes/adjuntos/adjuntos.component';
import { EventosSolicitudComponent } from 'src/app/solicitudes/eventos-solicitud/eventos-solicitud.component';
import { MovimientosSolicitudComponent } from 'src/app/solicitudes/movimientos-solicitud/movimientos-solicitud.component';

import { Component, OnInit, ViewChild, forwardRef,ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SolicitudesService } from "src/app/services/solicitudes.service";
import { TiposPagoService } from "src/app/services/tipos-pago.service";
import { TiposSolicitudService } from "src/app/services/tipos-solicitud.service";
import { UtilService } from "src/app/services/util.service";
import { MotivoCancelService } from "src/app/services/motivo-cancel.service";
import { Solicitud } from "src/model/solicitud";
import { MotivoCancel } from "src/model/motivo-cancel";
import { TipoPago } from "src/model/tipo-pago";
import { TipoSolicitud } from "src/model/tipo-solicitud";
import { Usuario } from "src/model/usuario";
import { DialogoSiguienteProcesoComponent } from "../dialogo-siguiente-proceso/dialogo-siguiente-proceso.component";
import { DialogoNotificacionesComponent } from "../dialogo-notificaciones/dialogo-notificaciones.component";
import { DialogoAbogadoComponent } from "src/app/administracion-general/dialogo-abogado/dialogo-abogado.component";
import { Scale } from 'src/model/scale';
import { Abogado } from 'src/model/abogado';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { ADMINISTRATOR, ARR_LANGUAJES, ARR_REFERRALSORUCE, ARR_TYPESOFINTERVIEW, BACKOFFICE, CLINICIAN, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, US_STATES, VENDOR, VOC } from 'src/app/app.config';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DialogoSolicitudTelefonoComponent } from '../dialogo-solicitud-telefono/dialogo-solicitud-telefono.component';
import { ReportesService } from '../../services/reportes.service';
import { AbogadosService } from '../../services/abogados.service';
import { DialogoCancelarCitaSolicitudComponent } from '../dialogo-cancelar-cita-solicitud/dialogo-cancelar-cita-solicitud.component';
import { DialogoNoShowYRejectSolicitudComponent } from '../dialogo-no-show-y-reject-solicitud/dialogo-no-show-y-reject-solicitud.component';
import { DialogoReopenComponent } from '../dialogo-reopen/dialogo-reopen.component';
import { FormControl } from '@angular/forms';
import { Observable, of,EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith,filter, catchError  } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { DialogoMailsAbogado } from "../dialogo-mails-abogado/dialogo-mails-abogado";
import { formatearFecha } from '../../util/date-utils';
import { convertirAFechaMat } from '../../util/date-utils';

import { AutoDateMaskDirective } from '../../common/directives/auto-date-mask.directive';

 

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule, MovimientosSolicitudComponent, AdjuntosComponent, EventosSolicitudComponent, WorkspaceNavComponent, ExperimentalMenuComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AutoDateMaskDirective,
    CommonModule, NgClass, MatIconModule, MatDialogModule, MatProgressSpinnerModule, SolicitudesNavComponent, DateMMDDYYYYPipe],
  selector: "app-solicitud",
  templateUrl: "./solicitud.component.html",
  styleUrls: ["./solicitud.component.css"],
  providers: [
    { provide: 'ParentComponent', useExisting: forwardRef(() => SolicitudComponent) }, DatePipe
  ]
})
export class SolicitudComponent implements OnInit {

  arrAssignedClinicians: Usuario[] = [];

  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  idUsuarioLogueado: number;
  titulo: string = "";

  solicitud: Solicitud = new Solicitud;
  comentarios: string = "";
  
  // Nueva propiedad para el datepicker de Material
  fechaInicioMaterial: Date | null = null;

  lawyerFirm: string = "";
  lawyerName: string = "";
  lawyerEmail: string = "";
  lawyerPhone: string = "";
  lawyerSyn: string = "";

  public arrTipoSolicitud: TipoSolicitud[] = [];
  public inputTipoSolicitud: TipoSolicitud = new TipoSolicitud;

  arrTipoPago: TipoPago[] = [];
  inputTipoPago: TipoPago = new TipoPago;

  arrScales: Scale[] = [];
  inputScale: Scale = new Scale;

  scales: string[] = ['Scale 1', 'Scale 2', 'Scale 3', 'Scale 4', 'Scale 5'];

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
  isClinician: boolean = false;

  arrFilterMotivoCancel: MotivoCancel[] = [];
  arrStates: any[] = [];
  arrLanguages: any = [];
  arrGender: any = [];
  arrTypesOfInterview: any = [];
  arrReferralSources: any = [];
  arrUsuariosExternal: Usuario[] = [];
  abogadosFiltrados!: Observable<Abogado[]>;

  fechaNacimientoMat: Date;
  fechaDeCrimenMat: Date;
  dueDateMat: Date;

  fechaNacimientoError: boolean;
    fechaDueDateError: boolean;
  minBirthDate = new Date(1900, 0, 1);
  maxBirthDate = new Date();

  @ViewChild(EventosSolicitudComponent, { static: false }) eventosSolicitudComponent: EventosSolicitudComponent;
  @ViewChild(AdjuntosComponent, { static: false }) adjuntosComponent: AdjuntosComponent;
  @ViewChild(MovimientosSolicitudComponent, { static: false }) movimientosSolicitudComponent: MovimientosSolicitudComponent;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    public utilService: UtilService,
    public motivoCancelService: MotivoCancelService,
    private solicitudesService: SolicitudesService,
    private tiposSolicitudService: TiposSolicitudService,
    private tiposPagoService: TiposPagoService,
    private scalesService: ScalesService,
    private usuariosService: UsuariosService,
    private reportesService: ReportesService,
    private abogadosService: AbogadosService,
    private dialog: MatDialog,
    private datePipe: DatePipe
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
    this.isClinician = this.usuario.rol == CLINICIAN ? true : false;

    route.params.subscribe((params) => {
      
      let codigo = params["id"];
      if (codigo.toString() == "nueva-solicitud") {
        this.titulo = "New File";
        this.creando = true;
        this.solicitud.asignacionTemplate = false;
        this.solicitud.waiver = false;
        this.solicitud.signedClnc = false;
        this.solicitud.consent = false;
        this.solicitud.paralegalName = null;
        this.solicitud.paralegalEmails = null;
        this.solicitud.paralegalTelefonos = null;
        this.obtenerTiposSolicitud();

        this.solicitud.external = false;
      } else {
        this.editando = true;
        this.obtenerSolicitud(Number.parseInt(codigo));

      }

    });

    this.obtenerUsuariosAssignedClinician();

    

    
  }

  abogadoControl = new FormControl();
  abogados: Abogado[] = [];
  abogadoSeleccionado?: Abogado;

  ngOnInit(): void {
   
    this.abogadoControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor) =>
          typeof valor === 'string' && valor.length > 1
            ? this.abogadosService.obtenerAbogadosEmailsPorNombre(valor)
            : of([])
        )
      )
      .subscribe((res) => (this.abogados = res));
     console.log("MOVIMIENTOS: " + this.isBackOffice); localStorage.setItem('backSolicitud', '1'); console.log(this.solicitud);

    this.idUsuarioLogueado = this.usuario.idUsuario;
    //console.log("usuario logeado:" + this.idUsuarioLogueado); 

  }

  limpiarAssignedClinician() {
  const dialogRef = this.dialog.open(DialogoSimpleComponent, {
    data: {
      titulo: 'Clean Clinician',
      texto: 'Do you really want to clean the clinician? Double-check, as it may affect the process.',
      botones: [
        { texto: 'Cancel', color: '', valor: '' },
        { texto: 'Yes', color: 'primary', valor: 'ok' },
      ]
    },
    disableClose: true,
  });

  dialogRef.afterClosed().pipe(
    filter(valor => valor === 'ok'),
    switchMap(() => {
      this.solicitud.assignedClinician = null;
      return this.ejecutarLimpiezaClinico();
    }),
    catchError(error => {
      this.utilService.manejarError(error);
      return EMPTY;
    })
  ).subscribe();
}

 finishClncAssignedClinician() {
    const dialogRef = this.dialog.open(DialogoSimpleComponent, {
    data: {
      titulo: 'Finish Clinician',
      texto: 'Do you really want to finish the clinician? Double-check, as it may affect the process.',
      botones: [
        { texto: 'Cancel', color: '', valor: '' },
        { texto: 'Yes', color: 'primary', valor: 'ok' },
      ]
    },
    disableClose: true,
  });

  dialogRef.afterClosed().pipe(
    filter(valor => valor === 'ok'),
    switchMap(() => {
      return this.envioParcheFinClnc();
    }),
    catchError(error => {
      this.utilService.manejarError(error);
      return EMPTY;
    })
  ).subscribe();
}

private envioParcheFinClnc(): Observable<any> { 
  this.solicitudesService.envioFinEntrevistaClinician(this.solicitud.idSolicitud, this.usuario.idUsuario)
          .then(() => {
            this.cargando = false;
            this.refreshSolicitudCompleta();
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
  return of(null);
}

private ejecutarLimpiezaClinico(): Observable<any> {
  // Combina ambas operaciones
  this.guardarCambios();
  this.refreshSolicitudCompleta();
  return of(null);
}

  limpiarAbogado() {
    console.log(this.abogadoControl.value);
    console.log(this.abogadoSeleccionado);
    this.abogadoSeleccionado = null;
    this.solicitud.idAbogado = 0;
    this.abogadoControl.setValue(''); // Limpiar el FormControl
    this.abogadoControl.reset(); // Reset adicional para asegurar limpieza completa
    
    // Limpiar todas las variables relacionadas con el abogado
    this.lawyerName = "";
    this.lawyerFirm = "";
    this.lawyerPhone = "";
    this.lawyerSyn = "";
    this.solicitud.emailAboSel = "";
  }

  displayFn(abogado: Abogado): string {
    return abogado ? abogado.nombre : '';
  }

  onOptionSelected(event: any): void {
    this.abogadoSeleccionado = event.option.value;
    console.log('Abogado seleccionado:', this.abogadoSeleccionado);
  }

  obtenerSolicitud(idSolicitud: number) {
    this.cargando = true;
    Promise.all([
      this.tiposSolicitudService.obtenerTiposSolicitud(),
      this.tiposPagoService.obtenerTiposPago(),
      this.solicitudesService.obtenerSolicitud(idSolicitud, this.usuario.idUsuario),
      this.scalesService.obtenerScalesSolicitud(idSolicitud)
    ])
      .then((results) => {

        

        this.arrTipoSolicitud = results[0];
        this.arrTipoPago = results[1];
        this.solicitud = results[2];
        this.arrScales = results[3];
        this.arrScales.sort((a, b) => b.idScale - a.idScale);
        this.inputTipoSolicitud = this.arrTipoSolicitud[this.arrTipoSolicitud.findIndex(tipo => tipo.idTipoSolicitud == this.solicitud.idTipoSolicitud)];
        //this.inputTipoPago = this.arrTipoPago[this.arrTipoPago.findIndex(tipo => tipo.idTipoPago == this.solicitud.id)];
        this.onPhoneNumberInput(this.solicitud.telefono);
        this.titulo = "File " + this.solicitud.idSolicitud;

        if (this.solicitud.idAbogado > 0) {
          this.abogadosService.obtenerUsuarioPorId(this.solicitud.idAbogado).then(abogado => {

            this.abogadoSeleccionado = abogado;
            this.abogadoSeleccionado.email = this.solicitud.emailAboSel;
            this.lawyerName = abogado.nombre;
            this.lawyerFirm = abogado.firma;
            this.lawyerEmail = this.solicitud.emailAboSel;
            this.lawyerPhone = abogado.telefono;
            this.lawyerSyn = abogado.sinonimos;
          })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));

        }

        
        // Esperar 2 segundos antes de asignar fechaNacimientoMat
        setTimeout(() => {

          if (this.solicitud.fechaNacimiento) {
             this.fechaNacimientoMat = convertirAFechaMat(this.solicitud.fechaNacimiento as string);  
          }
          if (this.solicitud.dueDate) {
          this.dueDateMat = convertirAFechaMat(this.solicitud.dueDate as string);
          }
          if (this.solicitud.fechaDeCrimen) {
          this.fechaDeCrimenMat = convertirAFechaMat(this.solicitud.fechaDeCrimen as string);
          }


        }, 2000);

      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));

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

    this.datosAbogado();

    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    console.log(this.solicitud)
    this.cargando = true;
    this.solicitudesService
      .insertarSolicitud(
        this.usuario.idUsuario,
        this.solicitud,
        this.comentarios
      )
      .then((solicitud) => {
        /*window.history.replaceState({}, '',
                        '/solicitudes/solicitudes/' + solicitud.idSolicitud);
                    this.creando = false;
                    this.obtenerSolicitud(solicitud.idSolicitud);*/
        //this.goBack();
        this.router.navigate(['/solicitudes/solicitudes']);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  datosAbogado() {
    const valor = this.abogadoControl.value;

    if (valor !== '') {
      // Si escribió algo pero no seleccionó un objeto válido
      if (typeof valor !== 'object') {
        this.utilService.mostrarDialogoSimple("Error", "You must select the right lawyer");
        return;
      }
    }

    if (valor !== '') {
      if (this.abogadoSeleccionado != null) {

        console.log("idAbogadoseleccionado:" + this.abogadoSeleccionado.idAbogado);
        this.solicitud.idAbogado = this.abogadoSeleccionado.idAbogado;
        console.log("EmailAbogadoSeleecionado:" + this.abogadoSeleccionado.email);
        this.solicitud.emailAboSel = this.abogadoSeleccionado.email;

      }
    }
  }

  guardarCambios() {
   

    this.datosAbogado();

    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesService.actualizarSolicitud(this.solicitud, false, this.usuario.idUsuario).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambiosClosed() {

    this.datosAbogado();

    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesService.actualizarSolicitud(this.solicitud, true, this.usuario.idUsuario).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => { this.cargando = false; this.refreshSolicitudCompleta() });
  }

  goBack() {
    this.utilService.goBack();

  }

  siguienteProceso() {
    if (this.solicitud.idEstatusSolicitud == 1 && !this.isInterviewerScales) { //Send to Interviewe
      this.dialog.open(DialogoSiguienteProcesoComponent, {
        data: {
          idSolicitud: this.solicitud.idSolicitud,
          idUsuario: this.usuario.idUsuario,
          interviewerScales: false,
          interviewerClinician: false
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'enviado') {
          if (this.isMaster || this.isVendor || this.isBackOffice) {
            this.obtenerSolicitud(this.solicitud.idSolicitud);
            this.refreshSolicitudCompleta();
          }
          else {
            //this.goBack();
            this.router.navigate(['/solicitudes/solicitudes']);
          }
        }
      }).catch(reason => this.utilService.manejarError(reason));
    } else {
      this.cargando = true;
      this.solicitudesService.obtenerSolicitud(this.solicitud.idSolicitud, this.usuario.idUsuario).then(validateSolicitud => {
        this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'Send to next process',
            texto: 'Do you really want to send to next process?',
            warning: validateSolicitud.idEstatusSolicitud == 10
              && (this.validateEmptyField(validateSolicitud.email_abogado)
                || this.validateEmptyField(validateSolicitud.firmaAbogados)
                || this.validateEmptyField(validateSolicitud.paralegalEmails))
              ? 'The paralegal data is missing, remember that if it is sent to the next process you will not receive notification.' : null,
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Send', color: 'primary', valor: 'enviar' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'enviar') {
            this.cargando = true;
            this.solicitudesService.envioSiguienteProceso(this.solicitud.idSolicitud, false, this.usuario.idUsuario)
              .then(() => {
                this.cargando = false;
                //this.goBack();
                this.router.navigate(['/solicitudes/solicitudes']);
              }).catch(e => {
                //window.alert("ALGO NO SALIO BIEN");
                this.utilService.manejarError(e);
                this.cargando = false;
              });
          }
        }).catch(reason => this.utilService.manejarError(reason));
      }).catch(reason => this.utilService.manejarError(reason))
        .finally(() => this.cargando = false);
    }
  }

  envioInterviewerScales() {
    this.dialog.open(DialogoSiguienteProcesoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
        interviewerCaseManager: false,
        interviewerScales: true,
        interviewerClinician: false
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') {
        if (this.isMaster || this.isVendor || this.isBackOffice) {
          this.obtenerSolicitud(this.solicitud.idSolicitud);
          this.refreshSolicitudCompleta();
        }
        else {
          //this.goBack();
          this.router.navigate(['/solicitudes/solicitudes']);
        }
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  envioInterviewerCaseManager() {
    this.dialog.open(DialogoSiguienteProcesoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
        estado: this.solicitud.estado,
        interviewerCaseManager: true,
        interviewerScales: false,
        interviewerClinician: false
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') {
        if (this.isMaster || this.isVendor || this.isBackOffice) {
          this.obtenerSolicitud(this.solicitud.idSolicitud);
          this.refreshSolicitudCompleta();
        }
        else {
          //this.goBack();
          this.router.navigate(['/solicitudes/solicitudes']);
        }
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  envioInterviewerClinician() {
    this.dialog.open(DialogoSiguienteProcesoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
         interviewerCaseManager: false,
        interviewerScales: false,
        interviewerClinician: true,
        estado: this.solicitud.estado
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') {
        if (this.isMaster || this.isVendor || this.isBackOffice) {
          this.obtenerSolicitud(this.solicitud.idSolicitud);
          this.refreshSolicitudCompleta();
        }
        else {
          //this.goBack();
          this.router.navigate(['/solicitudes/solicitudes']);
        }
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  envioFinEntrevistaCasemanager() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Finish review file',
        texto: 'Do you really want to do this action?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesService.envioFinEntrevistaCaseManager(this.solicitud.idSolicitud, this.usuario.idUsuario)
          .then(() => {
            this.cargando = false;
            //this.goBack();
            this.router.navigate(['/solicitudes/solicitudes']);
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  envioFinEntrevistaScales() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Finish review file',
        texto: 'Do you really want to do this action?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesService.envioFinEntrevistaScales(this.solicitud.idSolicitud, this.usuario.idUsuario)
          .then(() => {
            this.cargando = false;
            //this.goBack();
            this.router.navigate(['/solicitudes/solicitudes']);
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  envioFinEntrevistaClinician() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Finish review file',
        texto: 'Do you really want to do this action?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesService.envioFinEntrevistaClinician(this.solicitud.idSolicitud, this.usuario.idUsuario)
          .then(() => {
            this.cargando = false;
            //this.goBack();
            this.router.navigate(['/solicitudes/solicitudes']);
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }
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

  asignarTemplate() {
    let usuariosOptions: any[] = [];
    this.cargando = true;
    this.usuariosService.obtenerUsuariosPorRol(7).then(usuarios => {
      this.cargando = false;
      usuarios.forEach(usuario => usuariosOptions.push({ display: usuario.nombre, value: usuario.idUsuario }));

      if (usuariosOptions.length > 0) {
        let campos = [];
        campos.push({ label: "User", type: "select", placeholder: "select user", value: usuariosOptions[0].value, options: usuariosOptions });
        this.utilService
          .mostrarDialogoConFormulario(
            "Assign Template",
            "Select user asign",
            "Send",
            "Cancel",
            campos
          ).then(valor => {
            if (valor == 'ok') {
              this.cargando = true;
              this.solicitudesService.envioTemplate(this.solicitud.idSolicitud, this.usuario.idUsuario, campos[0].value)
                .then(() => {
                  this.cargando = false;
                  //this.goBack();
                  this.router.navigate(['/solicitudes/solicitudes']);
                }).catch(e => {
                  this.utilService.manejarError(e);
                  this.cargando = false;
                });
            }
          }).catch(reason => this.utilService.manejarError(reason));
      } else {
        this.utilService.mostrarDialogoSimple("Warning", "There are no templates available");
      }
    }).catch(e => {
      this.utilService.manejarError(e);
      this.cargando = false;
    });
  }

  cancelTemplate() {
    let usuariosOptions: any[] = [];
    this.cargando = true;
    this.usuariosService.obtenerUsuariosPorRol(4, 1).then(usuarios => {
      this.cargando = false;
      usuarios.forEach(usuario => usuariosOptions.push({ display: usuario.nombre, value: usuario.idUsuario }));

      if (usuariosOptions.length > 0) {
        let campos = [];
        if (!this.isInterviewerScales) campos.push({ label: "User to asign", type: "select", placeholder: "select user", value: usuariosOptions[0].value, options: usuariosOptions });
        campos.push({ label: "Cancel assign Template", type: "textarea", placeholder: "Enter your rejection reason", value: "", maxLength: 500 });
        this.utilService
          .mostrarDialogoConFormulario(
            "Cancel assign Template",
            "Complete the information",
            "Send",
            "Cancel",
            campos
          ).then(valor => {
            if (valor == 'ok') {
              if (this.isInterviewerScales) campos.splice(0, 0, { value: 0 });
              this.cargando = true;
              this.solicitudesService.cancelTemplate(this.solicitud.idSolicitud, this.usuario.idUsuario, campos[0].value, campos[1].value)
                .then(() => {
                  this.cargando = false;
                  //this.goBack();
                  this.router.navigate(['/solicitudes/solicitudes']);
                }).catch(e => {
                  this.utilService.manejarError(e);
                  this.cargando = false;
                });
            }
          }).catch(reason => this.utilService.manejarError(reason));
      } else {
        this.utilService.mostrarDialogoSimple("Warning", "There are no users available");
      }
    }).catch(e => {
      this.utilService.manejarError(e);
      this.cargando = false;
    });
  }



  cancelarCita() {
    this.dialog.open(DialogoCancelarCitaSolicitudComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') { this.obtenerSolicitud(this.solicitud.idSolicitud); this.refreshSolicitudCompleta(); }
      else if (valor == 'vacio') { this.utilService.mostrarDialogoSimple("Warning", "Has no appointments yet."); }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  obtenerMotivosCancel() {
    this.cargando = true;
    this.motivoCancelService
      .obtenerMotivosCancel("CNC", this.usuario.idUsuario)
      .then(motivos => {
        this.arrFilterMotivoCancel = motivos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  cambiarEstatusSolicitud(idEstatusSolicitud: number, closed?: boolean) {
    switch (idEstatusSolicitud) {

      case 4: //Reject Request


        this.dialog.open(DialogoNoShowYRejectSolicitudComponent, {
          data: {
            titulo: "Reject File",
            tipo: "reject",
            idSolicitud: this.solicitud.idSolicitud,
            tituloLabel: "Reason for rejection"
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'enviado') { this.obtenerSolicitud(this.solicitud.idSolicitud); this.refreshSolicitudCompleta(); }
          else if (valor == 'vacio') { this.utilService.mostrarDialogoSimple("Warning", "Has no appointments yet."); }
        }).catch(reason => this.utilService.manejarError(reason));

        break;

      case 5: //No-show


        this.dialog.open(DialogoNoShowYRejectSolicitudComponent, {
          data: {
            titulo: "No show",
            tipo: "noshow",
            idSolicitud: this.solicitud.idSolicitud,
            tituloLabel: "Reason for no show"
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'enviado') { this.obtenerSolicitud(this.solicitud.idSolicitud); this.refreshSolicitudCompleta(); }
          else if (valor == 'vacio') { this.utilService.mostrarDialogoSimple("Warning", "Has no appointments yet."); }
        }).catch(reason => this.utilService.manejarError(reason));


        break;

      case 7: //Lost

        this.dialog.open(DialogoNoShowYRejectSolicitudComponent, {
          data: {
            titulo: "Lost",
            tipo: "lost",
            idSolicitud: this.solicitud.idSolicitud,
            tituloLabel: "Reason for lost"
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          this.refreshSolicitudCompleta();
        }).catch(reason => this.utilService.manejarError(reason));

        break;
      
      case 9: //Reopen

        this.dialog.open(DialogoReopenComponent, {
          data: {
            idSolicitud: this.solicitud.idSolicitud,
            tituloLabel: "Reason for reopening"
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'enviado') { this.obtenerSolicitud(this.solicitud.idSolicitud); this.refreshSolicitudCompleta(); }
          else if (valor == 'vacio') { this.utilService.mostrarDialogoSimple("Warning", "Has no appointments yet."); }
        }).catch(reason => this.utilService.manejarError(reason));


        break;

      case 10: //Ready on draft
          
          this.dialog.open(DialogoSimpleComponent, {
            data: {
              titulo: 'Finish to Ready on Draft ',
              texto: 'Do you really want to "Finish to Ready on Draft"?',
              botones: [
                { texto: 'Cancel', color: '', valor: '' },
                { texto: 'Yes', color: 'primary', valor: 'ok' },
              ]
            },
            disableClose: true,
          }).afterClosed().toPromise().then(valor => {
            if (valor == 'ok') {
              this.cargando = true;
              this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
                .then(() => {
                  this.cargando = false;
                  //this.goBack();
                  this.router.navigate(['/solicitudes/solicitudes']);
                })
                .catch((reason) => this.utilService.manejarError(reason))
                .then(() => (this.cargando = false));
            }
          }).catch(reason => this.utilService.manejarError(reason));
        
      break;

      case 11: //Finish-Case

        if (closed) {
          this.cargando = true;
          this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
            .then(() => {
              this.cargando = false;
              //this.goBack();
              this.router.navigate(['/solicitudes/solicitudes']);
            })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));
        } else {
          this.dialog.open(DialogoSimpleComponent, {
            data: {
              titulo: 'Finish Case',
              texto: 'Do you really want to finish the case?',
              botones: [
                { texto: 'Cancel', color: '', valor: '' },
                { texto: 'Yes', color: 'primary', valor: 'ok' },
              ]
            },
            disableClose: true,
          }).afterClosed().toPromise().then(valor => {
            if (valor == 'ok') {
              this.cargando = true;
              this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
                .then(() => {
                  this.cargando = false;
                  //this.goBack();
                  this.router.navigate(['/solicitudes/solicitudes']);
                })
                .catch((reason) => this.utilService.manejarError(reason))
                .then(() => (this.cargando = false));
            }
          }).catch(reason => this.utilService.manejarError(reason));
        }
        break;

      default:
        this.cargando = true;
        this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
          .then(() => {
            if (idEstatusSolicitud == 8) {
              this.eventosSolicitudComponent.refresh();
            }
            this.obtenerSolicitud(this.solicitud.idSolicitud);
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
        break;
    }
  }

  refreshEventosSolicitud() {
    this.eventosSolicitudComponent.refresh();
  }

  refreshMovimientosSolicitud() {
    this.movimientosSolicitudComponent.refresh();
  }

  viewDoc(url: string) {
    console.log(url)
    window.open(url, '_blank');
  }

  refreshSolicitudCompleta() {
    this.eventosSolicitudComponent.refresh();
    this.obtenerSolicitud(this.solicitud.idSolicitud);
  }

  addScale() {
    this.cargando = true;
    this.scalesService.insertarScale(this.solicitud.idSolicitud, this.inputScale, this.usuario.idUsuario)
      .then(() => {
        this.scalesService.obtenerScalesSolicitud(this.solicitud.idSolicitud)
          .then(response => {
            this.arrScales = response;
            this.arrScales.sort((a, b) => b.idScale - a.idScale);
            this.eventosSolicitudComponent.refresh();
            this.inputScale.scale = '';
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

  usuarioExternalChange() {
    this.solicitud.external = !this.solicitud.external;

    if (this.solicitud.external) {
      this.cargando = true;
      this.usuariosService.obtenerUsuariosPorRol(9).then(usuariosExternal => {
        this.cargando = false;
        this.arrUsuariosExternal = usuariosExternal;
      }).catch(e => {
        this.utilService.manejarError(e);
        this.cargando = false;
      });
    }
  }

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

  generateW9() {
    this.cargando = true;
    this.reportesService.generateW9(this.solicitud.idSolicitud, this.usuario.idUsuario).then(response => {
      this.utilService.saveByteArray("invoice_file-" + this.solicitud.idSolicitud, response, 'pdf');
    }).catch(e => this.utilService.manejarError(e))
      .finally(() => this.cargando = false);
  }

  obtenerUsuariosAssignedClinician() {
    this.cargando = true;
    this.usuariosService.obtenerUsuariosAssignedClinician()
      .then(usuarios => {
        this.arrAssignedClinicians = usuarios;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  onActionCompleted(event?: any) {
    console.log('Action completed in child, received in parent:', event);
    this.refreshSolicitudCompleta();
  }

  onNuevoAbogado() {
    this.dialog.open(DialogoAbogadoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        usuario: this.usuario,
        nuevoDesdeSol: true,
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') this.refreshEventosSolicitud();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  onAgregarEmailAbogado() {
    this.dialog.open(DialogoAbogadoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        usuario: this.usuario,
        nuevoDesdeSol: false,
        isAddEmailAbo: true
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') this.refreshEventosSolicitud();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  agregarCupon() {

    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Add coupon',
        texto: 'Do you really want to add a coupon for the lawyer?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesService.actualizarConCuponSolicitud(this.solicitud.idSolicitud, this.usuario.idUsuario)
          .then(() => {
            this.obtenerSolicitud(this.solicitud.idSolicitud);
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
      }
    }).catch(reason => this.utilService.manejarError(reason));



  }

  verMailsAbogado() {
    this.dialog.open(DialogoMailsAbogado, {
      data: {
        lawyerName: this.lawyerName,
        idLawyer: this.solicitud.idAbogado,
        emails: this.lawyerEmail,
        idSolicitud: this.solicitud.idSolicitud,
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      this.refreshSolicitudCompleta();
    }).catch(reason => this.utilService.manejarError(reason));

  }

  changeFechaNacimientoMat() {
    console.log('fechaNacimientoMat changed:', this.fechaNacimientoMat);

    if (this.fechaNacimientoMat) {
      this.solicitud.fechaNacimiento = formatearFecha(this.fechaNacimientoMat);
      console.log('Fecha formateada (string):', this.solicitud.fechaNacimiento);
    }

    
  }

  changeFechaDeCrimenMat() {
    console.log('fechaDeCrimenMat changed:', this.fechaDeCrimenMat);

    if (this.fechaDeCrimenMat) {
      this.solicitud.fechaDeCrimen = formatearFecha(this.fechaDeCrimenMat);
      console.log('Fecha formateada (string):', this.solicitud.fechaDeCrimen);
    }

    
  }

  changeDueDateMat() {
    console.log('dueDateMat changed:', this.dueDateMat);

    if (this.dueDateMat) {
      this.solicitud.dueDate = formatearFecha(this.dueDateMat);
      console.log('Fecha formateada (string):', this.solicitud.dueDate);
    }
  }

    changeInterviewToCaseMgr() {

    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Change Interview to Case Manager',
        texto: 'Do you really want to change the interview to the case manager?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesService.actualizarInterviewClinicianToCaseManager(this.solicitud.idSolicitud, this.solicitud.assignedClinician,this.usuario.idUsuario)
          .then(() => {
            this.refreshSolicitudCompleta();
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
      }
    }).catch(reason => this.utilService.manejarError(reason));



  }

  limpiarDueDate(){
    this.dueDateMat = null;
    this.solicitud.dueDate = null;
  }



}
