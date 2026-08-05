import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { DialogoAddPagoVocComponent } from 'src/app/voc/dialogo-add-pago-voc/dialogo-add-pago-voc.component';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { CargoVoc } from 'src/model/cargo-voc';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';
import { CargoVocCabecera } from 'src/model/cargos-voc-cabecera';

@Component({
  standalone: true, imports: [RouterModule, FormsModule, WorkspaceNavComponent, ExperimentalMenuComponent,
    CommonModule, NgClass, AsyncPipe, MatIconModule, MatDialogModule, MatProgressSpinnerModule, SolicitudesNavComponent, DateMMDDYYYYPipe, DatePipe, PhonePipe],
  selector: 'app-cargos-voc',
  templateUrl: './cargos-voc.component.html',
  styleUrls: ['./cargos-voc.component.css'],
  providers: [DatePipe]
})
export class CargosVocComponent implements OnInit {

  cargando: boolean = false;
  arrCargos: CargoVoc[] = [];
  cargoVocCabecera: CargoVocCabecera = new CargoVocCabecera;
  usuario: Usuario = new Usuario;
  paginacion: PaginationManager = new PaginationManager();
  seleccion: number[] = [];

  filterInputDate1: string = "";
  filterInputDate2: string = "";
  arrFilterType: string[] = ['All', 'Unpaid', 'Paid'];
  arrFilterTypeF: string[] = ['All', 'Case number', 'Customer', 'Phone', 'Email'];
  filterType: string = "";
  filterTypeF: string = "";
  filterInputText: string = "";
  filterTypeSearch: boolean = false;
  mostrarCheckAll: boolean = false;
  mostrarEncabecadoPagos: boolean = false;
  mostrarEncabecadoNoPagos: boolean = false;
   mostrarEncabecadoBalance: boolean = false;

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    private dialog: MatDialog,
    public utilService: UtilService
  ) {

    var date = new Date();

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    let hoy: Date = new Date(Date.now());
    //let primerDiadelMes: Date = new Date(Date.now());
    let primerDiadelMes: Date = new Date();
    primerDiadelMes.setMonth(date.getMonth() - 8);
    primerDiadelMes.setDate(1);

    this.filterInputDate1 = this.utilService.dateAsYYYYMMDD(primerDiadelMes);
    this.filterInputDate2 = this.utilService.dateAsYYYYMMDD(hoy);
    this.filterType = 'Unpaid';
    this.filterTypeF = 'All';
  }

  ngOnInit(): void {
    this.refrescar();
     console.log('seleccion:', this.seleccion.length);
     
  }

  refrescar() {
    if(this.filterType == 'Unpaid' ) {
      this.mostrarCheckAll = true;
      this.filterTypeSearch = false;
    }else{
      this.mostrarCheckAll = false;
      this.filterTypeSearch = true;
    }

    if(this.filterType == 'All' ) {
      this.mostrarEncabecadoPagos = true;
       this.mostrarEncabecadoNoPagos = true;
       this.mostrarEncabecadoBalance = true;
    }else if(this.filterType == 'Unpaid'){ 
      this.mostrarEncabecadoPagos = false;
      this.mostrarEncabecadoNoPagos = true;
      this.mostrarEncabecadoBalance = false;
    }else if(this.filterType == 'Paid'){ 
      this.mostrarEncabecadoPagos = true;
      this.mostrarEncabecadoNoPagos = false;
      this.mostrarEncabecadoBalance = false;
    }

     if(this.filterType == 'All' ) {
      this.filterTypeSearch = false;
     }
    this.cargando = true;
    this.seleccion = []; // Limpiar selección al refrescar
    this.citaSolicitudService
      .obtenerCargosPendientes(this.filterInputDate1, this.filterInputDate2, this.filterInputText, this.usuario.idUsuario, this.filterTypeF, this.filterInputText, this.filterType)
      .then(cargos => {
        this.cargoVocCabecera = cargos;
        this.arrCargos = cargos.cargoVoc;
        console.log('Cargos obtenidos:', this.arrCargos);
        this.paginacion.setArray(this.arrCargos, 20);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);

     
  }

  limpiarFechas() {
    this.filterInputDate1 = "";
    this.filterInputDate2 = "";
  }

  pagado(cargo: CargoVoc) {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Paid',
        texto: 'Do you really want to mark this charge as paid?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.citaSolicitudService
          .pagado(cargo.idCita, true, this.usuario.idUsuario)
          .then(() => {
            this.refrescar();
          })
          .catch(reason => this.utilService.manejarError(reason));
        // .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  addPayment(cargo: CargoVoc) {
    this.dialog.open(DialogoAddPagoVocComponent, {
      data: {
        cargoVoc: cargo
      },
      disableClose: true,
    }).afterClosed().toPromise().then(result => {
      this.refrescar();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  descargarExcel() {
    this.cargando = true;
    this.citaSolicitudService.obtenerCargosPendientesExcel(this.filterInputDate1, this.filterInputDate2, this.filterInputText, this.usuario.idUsuario, this.filterTypeF, this.filterInputText, this.filterType)
      .subscribe(
        data => {
          const file = new Blob([data], { type: 'application/vnd.ms-excel' });
          var fileUrl = URL.createObjectURL(file);
          let link: any = window.document.createElement('a');
          link.href = fileUrl;
          let aux = fileUrl.split('/');
          link.download = aux[aux.length - 1] + ".xlsx";
          link.click();
          this.cargando = false;
        }
      )
  }

  tieneSeleccion(): boolean {
    return this.seleccion.length > 0;
  }

  estaSeleccionado(id: number) {
    return this.seleccion.find(e => e == id) != null;
  }

  estanTodosSeleccionados() {
    const elementosVisibles = this.arrCargos.slice(this.paginacion.begin, this.paginacion.end);
    return elementosVisibles.length > 0 && elementosVisibles.every(e => this.estaSeleccionado(e.idCita));
  }

  check(event: Event, id: number) {
    console.log('Check llamado para id:', id, 'checked:', (event.target as HTMLInputElement).checked);
    if ((event.target as HTMLInputElement).checked) {
      //add
      if (!this.estaSeleccionado(id)) {
        this.seleccion.push(id);
        console.log('Agregado id:', id, 'Seleccion actual:', this.seleccion);
      }
    } else {
      //remove
      if (this.estaSeleccionado(id)) {
        this.seleccion.splice(this.seleccion.indexOf(id), 1);
        console.log('Removido id:', id, 'Seleccion actual:', this.seleccion);
      }
    }
  }

  checkAll(event: Event) {
    const elementosVisibles = this.arrCargos.slice(this.paginacion.begin, this.paginacion.end);
    
    if ((event.target as HTMLInputElement).checked) {
      // Seleccionar todos los elementos visibles
      elementosVisibles.forEach(u => {
        if (!this.estaSeleccionado(u.idCita)) {
          this.seleccion.push(u.idCita);
        }
      });
    } else {
      // Deseleccionar todos los elementos visibles
      elementosVisibles.forEach(u => {
        const index = this.seleccion.indexOf(u.idCita);
        if (index > -1) {
          this.seleccion.splice(index, 1);
        }
      });
    }
  }


    pagarSeleccionados() {
        this.dialog.open(DialogoSimpleComponent, {
            data: {
                titulo: this.seleccion.length > 1 ? 'Pay ' + this.seleccion.length + ' schedules' : "Pay schedule",
                texto: this.seleccion.length > 1 ? 'Do you really want to pay these ' + this.seleccion.length + ' schedules? Schedules related to them will be payed.' : 'Do you really want to pay the schedule? Schedules related to him will be payed.',
                botones: [
                    { texto: 'Cancel', color: '', valor: '' },
                    { texto: this.seleccion.length > 1 ? 'Pay schedules' : 'Pay schedule', color: 'primary', valor: 'pagar' },
                ]
            },
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'pagar') {
                this.cargando = true;
                let promises = [];
                

                this.seleccion.forEach(id => promises.push(this.citaSolicitudService.pagado(id, true, this.usuario.idUsuario)));
                Promise
                    .all(promises)
                    .then(results => {
                        this.cargando = false;
                        /*let failed = [];
                        results.forEach(r => { if (r.success == false) failed.push(r) });
                        if (failed.length > 0) {
                            this.dialog.open(DialogoSimpleComponent, {
                                data: {
                                    titulo: 'Schedule(s) not paid',
                                    texto: failed.length == 1 ? 'The schedule could not be paid by mass payment, pay it from its individual screen.' :
                                        failed.length + ' schedules could not be paid by mass payment, pay them individually.',
                                    botones: [{ texto: 'Ok', color: 'accent' },]
                                },
                                disableClose: true,
                            });
                        }*/
                        this.refrescar();
                    }).catch(e => {
                        //window.alert("ALGO NO SALIO BIEN");
                        this.utilService.manejarError(e);
                        this.cargando = false;
                    }); 



            }
        }).catch(reason => this.utilService.manejarError(reason));
    }


}
