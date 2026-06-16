import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { MarketingNavComponent } from 'src/app/marketing/marketing-nav/marketing-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { Usuario } from 'src/model/usuario';
import { EstatusProspectosAbogadoService } from 'src/app/services/estatus-prospectos-abogado.service';
import { ProspectosAbogadoService } from 'src/app/services/prospectos-abogado.service';

import { Filter, UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';
import { ProspectoAbogado } from 'src/model/prospecto-abogado';
import { EstatusProspectoAbogado } from 'src/model/estatus-prospecto-abogado';
import { PaginationManager } from 'src/util/pagination';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { formatearFecha } from '../../util/date-utils';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogoProspectoAbogadoComponent } from '../dialogo-prospecto-abogado/dialogo-prospecto-abogado.component';

import { MARKETING,MARKETING_REV,DIG_MAR_MAN,US_STATES } from 'src/app/app.config';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WorkspaceNavComponent,
    MarketingNavComponent,
    ExperimentalMenuComponent,
    PhonePipe,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    DateMMDDYYYYPipe,
    DatePipe
  ],
  selector: 'app-lawyers-prospects',
  templateUrl: './lawyers-prospects.component.html',
  styleUrls: ['./lawyers-prospects.component.css'],
  providers: [
    DatePipe,
    PhonePipe]
})
export class LawyersProspectsComponent {

  cargando: boolean = false;
  usuario: Usuario = new Usuario;
  arrStates: any[] = [];
  isMarketing: boolean = false;
  isMarketingRev: boolean = false;
  isDigitalMarketingManager: boolean = false;
  filterClosedS: string = '';
  advancedFilters: boolean = false;

  prospectosAbogadoList: ProspectoAbogado[] = [];
  prospectosAbogadoListSinFiltrar: ProspectoAbogado[] = [];
  seleccion: number[] = [];
  paginacion: PaginationManager = new PaginationManager();

  arrFilterEstatusProspectoAbogado: EstatusProspectoAbogado[] = [{
    "idEstatusProspectoAbogado": 0,
    "descripcion": "All"
  }];
  
  arrFilterClosed: string[] = [];
  inputId: string = '';
  inputState: string = '';
  inputPhone: string = '';
  inputLawFirmOrContactName: string = '';
  inputEmail: string = '';


  filterStartDate: string;
  filterEndDate: string;
  filterStartDateMat: Date | null = null;
  filterEndDateMat: Date | null = null;
  dialog: any;
  idSolicitud: any;

  arrFilterYesNo: any[] = [{
    "display": "",
    "value": ""
  }, {
    "display": "Yes",
    "value": "Yes"
  }, {
    "display": "No",
    "value": "No"
  }];

  inputMailPackageReceived: string = "";
  inputEmailSent: string = "";
  input20Porcent: string = "";
  inputFollowUp20Porcent: string = "";
  inputProspectSentClient: string = "";

  constructor(
    private router: Router,
    private estatusProspectosAbogadoService: EstatusProspectosAbogadoService,
    private prospectosAbogadoService: ProspectosAbogadoService,
    public utilService: UtilService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));

    this.arrStates = [{ abbreviation: '' }, ...US_STATES];


    this.obtenerEstatusSolicitudes();

    var date = new Date();
    date.setMonth(date.getMonth() - 1);

    date.setDate(1);
    //this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
    this.filterStartDateMat = date;

    this.filterEndDateMat = new Date();

    if (this.usuario.rol === '12') {
      this.arrFilterClosed = ['PROSPECT','COLD','NOT INTERESTED','CLOSED','INTERESTED'];
    }
    if (this.usuario.rol === '13') {
      this.arrFilterClosed = ['INTERESTED', 'SUCESSFUL', 'CLOSED'];
    }

    if (this.usuario.rol === '14') {
      this.arrFilterClosed = ['','PROSPECT', 'NOT INTERESTED','INTERESTED', 'SUCESSFUL', 'CLOSED','COLD'];
    }

    if (this.usuario.rol === '12') {
      this.filterClosedS = 'PROSPECT';
    }

    if (this.usuario.rol === '13') {
      this.filterClosedS = 'INTERESTED';
    }

    this.isMarketing = this.usuario.rol == MARKETING ? true : false;
    this.isMarketingRev = this.usuario.rol == MARKETING_REV ? true : false;
    this.isDigitalMarketingManager = this.usuario.rol == DIG_MAR_MAN ? true : false;

  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.refrescar();
    }
  }

  ngOnInit(): void {

    var today = new Date().toISOString();
    var date = new Date();
  
    this.filterEndDate = today.split('T', 1)[0];
       this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
       console.log('fs:'+ this.filterStartDate);

        this.refrescar();
  
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

    this.estatusProspectosAbogadoService
      .obtenerEstatusProspectosAbogado()
      .subscribe({
        next: (estatusProsAbo) => {
          this.arrFilterEstatusProspectoAbogado = [{
            idEstatusProspectoAbogado: 0,
            descripcion: 'All'
          }].concat(estatusProsAbo);
        },
        error: (reason) => {
          this.utilService.manejarError(reason);
          this.cargando = false;
        },
        complete: () => {
          this.cargando = false;
        }
      });
  }

  botonRefrescar() {
    this.refrescar()
  }

  refrescar() {
    this.cargando = true;
    const fechaInicio = this.filterStartDateMat ? formatearFecha(this.filterStartDateMat) : '';
    const fechaFin = this.filterEndDateMat ? formatearFecha(this.filterEndDateMat) : '';

    this.prospectosAbogadoService.obtenerProspectosAbogado(this.inputId,fechaInicio, fechaFin, this.usuario.idUsuario, this.filterClosedS,
      this.inputState, this.inputPhone, this.inputLawFirmOrContactName, this.inputEmail,
      this.inputMailPackageReceived, this.inputEmailSent, this.input20Porcent, this.inputFollowUp20Porcent, this.inputProspectSentClient
    ).subscribe({
      next: (prospectosAbogado) => {
        this.prospectosAbogadoList = prospectosAbogado;
        this.prospectosAbogadoListSinFiltrar = this.prospectosAbogadoList.filter(e => true);
        this.paginacion.setArray(this.prospectosAbogadoList, 10);
        this.cargando = false;
      },
      error: (reason) => {
        this.utilService.manejarError(reason);
        this.cargando = false;
      }
    });
  }

  eventoMenu(evento: any) { }

  crearProspectoAbogado() {
    this.router.navigateByUrl('/marketing/lawyers-prospects/nueva-solicitud');
  }

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

  crearEvento() {
          this.dialog.open(DialogoProspectoAbogadoComponent, {
              data: {
                  idSolicitud: this.idSolicitud
              },
              disableClose: true,
          }).afterClosed().toPromise().then(valor => {
              if (valor == 'creado') this.refresh();
          }).catch(reason => this.utilService.manejarError(reason));
      }
  refresh() {
    throw new Error('Method not implemented.');
  }

  limpiarFiltros() {
    this.inputId = '';
      this.inputState = '';
      this.inputPhone = "";
      this.inputLawFirmOrContactName = "";
      this.inputEmail = "";
  }
  limpiarFechas() {
    this.filterStartDate = "";
    this.filterEndDate = "";  
    this.filterStartDateMat = null;
    this.filterEndDateMat = null;  
}

}
