import { Component, OnInit,HostListener } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { ADMINISTRATOR, BACKOFFICE, CLINICIAN, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC, US_STATES } from 'src/app/app.config';
import { EstatusPagoService } from 'src/app/services/estatus-pago.service';
import { EstatusSolicitudService } from 'src/app/services/estatus-solicitud.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Filter, UtilService } from 'src/app/services/util.service';
import { EstatusPago } from 'src/model/estatus-pago';
import { EstatusSolicitud } from 'src/model/estatus-solicitud';
import { Solicitud } from 'src/model/solicitud';
import { SolicitudList } from 'src/model/solicitud-list';
import { Usuario } from 'src/model/usuario';
import { Filtros } from 'src/model/filtros';
import { PaginationManager } from 'src/util/pagination';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TiposSolicitudService } from "src/app/services/tipos-solicitud.service";
import { TipoSolicitud } from "src/model/tipo-solicitud";

import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs'; 
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';
import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';
import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  standalone: true,
  imports: [FormsModule,RouterModule,SolicitudesNavComponent,WorkspaceNavComponent,ExperimentalMenuComponent,
    CommonModule,NgClass,MatIconModule,MatDialogModule,MatProgressSpinnerModule,DateMMDDYYYYPipe,PhonePipe,
    MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule],
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
  providers: [
      DatePipe,
      PhonePipe]
})
export class SolicitudesComponent implements OnInit {

    arrStates: any[] = [];

  cargando: boolean = false;

  mostrandoResultadosFiltrados = false;
  solicitudes: SolicitudList[] = [];
  solicitudesSinFiltrar: SolicitudList[] = [];
  seleccion: number[] = [];

  usuario: Usuario = new Usuario;

  paginacion: PaginationManager = new PaginationManager();

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

  advancedFilters: boolean = false;

    public arrTipoSolicitud: TipoSolicitud[] = [];
    public inputTipoSolicitud: TipoSolicitud = new TipoSolicitud;

  //arrFilterTypes: any[] = ["All", "File", "Customer", "Phone", "Email", "File Status", "Payment Status", "Responsible User", "Waiver"];

  arrFilterFileStatus: EstatusSolicitud[] = [{
    "idEstatusSolicitud": 0,
    "descripcion": "All"
  }];
  arrFilterStatusPago: EstatusPago[] = [{
    "idEstatusPago": 0,
    "descripcion": "All"
  }];
  arrFilterWaiver: any[] = [{
    "display": "",
    "value": ""
  }, {
    "display": "Yes",
    "value": "Yes"
  }, {
    "display": "No",
    "value": "No"
  }];


  inputFile: number = 0;
  inputCustomer: string = "";
  inputPhone: string = "";
  inputEmail: string = "";
  inputState: string = "";
  inputFileStatus: number = 0;
  inputPaymentStatus: number = 0;
  inputFileType: number = 0;
  inputWaiver: string = "";
  inputNoshow: string = "";
  inputImportante: string = "";
  inputAsignado: string = "";
  inputZipcodes: string = "";


  filterType: string = "All";
  filterMyFiles: boolean = true;
  filterInputText: string = "";
  filterInputDate1: string = "";
  filterInputDate2: string = "";

  filterStartDate: string = '';
  filterEndDate: string= '';
  filterSortBy: string = '';
  filterOrder: string = '';
  filterClosedS: string = '';

  // Propiedades auxiliares para los datepickers de Material
  filterStartDateMat: Date | null = null;
  filterEndDateMat: Date | null = null;

  filtros: string = '';

  arrFilterTypes: string[] = [];
  arrFilterSortBy: string[] = [];
  arrFilterOrder: string[] = ['ASC','DESC'];
  arrFilterClosed: string[] = ['OPEN','CLOSED'];

  filtrosObj: Filtros = new Filtros;

