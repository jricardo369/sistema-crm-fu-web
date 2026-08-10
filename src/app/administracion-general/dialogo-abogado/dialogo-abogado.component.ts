import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbogadosService } from 'src/app/services/abogados.service';
import { ProspectosAbogadoService } from 'src/app/services/prospectos-abogado.service';
import { UtilService } from 'src/app/services/util.service';
import { EmailAbogadoService } from 'src/app/services/email-abogado.service';
import { EmailProspectoAbogadoService } from 'src/app/services/email-prospecto-abogado.service';
import { Abogado } from './../../../model/abogado';
import { TittleAbogado } from './../../../model/tittle-abogado';
import { ReferralSource } from './../../../model/referral-source';
import { Rol } from './../../../model/rol';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../model/usuario';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { EmailAbogado } from 'src/model/email-abogado';
import { US_STATES } from 'src/app/app.config';

import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProspectoAbogado } from 'src/model/prospecto-abogado';
import { EmailProspectoAbogado } from 'src/model/email-prospecto-abogado';
import { waitForAsync } from '@angular/core/testing';

@Component({
  standalone: true, imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatAutocompleteModule],
  selector: 'app-dialogo-abogado',
  templateUrl: './dialogo-abogado.component.html',
  styleUrls: ['./dialogo-abogado.component.css']
})
export class DialogoAbogadoComponent implements OnInit {

  arrStates: any[] = [];

  idSolicitud: number = 0;
  abogadoControl = new FormControl();
  abogados: Abogado[] = [];
  abogadoSeleccionado?: Abogado;

  prospectoAbogadoControl = new FormControl();
  prospectosAbogados: ProspectoAbogado[] = [];
  prospectoAbogadoSeleccionado?: ProspectoAbogado;
  seSeleccionoProspecto: boolean = false;

  emailAbogadoNuevo: EmailAbogado = new EmailAbogado;
  arrEmailAbogadosNuevo: EmailAbogado[] = [];

  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  creando: boolean = false;
  titulo: string = 'Lawyer';
  abogado: Abogado = new Abogado();
  prospectosAbogado: ProspectoAbogado = new ProspectoAbogado();
  roles: Rol[] = [];
  nuevoDesdeSol: boolean = false;
  isAddEmailAbo: boolean = false;
  mostrarInputProspectoAbo: boolean = false;

  arrEmailAbogados: EmailAbogado[] = [];
  arrEmailProspectoAbogados: EmailProspectoAbogado[] = [];
  inputAbogado: EmailAbogado = new EmailAbogado;

  public file: File[] = [];

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


  public arrTittlesAbogados: TittleAbogado[] = [];
 public inputTittleAbogado: TittleAbogado = new TittleAbogado;

 public arrReferralSource: ReferralSource[] = [];
 public inputReferralSource: ReferralSource = new ReferralSource;
  

