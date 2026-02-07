import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { Usuario } from 'src/model/usuario';
import { DialogoCitaSolicitudComponent } from '../dialogo-cita-solicitud/dialogo-cita-solicitud.component';
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

import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

 import { WeekNavigatorComponent } from '../../common/week-navigator/week-navigator.component';
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
WeekNavigatorComponent],
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss'],
  providers: [
    DatePipe
  ]
})
export class CitasComponent implements OnInit {
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

    this.refrescar();

  }

  ngOnInit(): void {
  }

  // Handlers para eventos del WeekNavigator
  onWeekRefChange(d: Date) {
    this.currentWeek = d;
    // Actualiza filtro y refresca citas de la semana
    this.filterFecha = this.utilService.dateAsYYYYMMDD(d);
    this.refrescar();
  }

  onWeekRangeChange(range: { start: Date; end: Date }) {
    // Si requieres usar el rango completo de la semana
    // por ahora ajustamos filterFecha al inicio de semana y refrescamos
    this.filterFecha = this.utilService.dateAsYYYYMMDD(range.start);
    this.refrescar();
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
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: null,
        creando: true,
        verCampoSolicitud: true
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'creado') this.refrescar();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  async verCita(cita: CitaSolicitud) {
    if (this.filterViewAvalability) {
      this.router.navigateByUrl('/solicitudes/solicitudes/nueva-solicitud');
    }
    else {
      if (this.isMaster || this.isVendor || this.isBackOffice || this.isInterviewer || this.isInterviewerScales || this.isClinician) {
        this.router.navigateByUrl('/solicitudes/solicitudes/' + cita.idSolicitud);
      }
      else if (this.isTherapist) {
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

}