  constructor(
    private router: Router,
    private solicitudesService: SolicitudesService,
    private estatusSolicitudService: EstatusSolicitudService,
    private estatusPagoService: EstatusPagoService,
    private tiposSolicitudService: TiposSolicitudService,
    public utilService: UtilService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {

    // Usar la constante global de estados de US_STATES
    this.arrStates = US_STATES;

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
    this.isClinician = this.usuario.rol == CLINICIAN ? true : false;

    var today = new Date().toISOString();
    //this.filterEndDate = today.split('T', 1)[0];
    this.filterEndDateMat = new Date();
    this.filterClosedS = 'OPEN';

    var date = new Date();
    if(this.isTemplateCreator){
      date.setMonth(date.getMonth() - 8);
    }else{
      date.setMonth(date.getMonth() - 1);
    }
    

    date.setDate(1);
    //this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
    this.filterStartDateMat = date;

    this.obtenerEstatusSolicitudes();
    this.obtenerEstatusPagos();
    //this.clearInputs();
    this.obtenerTextosOrdenarPor();
    this.obtenerTextosTipoParaFiltros();
    this.obtenerTiposSolicitud();
   
   
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.explorar();
    }
  }

  ngOnInit(): void {

    var today = new Date().toISOString();
    var date = new Date();
    if(this.isBackOffice && this.usuario.revisor){
      date.setMonth(date.getMonth() - 6);
    }else if(this.isTemplateCreator){
      date.setMonth(date.getMonth() - 8);
    }else{
      date.setMonth(date.getMonth() - 1);
    }
    date.setDate(1);

    this.filterClosedS = 'OPEN';

     //localStorage.setItem('filtros','');
     //console.log('f:' + localStorage.getItem('filtros'));
     //console.log('b:' + localStorage.getItem('backSolicitud'));
 
     if (localStorage.getItem('backSolicitud') != null) {
 
       if (localStorage.getItem('filtros') != null) {
 
         if (localStorage.getItem('filtros') !== '') {
 
           this.filtrosObj = JSON.parse(localStorage.getItem('filtros'));
           this.filterStartDate = this.filtrosObj.fechainicio;
           this.filterEndDate = this.filtrosObj.fechafin;
           this.filterSortBy = this.filtrosObj.sort;
           this.filterOrder = this.filtrosObj.order;
           this.filterType = this.filtrosObj.campo;
           this.filterInputText = this.filtrosObj.valor;
           this.filterMyFiles = this.filtrosObj.myfiles;
           //console.log('f:'+this.filtrosObj.closed);
           
           this.filterClosedS = this.filtrosObj.closed;
 
         }
       }
       //console.log(this.filterClosedS);
       if (localStorage.getItem('backSolicitud') === '1') {
         localStorage.setItem('backSolicitud', '');
         this.explorar();
         //console.log('explorar');
         //this.filterType = 'All';
        
       } else {
         this.limpiarFiltros();
         localStorage.setItem('filtros', '');
         this.filterEndDate = today.split('T', 1)[0];
         this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
         this.filterClosedS = 'OPEN';
         this.filterType = 'File';
         //console.log('refrescar');
         this.refrescar();
       }
     } else {
       localStorage.setItem('backSolicitud', '');
       this.filterEndDate = today.split('T', 1)[0];
       this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
       this.filterClosedS = 'OPEN';
       this.filterType = 'File';
       //console.log('refrescar');
       this.refrescar();
     }
     
    //console.log('list:'+this.route.snapshot.paramMap.get('valor'));
    //console.log(this.filterClosedS);
    
  }

  advancedFiltersFn(){  

    if(this.advancedFilters){
      this.advancedFilters = false;
    } else {
      this.advancedFilters = true;
    }

  }
  

