import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { Configuracion } from 'src/model/configuracion';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { Usuario } from 'src/model/usuario';
import { DialogoCitaSolicitudComponent } from '../dialogo-cita-solicitud/dialogo-cita-solicitud.component';
import { DialogoCitaSolicitudVocDispoComponent } from 'src/app/voc/dialogo-cita-solicitud-voc-dispo/dialogo-cita-solicitud-voc-dispo.component';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, THERAPIST, VENDOR, VOC, CLINICIAN } from 'src/app/app.config';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';
import { EMPTY, firstValueFrom } from 'rxjs';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { switchMap,filter, catchError  } from 'rxjs/operators';
import { DialogoActualizarCitaComponent } from 'src/app/voc/dialogo-actualizar-cita/dialogo-actualizar-cita.component';

import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { WeekNavigatorComponent } from '../../common/week-navigator/week-navigator.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { Rol } from 'src/model/rol';
import { US_STATES } from 'src/app/app.config';


export class Semana {
  lunes: CitaSolicitud[];
  martes: CitaSolicitud[];
  miercoles: CitaSolicitud[];
  jueves: CitaSolicitud[];
  viernes: CitaSolicitud[];
  sabado: CitaSolicitud[];
  domingo: CitaSolicitud[];
}

@Component({
  standalone: true, imports: [RouterModule,
    WorkspaceNavComponent,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
    SolicitudesNavComponent,
    ExperimentalMenuComponent, DateMMDDYYYYPipe,
  MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule,
WeekNavigatorComponent, CalendarComponent],
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  providers: [
    DatePipe
  ]
})
export class CitasComponent implements OnInit {

  configuracionCalendario: Configuracion | null = null;
  versionCalendario: string = '1';

  // Flag para forzar el re-render del calendario (versión 2)
  calendarMounted: boolean = true;

  // Para binding con app-week-navigator
  currentWeek: Date = new Date();

  arrStates: any[] = [];
  stateSelected: string = '';
  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  mostrarDatosDia: boolean = false;
  conCitas: boolean = false;
  citasGeneral: CitaSolicitud[] = [];
  citasGeneralR: CitaSolicitud[] = [];
  citasDeDia: CitaSolicitud[] = [];
  citasPorDia: string = "Appointments per day";

  roles: Rol[] = [];
  filterFecha: string = "";
  filterUsuario: number = 0;
  filterRol: string = "0";
  filterAppointmentStatus: string = "All";
  appointmentStatuses: string[] = ["All", "Attended", "Not Attended"];
  citas: Semana = new Semana();
  filterViewAvalability: boolean = false;

  // Propiedades auxiliares para los datepickers de Material
  filterFechaMat: Date | null = null;

  arrFilterUsuarios: Usuario[] = [];
  usuarioAll: Usuario = new Usuario();
  rolesAll: Rol = new Rol();

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
  isClinician: boolean = false;

  lunes: string = '';
  martes: string = '';
  miercoles: string = '';
  jueves: string = '';
  viernes: string = '';
  sabado: string = '';
  domingo: string = '';

  constructor(

    private citaSolicitudService: CitaSolicitudService,
    private usuariosService: UsuariosService,
    private configuracionService: ConfiguracionService,
    private router: Router,
    public utilService: UtilService,
    private dialog: MatDialog) {
    let hoy: Date = new Date(Date.now());
    this.filterFecha = this.utilService.dateAsYYYYMMDD(hoy);
    this.filterFechaMat = hoy;
     // Build list with an "All" option first without mutating US_STATES
    this.arrStates = [{ name: "All", abbreviation: "All" }, ...US_STATES];
    this.stateSelected = "All";

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
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
    this.isClinician = this.usuario.rol == CLINICIAN ? true : false;

    if (this.isMaster || this.isVendor || this.isBackOffice) {

      this.usuarioAll.idUsuario = 0;
      this.usuarioAll.nombre = "All";
      this.arrFilterUsuarios.push(this.usuarioAll);
      this.rolesAll.idRol = "0";
      this.rolesAll.nombre = "All";
       this.roles.push(this.rolesAll);
      this.obtenerUsuariosParaCitas();
      this.obtenerRolesCitasDispo();
      
    }

    this.obtenerTipoCalendario();

    this.refrescar();

  }