  constructor(

    private abogadosService: AbogadosService,
    private prospectosAbogadosService: ProspectosAbogadoService,
    public utilService: UtilService,
    public emailAbogadoService: EmailAbogadoService,
    public emailProspectoAbogadoService: EmailProspectoAbogadoService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoAbogadoComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.arrStates = US_STATES;

    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));

    this.nuevoDesdeSol = data.nuevoDesdeSol;
    this.isAddEmailAbo = data.isAddEmailAbo;
    console.log('nuevoDesdeSol:' + this.nuevoDesdeSol);
    console.log('isAddEmailAbo:' + this.isAddEmailAbo);

     this.obtenerTittlesAbogado();
     this.obtenerReferralsSource();

    if (this.nuevoDesdeSol) {
      this.titulo = "New Lawyer";
      if (!this.isAddEmailAbo) {
        this.titulo = "Find a lawyer by email";
        this.creando = true;
        this.mostrarInputProspectoAbo = true;
      } else {
        this.titulo = "Add Lawyer mails"
      }
      this.idSolicitud = data.idSolicitud;
      //console.log('idSolicitud:' + this.idSolicitud);
    } else {
      if (data.idAbogado) {

        this.titulo = "Edit Lawyer"
        this.abogado.idAbogado = data.idAbogado;
        this.refrescar();
        this.creando = false;
        
        this.obtenerEmailsAbogado(data.idAbogado);
        
      } else {
        if (this.isAddEmailAbo) {
          this.titulo = "Find a lawyer by email";
        }else{
          this.titulo = "New Lawyer";
        }
        this.creando = true;
      }
    }

  }

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

      this.prospectoAbogadoControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor) =>
          typeof valor === 'string' && valor.length > 1
            ? this.prospectosAbogadosService.obtenerProspectosAbogadosPorMail(valor)
            : of([])
        )
      )
      .subscribe((res) => (this.prospectosAbogados = res));

      

      this.inputTittleAbogado = this.arrTittlesAbogados[this.arrTittlesAbogados.findIndex(tittle => tittle.descripcion == this.emailAbogadoNuevo.tipo)];
      this.inputReferralSource = this.arrReferralSource[this.arrReferralSource.findIndex(r => r.descripcion == this.abogado.referencia)];
       

  }

  onOptionSelected(event: any): void {
    this.abogadoSeleccionado = event.option.value;
    console.log('Abogado seleccionado:', this.abogadoSeleccionado);
    this.isAddEmailAbo = false;
    this.creando = false;
    this.abogado = this.abogadoSeleccionado;
    this.obtenerEmailsAbogado(this.abogado.idAbogado);
  }

  onOptionProspectoSelected(event: any): void {
    this.prospectoAbogadoSeleccionado = event.option.value;
    this.seSeleccionoProspecto = true;
    console.log('Prospecto Abogado seleccionado:', this.prospectoAbogadoSeleccionado);
    this.abogado.firma = this.prospectoAbogadoSeleccionado.firma;
    this.abogado.nombre = this.prospectoAbogadoSeleccionado.nombre;
    this.abogado.telefono = this.prospectoAbogadoSeleccionado.telefono;
    this.abogado.estado = this.prospectoAbogadoSeleccionado.estado;
    //this.abogado.direccion = this.prospectoAbogadoSeleccionado.direccion;

    this.seSeleccionoProspecto = true;
    this.obtenerEmailsProspectoAbogado(this.prospectoAbogadoSeleccionado.idProspectoAbogado);
  }


  addMailAbogadoNuevo() {

    this.emailAbogadoNuevo.tipo = this.inputTittleAbogado.descripcion;

    console.log('emailAbogadoNuevo:', this.emailAbogadoNuevo);
    if (!/^\S+@\S+\.\S+$/.test(this.emailAbogadoNuevo.email)) {
      this.utilService.manejarError('Invalid email');
    } else {
      
      if(this.arrEmailAbogadosNuevo.some(e => e.email === this.emailAbogadoNuevo.email)){
        this.utilService.manejarError('Previously added email')
      } else {

        const nuevoEmail = { ...this.emailAbogadoNuevo }; // copia
        this.arrEmailAbogadosNuevo.push(nuevoEmail);
        this.emailAbogadoNuevo.email = '';
        this.emailAbogadoNuevo.nombre = '';
        this.emailAbogadoNuevo.tipo = '';

      }

    }
  }

  removeMailAbogadoNuevo(emAbo: EmailAbogado) {
  this.arrEmailAbogadosNuevo = this.arrEmailAbogadosNuevo.filter(e => e !== emAbo);
}

  rolSelected() {
    //this.usuario.rol = this.usuario.rol == "5" ? this.usuario.rol : null;
  }

  refrescar() {
    this.cargando = true;
    this.abogadosService
      .obtenerUsuarioPorId(this.abogado.idAbogado)
      .then(abogado => {
        this.abogado = abogado;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  obtenerEmailsAbogado(idAbogado: number) {
    this.cargando = true;
    this.emailAbogadoService
      .obtenerEmailsDeAbogado(idAbogado).subscribe({
        next: (emailsAbo) => {
          this.arrEmailAbogados = emailsAbo;
          this.cargando = false;
        },
        error: (reason) => {
          this.utilService.manejarError(reason);
          this.cargando = false;
        }
      });
  }

  

  obtenerEmailsProspectoAbogado(idAbogado: number) {
    this.cargando = true;
    this.emailProspectoAbogadoService.obtenerEmailsDeAbogado(idAbogado).subscribe({
        next: (emailsAbo) => {
          this.arrEmailProspectoAbogados = emailsAbo;
          
          this.arrEmailAbogadosNuevo = emailsAbo.map(e => { const em = new EmailAbogado(); em.email = e.email; return em; });
          this.cargando = false;
        },
        error: (reason) => {
          this.utilService.manejarError(reason);
          this.cargando = false;
        }
      });
  }

  validarAlCrearoEditar(crear: boolean) {

    //console.log("arr:" + this.arrEmailAbogadosN.length);
    //console.log("nombre:" + this.abogado.nombre);

    var errores = false;

    if (this.abogado.nombre == undefined && !errores) {
      errores = true;
      this.utilService.manejarError('Name is mandatory');
    }
    if (this.abogado.nombre == '' && !errores) {
      errores = true;
      this.utilService.manejarError('Name is mandatory');
    }

    if (crear) {
      if (this.arrEmailAbogadosNuevo.length === 0 && !errores) {
        errores = true;
        this.utilService.manejarError('You must add at least one email');

      }
    }
    return errores;
  }

  crear() {

    var errores = this.validarAlCrearoEditar(true);

    this.abogado.referencia = this.inputReferralSource.descripcion;
    this.abogado.emailsAbogado = this.arrEmailAbogadosNuevo;

    if (!errores) {

      if (this.seSeleccionoProspecto) {

        this.dialog.open(DialogoSimpleComponent, {
            data: {
              titulo: 'Create a lawyer from a prospectus ',
              texto: 'Do you really want to create the lawyer based on the selected prospect?',
              botones: [
                { texto: 'Cancel', color: '', valor: '' },
                { texto: 'Yes', color: 'primary', valor: 'ok' },
              ]
            },
            disableClose: true,
          }).afterClosed().toPromise().then(valor => {
            if (valor == 'ok') {

              this.cargando = true;
              this.abogadosService
              .insertarAbogado(this.abogado, this.usuario.idUsuario,this.prospectoAbogadoSeleccionado.idProspectoAbogado,this.idSolicitud)
              .then(abogado => {
                this.cerrar('creado');
              })
              .catch(reason => this.utilService.manejarError(reason))
              .then(() => this.cargando = false);
              
            }
          }).catch(reason => this.utilService.manejarError(reason));

      } else {

        this.cargando = true;
        this.abogadosService
          .insertarAbogado(this.abogado, this.usuario.idUsuario,0,0)
          .then(abogado => {
            this.cerrar('creado');
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }

  }

  editar() {
     this.abogado.referencia = this.inputReferralSource.descripcion;
    var errores = this.validarAlCrearoEditar(false);
    if (!errores) {
      this.cargando = true;
      this.abogadosService
        .editarAbogado(this.abogado)
        .then(abogado => {
          this.cerrar('editando');
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);
    }
  }

  removeEmailAbo(idEmailAbo: number) {
    this.cargando = true;
    this.emailAbogadoService
      .eliminarEmailAbogado(idEmailAbo)
      .then(abogado => {
        this.obtenerEmailsAbogado(this.abogado.idAbogado);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  addEmailAbo() {

     this.emailAbogadoNuevo.tipo = this.inputTittleAbogado.descripcion;

    this.cargando = true;

    if (!/^\S+@\S+\.\S+$/.test(this.emailAbogadoNuevo.email)) {
      this.cargando = false;
      this.utilService.manejarError('Invalid email');
    } else {
      this.emailAbogadoService.insertarEmailAbogado(this.abogado.idAbogado, this.emailAbogadoNuevo.email, this.emailAbogadoNuevo.nombre, this.emailAbogadoNuevo.tipo, this.usuario.idUsuario)
        .then(() => {
          this.obtenerEmailsAbogado(this.abogado.idAbogado);
          this.emailAbogadoNuevo.email = '';
          this.emailAbogadoNuevo.nombre = '';
          this.emailAbogadoNuevo.tipo = '';
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
    }

  }

  eliminar() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete lawyer',
        texto: 'Do you really want to delete the lawyer? This action is not reversible.',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Delete lawyer', color: 'primary', valor: 'eliminar' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'eliminar') {
        this.cargando = true;
        this.abogadosService
          .eliminarAbogado(this.abogado.idAbogado)
          .then(abogado => {
            this.cerrar('editando');
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

  onFileSelected(files: FileList) {
    // this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
    for (let i = 0; i < files.length; i++) {
      this.file.push(files.item(i));
    }
  }

  quitarAdjunto(archivo: File) {
    let start = this.file.findIndex(f => f == archivo);
    this.file.splice(start, 1);
  }

  obtenerTittlesAbogado() {
  this.cargando = true;
  this.emailAbogadoService
    .obtenerTittlesAbogado()
    .subscribe({
      next: (tittlesAbogados) => {
        this.arrTittlesAbogados = tittlesAbogados;
        this.inputTittleAbogado = this.arrTittlesAbogados[0];
        this.cargando = false;
      },
      error: (reason) => {
        this.utilService.manejarError(reason);
        this.cargando = false;
      }
    });
}

obtenerReferralsSource() {
  this.cargando = true;
  this.abogadosService
    .obtenerReferralSource()
    .subscribe({
      next: (referraResources) => {
        this.arrReferralSource = referraResources;
        this.inputReferralSource = this.arrReferralSource[0];
        this.cargando = false;
      },
      error: (reason) => {
        this.utilService.manejarError(reason);
        this.cargando = false;
      }
    });
}

noEsProspecto() {
  this.seSeleccionoProspecto = false;
  this.prospectoAbogadoSeleccionado = null;
  this.prospectoAbogadoControl.setValue('');
  this.abogado.firma = '';
  this.abogado.nombre = '';
  this.abogado.telefono = '';
  this.abogado.estado = '';
  this.arrEmailAbogadosNuevo = [];
}

}