  obtenerEstatusSolicitudes() {
    this.cargando = true;
    this.estatusSolicitudService
      .obtenerEstatusSolicitudesDeUsuario(this.usuario.idUsuario)
      .then(estatusSolicitudes => {
        this.arrFilterFileStatus = estatusSolicitudes;
        this.arrFilterFileStatus = [{
          "idEstatusSolicitud": 0,
          "descripcion": "All"
        }].concat(this.arrFilterFileStatus);
        //console.log(this.arrFilterFileStatus)
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerTextosOrdenarPor() {
    this.cargando = true;
    this.solicitudesService
      .obtenerTextosOrdenarPor(this.usuario.idUsuario)
      .then(textos => {
        this.arrFilterSortBy = textos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerTextosTipoParaFiltros() {
    this.cargando = true;
    this.solicitudesService
      .obtenerTextosTipoParaFiltros(this.usuario.idUsuario)
      .then(textos => {
        this.arrFilterTypes = textos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerEstatusPagos() {
    this.cargando = true;
    this.estatusPagoService
      .obtenerEstatusPagos()
      .then(estatusPagos => {
        this.arrFilterStatusPago = estatusPagos;
        this.arrFilterStatusPago = [{
          "idEstatusPago": 0,
          "descripcion": "All"
        }].concat(this.arrFilterStatusPago);
        //console.log(this.arrFilterStatusPago)
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
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

  botonRefrescar(){
    this.limpiarFiltros();
    this.refrescar()
  }

  refrescar() {
    this.cargando = true;
    this.solicitudesService
      .obtenerSolicitudesUsuario(this.filterStartDate, this.filterEndDate, this.filterSortBy, 
        this.filterOrder, this.usuario.idUsuario,this.filterType, this.filterInputText, this.filterMyFiles, 
        this.filterClosedS,true).subscribe({
  next: (solicitudes) => {
    this.solicitudesSinFiltrar = solicitudes;
    this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
    this.paginacion.setArray(this.solicitudes, 10);
    this.setearFiltros();
    this.cargando = false;
  },
  error: (reason) => {
    this.utilService.manejarError(reason);
    this.cargando = false;
  }
});
  }

  refrescarV2() {
    this.cargando = true;
    this.solicitudesService
      .obtenerSolicitudesUsuarioConFiltros(this.usuario.idUsuario, this.filterClosedS, true, this.filterSortBy, this.filterOrder,
        this.filterStartDate, this.filterEndDate, this.inputFile, this.inputCustomer, this.inputPhone, this.inputEmail, this.inputState, 
        this.inputFileStatus, this.inputPaymentStatus, this.inputFileType, this.inputWaiver, this.inputNoshow, this.inputImportante,this.inputAsignado, this.inputZipcodes)
      .subscribe({
  next: (solicitudes) => {
    this.solicitudesSinFiltrar = solicitudes;
    this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
    this.paginacion.setArray(this.solicitudes, 10);
    this.setearFiltros();
    this.cargando = false;
  },
  error: (reason) => {
    this.utilService.manejarError(reason);
    this.cargando = false;
  }
});
  }

  showClosedRequests() {
    this.cargando = true;
    this.solicitudesService
      .obtenerSolicitudesUsuarioCerradas(this.usuario.idUsuario)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes,10);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  estanTodosSeleccionados() {
    return this.seleccion.length == this.solicitudes.length;
  }

  checkAll(event: Event, id: string) {
    if (this.estanTodosSeleccionados()) this.seleccion = [];
    else {
      this.seleccion = [];
      this.solicitudes.forEach(u => this.seleccion.push(u.idSolicitud));
    }
  }

  estaSeleccionado(id: number) {
    return this.seleccion.find(e => e == id) != null;
  }

  check(event: Event, id: number) {
    if ((event.srcElement as HTMLInputElement).checked) {
      //add
      if (!this.estaSeleccionado(id)) this.seleccion.push(id);
    } else {
      //remove
      if (this.estaSeleccionado(id)) this.seleccion.splice(this.seleccion.indexOf(id), 1);
    }
  }

  explorar() {
    //console.log(this.filterClosedS);
    this.cargando = true;
    this.solicitudesService
      //.obtenerReporteSolicitudesFilters(this.usuario.idUsuario, this.filterType, this.filterInputText, this.filterInputDate1, this.filterInputDate2, this.filterMyFiles)
      .obtenerSolicitudesUsuario(this.filterStartDate, this.filterEndDate, this.filterSortBy, this.filterOrder, this.usuario.idUsuario,this.filterType, this.filterInputText, this.filterMyFiles, this.filterClosedS,false)
      .subscribe({
  next: (solicitudes) => {
   this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes,10);
        this.setearFiltros();
    this.cargando = false;
  },
  error: (reason) => {
    this.utilService.manejarError(reason);
    this.cargando = false;
  }

      
});
  }


  descargarExcel(){
    this.cargando = true;
    this.solicitudesService
     .obtenerReporteSolicitudesFiltersExcel(this.usuario.idUsuario, this.filterClosedS, true, this.filterSortBy, this.filterOrder,
        this.filterStartDate, this.filterEndDate, this.inputFile, this.inputCustomer, this.inputPhone, this.inputEmail, this.inputState, 
        this.inputFileStatus, this.inputPaymentStatus, this.inputFileType, this.inputWaiver, this.inputNoshow, this.inputImportante,this.inputAsignado, this.inputZipcodes).
      subscribe(
        data =>{
          const file = new Blob([data], {type: 'application/vnd.ms-excel'});
          var fileUrl = URL.createObjectURL(file);
          let link: any = window.document.createElement('a');
          link.href = fileUrl;
          let aux = fileUrl.split('/');
          link.download = aux[aux.length -1]+".xlsx";
          link.click();
          this.cargando = false;
        }
      )
  }


  setearFiltros(){
    //this.filtros = this.filterStartDate +","+ this.filterEndDate +","+  this.filterSortBy+","+  this.filterOrder+","+  this.usuario.idUsuario+","+ this.filterType+","+  this.filterInputText+","+  this.filterMyFiles;
    //console.log('filtros closed:'+this.filterClosedS);
    this.filtros = "{ \"fechainicio\": \""+this.filterStartDate+"\", \"fechafin\": \""+this.filterEndDate+"\" , \"sort\": \""+this.filterSortBy+"\" , \"order\": \""+this.filterOrder+"\" , \"campo\": \""+this.filterType+"\" , \"valor\": \""+this.filterInputText+"\" , \"myfiles\": \""+this.filterMyFiles+"\", \"closed\": \""+this.filterClosedS+"\"}";     
    //console.log('filtros a guardar:'+this.filtros);
    localStorage.setItem('filtros', this.filtros);
  }

  clearInputs() {
    if (this.filterType == "All" || this.filterType == "File" || this.filterType == "Customer" || this.filterType == "Phone" || this.filterType == "Email" || this.filterType == "File Status" || this.filterType == "Payment Status" || this.filterType == "Responsible User" || this.filterType == "Waiver") {
      this.filterInputText = "";
      this.filterInputDate1 = "none";
      this.filterInputDate2 = "none";
      this.filterClosedS = 'OPEN';
    } else if (this.filterType == "Date") {
      this.filterInputText = "none";
      this.filterInputDate1 = "";
      this.filterInputDate2 = "";
      this.filterClosedS = 'OPEN';
    }
  }

  limpiarFiltros() {
      this.filterInputText = "";
      this.filterInputDate1 = "";
      this.filterInputDate2 = "";
      this.filterType = 'File';
      this.filterSortBy = "";
      this.filterOrder = "";
      this.filterClosedS = 'OPEN';
  }

  limpiarFiltrosFinal() {
      this.filterInputDate1 = "";
      this.filterInputDate2 = "";
      this.filterSortBy = "";
      this.filterOrder = "";
      this.filterClosedS = 'OPEN';
      this.inputFile = 0;
      this.inputCustomer = "";
      this.inputPhone = "";
      this.inputEmail = "";
      this.inputState = "";
      this.inputFileStatus = 0;
      this.inputPaymentStatus = 0;
      this.inputFileType = 0;
      this.inputWaiver = "";
      this.inputNoshow = "";
      this.inputImportante = "";
      this.inputAsignado = "";
      this.inputZipcodes = "";
  }
  limpiarFiltrosSinFecha() {
    this.filterInputText = "";
    this.filterInputDate1 = "";
    this.filterInputDate2 = "";
    this.filterType = "";
    this.filterSortBy = "";
    this.filterOrder = "";
  
}
  limpiarFechas() {
    this.filterStartDate = "";
    this.filterEndDate = "";  
    this.filterStartDateMat = null;
    this.filterEndDateMat = null;  
}

  crearSolicitud() { this.router.navigateByUrl('/solicitudes/solicitudes/nueva-solicitud'); }

  onStartDateChange() {
    if (this.filterStartDateMat) {
      this.filterStartDate = formatearFecha(this.filterStartDateMat);
    } else {
      this.filterStartDate = "";
    }
  }

  onEndDateChange() {
    if (this.filterEndDateMat) {
      this.filterEndDate = formatearFecha(this.filterEndDateMat);
    } else {
      this.filterEndDate = "";
    }
  }


}