  ngOnInit(): void {
  }

 async obtenerTipoCalendario() {
  this.cargando = true;
  try {
    this.configuracionCalendario = await firstValueFrom(this.configuracionService.getConfiguracion('TIPO-CALENDARIO')
    );
    this.versionCalendario = this.configuracionCalendario.valor;

  } catch (error) {
    this.utilService.manejarError(error);
  } finally {
    this.cargando = false;
  }
}

  // Handlers para eventos del WeekNavigator
  onWeekRefChange(d: Date) {
    this.currentWeek = d;
    // Actualiza filtro y refresca citas de la semana
    this.filterFecha = this.utilService.dateAsYYYYMMDD(d);
    this.refrescar();
    // Forzar recarga visual del calendario
    this.reloadCalendar();
  }

  onWeekRangeChange(range: { start: Date; end: Date }) {
    // Si requieres usar el rango completo de la semana
    // por ahora ajustamos filterFecha al inicio de semana y refrescamos
    this.filterFecha = this.utilService.dateAsYYYYMMDD(range.start);
    this.refrescar();
    // Forzar recarga visual del calendario
    this.reloadCalendar();
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }


  obtenerUsuariosParaCitas() {
    this.cargando = true;
    this.usuariosService
      .obtenerUsuariosParaCitas(this.usuario.idUsuario)
      .then(usuarios => {
        this.arrFilterUsuarios = usuarios;
        this.arrFilterUsuarios = [this.usuarioAll].concat(this.arrFilterUsuarios);
        //console.log(this.arrFilterUsuarios)
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  refrescar() {

    this.cargando = true;
    this.diasSemana();
    //console.log("Filter fecha:"+this.filterFecha);
    this.citaSolicitudService
      .obtenerCitasPorSemana(this.filterFecha, this.filterUsuario, this.filterViewAvalability, 
        this.usuario.idUsuario,this.filterRol,this.filterAppointmentStatus,this.stateSelected)
      .then(citas => {
        // this.citas = citas; 
        this.citasGeneral = citas;
        this.citasGeneralR = citas;
        this.organizarCitasDeSemana(
          this.obtenerPrimerDiaDeSemana(new Date(this.filterFecha)),
          citas
        );
        // console.log(this.citas);
        if (this.citasPorDia === "Appointments per week") {
          this.citasPorElDia();
        }
        // Recarga visual del calendario cuando cambian las citas/fechas
        this.reloadCalendar();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)

  }

  diasSemana() {

    let fechaSeleccionada: Date = new Date(this.filterFecha);
    //console.log('ff:'+this.filterFecha);7
    const [year, month, day] = this.filterFecha.split('-').map(Number);
    const fechaLocal = new Date(year, month - 1, day);
    //console.log('fechaLocal:'+fechaLocal);
    //console.log('fechaSeleccionada:'+fechaSeleccionada);

    //console.log(this.getMonday(fechaLocal));
    var lunesD = this.getMonday(fechaLocal);
    var martesD = new Date(lunesD);
    martesD.setDate(lunesD.getDate() + 1);
    var miercolesD = new Date(martesD);
    miercolesD.setDate(martesD.getDate() + 1);
    var juevesD = new Date(miercolesD);
    juevesD.setDate(miercolesD.getDate() + 1);
    var viernesD = new Date(juevesD);
    viernesD.setDate(juevesD.getDate() + 1);
    var sabadoD = new Date(viernesD);
    sabadoD.setDate(viernesD.getDate() + 1);
    var domingoD = new Date(sabadoD);
    domingoD.setDate(sabadoD.getDate() + 1);
    this.lunes = this.utilService.dateAsMMDDYYYY(lunesD);
    this.martes = this.utilService.dateAsMMDDYYYY(martesD);
    this.miercoles = this.utilService.dateAsMMDDYYYY(miercolesD);
    this.jueves = this.utilService.dateAsMMDDYYYY(juevesD);
    this.viernes = this.utilService.dateAsMMDDYYYY(viernesD);
    this.sabado = this.utilService.dateAsMMDDYYYY(sabadoD);
    this.domingo = this.utilService.dateAsMMDDYYYY(domingoD);
  }

  organizarCitasDeSemana(inicio: Date, citas: CitaSolicitud[]) {

    //console.log(`inicio ${inicio} `);

    for (let i = 0; i < 7; i++) {
      let fecha = this.utilService.dateAsYYYYMMDD(inicio);
      const diaActual = inicio.getDay();

      //console.log(`Procesando día ${diaActual} - fecha: ${fecha}`);

      switch (diaActual) {
        case 0:
          this.citas.domingo = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.domingo = this.ordenarPorHora(this.citas.domingo);
          break;
        case 1:
          this.citas.lunes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.lunes = this.ordenarPorHora(this.citas.lunes);
          break;
        case 2:
          this.citas.martes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.martes = this.ordenarPorHora(this.citas.martes);
          break;
        case 3:
          this.citas.miercoles = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.miercoles = this.ordenarPorHora(this.citas.miercoles);
          break;
        case 4:
          this.citas.jueves = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.jueves = this.ordenarPorHora(this.citas.jueves);
          break;
        case 5:
          this.citas.viernes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.viernes = this.ordenarPorHora(this.citas.viernes);
          break;
        case 6:
          this.citas.sabado = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.sabado = this.ordenarPorHora(this.citas.sabado);
          break;
        default:
          break;
      }

      // Avanzar al siguiente día
      inicio.setDate(inicio.getDate() + 1);
    }
  }

  ordenarPorHora(citasDia: CitaSolicitud[]): CitaSolicitud[] {
    return citasDia.sort((a, b) => (this.horaFormato24(a.hora, a.tipo) > this.horaFormato24(b.hora, b.tipo) ? 1 : -1));
  }

  horaFormato24(hora: string, tipo: string): string {
    let horas: string = hora.split(':')[0];
    horas = this.utilService.withLeadingZeros((parseInt(horas) + (tipo == 'PM' && horas != '12' ? 12 : 0) - (tipo == 'AM' && horas == '12' ? 12 : 0)), 2);
    let minutos: string = hora.split(':')[1];
    // console.log(horas + ':' + minutos + tipo);
    return horas + ':' + minutos;
  }

  obtenerPrimerDiaDeSemana(fecha: Date): Date {
    /*while (fecha.getDay() !== 0) {
      fecha.setDate(fecha.getDate() - 1);
    }
    return fechaCopia;
    */
    // Clonar la fecha para no modificar el original
    const fechaLocal = new Date(fecha);

    // Obtener día de la semana (0: domingo, 1: lunes, ..., 6: sábado)
    const diaSemana = fechaLocal.getDay();

    // Calcular diferencia para llegar al lunes de la semana ACTUAL
    const diff = diaSemana === 0 ? 1 : 1 - diaSemana;

    // Ajustar la fecha
    fechaLocal.setDate(fechaLocal.getDate() + diff);

    return fechaLocal;
  }

  crearCita() {

    this.dialog.open(DialogoCitaSolicitudVocDispoComponent, {
          data: {
            idSolicitud: 0,
            idUsuario: this.usuario.idUsuario,
            idUsuarioTerapeuta: this.usuario.idUsuario,
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'guardar') { this.refrescar();};
        }).catch(reason => this.utilService.manejarError(reason));
  }

  abrirDialogoActualizarCita(cita: CitaSolicitud) {
      this.dialog.open(DialogoActualizarCitaComponent, {
        data: {
          idSolicitud: cita.idSolicitud,
          titulo: 'Update schedule',
          subtitulo: 'Update recurrence schedule for file ' + cita.idSolicitud,
          cita: cita
        },
        disableClose: true,
      }).afterClosed().toPromise().then(() => {
        this.refrescar();
      }).catch(reason => this.utilService.manejarError(reason));
    }

  irASolicitud(event: Event, idSolicitud: number) {
    event.preventDefault();
    event.stopPropagation();
    if(this.usuario.rol == VOC || this.usuario.rol == THERAPIST ){
      this.router.navigateByUrl('//solicitudes/solicitudes-voc/' + idSolicitud);
    }else{
      this.router.navigateByUrl('/solicitudes/solicitudes/' + idSolicitud);
    }
  }

  async verCita(cita: CitaSolicitud) {
    if (this.filterViewAvalability) {
      if (this.isTherapist || this.isVOC) {

        if (this.isTherapist) {
          const dialogRef = this.dialog.open(DialogoCitaSolicitudComponent, {
            data: {
              idSolicitud: cita.idSolicitud,
              creando: true,
              verCampoSolicitud: true,
              citaSolicitud: cita
            },
            disableClose: true,
          });

          try {
            const valor = await firstValueFrom(dialogRef.afterClosed());
            if (valor === 'guardar') this.refrescar();
          } catch (error) {
            this.utilService.manejarError(error);
          }
        }

      } else {
        this.router.navigateByUrl('/solicitudes/solicitudes/nueva-solicitud');
      }
    }
    else {
      if (this.isMaster || this.isVendor || this.isBackOffice || this.isInterviewer || this.isInterviewerScales || this.isClinician) {
        this.router.navigateByUrl('/solicitudes/solicitudes/' + cita.idSolicitud);
      }
      else if (this.isTherapist || this.isVOC) {
        const dialogRef = this.dialog.open(DialogoCitaSolicitudComponent, {
          data: {
            idSolicitud: cita.idSolicitud,
            creando: false,
            verCampoSolicitud: true,
            citaSolicitud: cita
          },
          disableClose: true,
        });

        try {
          const valor = await firstValueFrom(dialogRef.afterClosed());
          if (valor === 'guardar') this.refrescar();
        } catch (error) {
          this.utilService.manejarError(error);
        }
      }
    }
  }

  citasDia() {
    if (this.citasPorDia === "Appointments per day") {
      this.citasPorElDia();
    } else {
      this.mostrarDatosDia = false;
      this.citasPorDia = "Appointments per day"
    }
  }

  citasPorElDia() {
    this.citasGeneral = this.citasGeneralR;
    this.mostrarDatosDia = true;
    // console.log('citas:' + this.citasGeneral.length);
    this.citasGeneral = this.citasGeneral.filter(cita => cita.fecha.split(' ')[0] == this.filterFecha) as CitaSolicitud[];
    this.citasDeDia = this.citasGeneral;
    this.citasPorDia = "Appointments per week"
    if (this.citasGeneral.length != 0) {
      this.conCitas = true;
    } else {
      this.conCitas = false;
    }
  }

  onFilterFechaMatChange() {
      if (this.filterFecha) {
        this.filterFecha = formatearFecha(this.filterFechaMat);
      } else {
        this.filterFecha = "";
      }
      this.refrescar();
      // Forzar recarga visual del calendario al cambiar la fecha
      this.reloadCalendar();
    }

    obtenerRolesCitasDispo() {
    this.cargando = true;
    this.usuariosService
      .obtenerRolesCitasDispo(this.usuario.idUsuario)
      .then(roles => {
        this.roles = roles;
        this.roles = [this.rolesAll].concat(this.roles);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  enviarRecordatorio(cita: CitaSolicitud){
     
   const dialogRef = this.dialog.open(DialogoSimpleComponent, {
       data: {
         titulo: 'Sending appointment reminder email',
         texto: 'Do you really want to send a notification email to schedule an appointment on ' + cita.fecha + ' at ' + cita.hora + ' ' + cita.tipo + ' to '+ cita.nombreUsuario + ' ?',
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
        //Envio de recordatorio
        this.cargando = true;
        return this.citaSolicitudService.enviarRecordatorio(cita.idEvento);
       }),
       catchError(error => {
         this.utilService.manejarError(error);
         return EMPTY;
       })
     ).subscribe(() => {
       this.cargando = false;
     });
  }

   enviarRecordatorios(){

    let baseDate: Date;
    if (this.filterFecha) {
      const [year, month, day] = this.filterFecha.split('-').map(Number);
      baseDate = new Date(year, month - 1, day);
    } else {
      baseDate = new Date();
    }

    const monday = this.obtenerPrimerDiaDeSemana(baseDate);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);


    const currentWeek = this.utilService.dateAsMMDDYYYY(monday) + ' to ' + this.utilService.dateAsMMDDYYYY(sunday);

   const dialogRef = this.dialog.open(DialogoSimpleComponent, {
       data: {
         titulo: 'Sending appointment reminder email',
         texto: 'Do you really want to send a notification email to schedules appointments for the week ' + currentWeek + ' ?',
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
        //Envio de recordatorio
        this.cargando = true;
        return this.citaSolicitudService.enviarRecordatorios(this.filterFecha,this.usuario.idUsuario);
       }),
       catchError(error => {
         this.utilService.manejarError(error);
         return EMPTY;
       })
     ).subscribe(() => {
       this.cargando = false;
     });
  }




























// Nuevo calendar
readonly diasSemanaCalendar = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

fechaSeleccionada: Date = new Date();
  vista: 'week' | 'day' = 'week'; 
  diaSeleccionado: number = 0;

  cambiarVista(vista: 'week' | 'day') {
    console.log('vista seleccionada: ' + vista);
    this.vista = vista;
    if (vista === 'day') {
      this.diaSeleccionado = 0;
    }
  }

  selectDay(index: number) {
    this.diaSeleccionado = index;
  }

  obtenerDiaSeleccionado(): number {
    return this.diaSeleccionado;
  }

  obtenerDiaSemanaSeleccionado(): string {
    return this.diasSemanaCalendar[this.diaSeleccionado];
  }

  onFechaCambio(event: any) {
    this.fechaSeleccionada = new Date(event.target.value);
  }





  readonly horas = this.generarHoras();

  private generarHoras(): string[] {
    const horas = [];
    for (let i = 7; i <= 22; i++) {
      const hora12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const periodo = i < 12 ? 'AM' : 'PM';
      horas.push(`${hora12}:00 ${periodo}`);
    }
    return horas;
  }

  obtenerCitasPorDiaYHora(dia: number, hora: string): CitaSolicitud[] {
    return this.citasGeneral.filter(cita => {
      // Fecha puede venir como 'YYYY-MM-DD' o 'YYYY-MM-DD HH:mm:ss'
      const [fechaParte] = cita.fecha.split(' ');
      const [year, month, day] = fechaParte.split('-').map(Number);
      const citaFecha = new Date(year, month - 1, day);

      // Obtener la fecha para este día de la semana
      const fechaDia = this.obtenerFechaPorDiaDate(dia);

      // Comparar si es el mismo día (ignorando hora)
      const mismoDia =
        fechaDia.getFullYear() === citaFecha.getFullYear() &&
        fechaDia.getMonth() === citaFecha.getMonth() &&
        fechaDia.getDate() === citaFecha.getDate();

      // Agrupar por hora del slot (ignorando minutos)
      const slot = this.parseHoraSlot(hora); // p.ej. {hora12:7, periodo:'AM'}
      const hc = this.parseHoraCita(cita.hora, cita.tipo); // incluye minutos

      return mismoDia && hc.periodo === slot.periodo && hc.hora12 === slot.hora12;
    });
  }

  obtenerCitasPorDia(diaIndex: number): CitaSolicitud[] {
    const fechaDia = this.obtenerFechaPorDiaDate(diaIndex);
    return this.citasGeneral.filter(cita => {
      const [year, month, day] = cita.fecha.split('-').map(Number);
      const citaFecha = new Date(year, month - 1, day);
      return (
        fechaDia.getFullYear() === citaFecha.getFullYear() &&
        fechaDia.getMonth() === citaFecha.getMonth() &&
        fechaDia.getDate() === citaFecha.getDate()
      );
    });
  }

  private formatearHora12(hora: string, tipo: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    const hora12 = horas === 0 ? 12 : horas > 12 ? horas - 12 : horas;
    return `${hora12}:${minutos.toString().padStart(2, '0')} ${tipo}`;
  }

  private convertirHoraFormato24(hora: string, tipo: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    let horas24 = horas;
    
    if (tipo === 'PM' && horas !== 12) {
      horas24 = horas + 12;
    } else if (tipo === 'AM' && horas === 12) {
      horas24 = 0;
    }
    
    return `${horas24.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  // Parsear un slot "7:00 AM" a hora+periodo ignorando los minutos
  private parseHoraSlot(horaSlot: string): { hora12: number; periodo: 'AM' | 'PM' } {
    const parts = horaSlot.trim().split(' ');
    const timePart = parts[0]; // "7:00"
    const periodo = (parts[1] as 'AM' | 'PM') || 'AM';
    const hora12 = Number(timePart.split(':')[0]);
    return { hora12, periodo };
  }

  // Parsear hora de cita conservando minutos; ejemplo hora="07:30", tipo="AM"
  private parseHoraCita(hora: string, tipo: string): { hora12: number; minutos: number; periodo: 'AM' | 'PM' } {
    const [hStr, mStr] = hora.split(':');
    const hora12 = Number(hStr);
    const minutos = Number(mStr);
    const periodo = (tipo as 'AM' | 'PM') || 'AM';
    return { hora12, minutos, periodo };
  }

  obtenerEstatusClass(cita: CitaSolicitud): string {
    if (cita.noShow) {
      return 'estatus-noshow';
    }
    if (cita.pagado) {
      return 'estatus-pagado';
    }
    if (cita.dosCitas) {
      return 'estatus-doscitas';
    }
    return 'estatus-default';
  }

  procesarColor(colorHex: string | null, cita: CitaSolicitud): string {
    // Si no hay color, usar un color por defecto
    if (!colorHex) {
      return 'rgba(100, 100, 100, 0.15)'; // Gris claro por defecto
    }
    
    // Convertir hex a RGB
    const hex = colorHex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Aplicar 15% de opacidad
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  obtenerFechaPorDiaDate(diaIndex: number): Date {
    // Parsear filterFecha a Date local para evitar problemas de zona horaria
    const [y, m, d] = this.filterFecha.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    const diaActual = fecha.getDay();
    const lunes = new Date(fecha);

    const diasLunes = diaActual === 0 ? 6 : diaActual - 1;
    lunes.setDate(fecha.getDate() - diasLunes);

    const fechaDia = new Date(lunes);
    fechaDia.setDate(lunes.getDate() + diaIndex);

    return fechaDia;
  }

  obtenerFechaPorDia(diaIndex: number): string {
    const fechaDia = this.obtenerFechaPorDiaDate(diaIndex);
    
    const mes = (fechaDia.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaDia.getDate().toString().padStart(2, '0');
    const año = fechaDia.getFullYear();
    
    return `${mes}/${dia}/${año}`;
  }

  // Fuerza desmontar y montar el bloque del calendario (v2)
  private reloadCalendar(): void {
    this.calendarMounted = false;
    setTimeout(() => {
      this.calendarMounted = true;
    });
  }

  obtenerIniciales(nombre: string): string {
    if (!nombre) return '';
    const partes = nombre.trim().split(/\s+/);
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  obtenerColorSolido(colorHex: string | null): string {
    if (!colorHex) {
      return '#888888';
    }
    return colorHex;
  }


}
