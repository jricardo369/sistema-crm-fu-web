import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbogadosService } from 'src/app/services/abogados.service';
import { UtilService } from 'src/app/services/util.service';
import { EmailAbogadoService } from 'src/app/services/email-abogado.service';
import { Abogado } from './../../../model/abogado';
import { Permiso } from './../../../model/permiso';
import { Rol } from './../../../model/rol';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../model/usuario';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { EmailAbogado } from 'src/model/email-abogado';

import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true, imports: [RouterModule, FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,],
  selector: 'app-dialogo-abogado',
  templateUrl: './dialogo-abogado.component.html',
  styleUrls: ['./dialogo-abogado.component.css']
})
export class DialogoAbogadoComponent implements OnInit {

  abogadoControl = new FormControl();
  abogados: Abogado[] = [];
  abogadoSeleccionado?: Abogado;

  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  creando: boolean = false;
  titulo: string = 'Lawyer';
  abogado: Abogado = new Abogado();
  roles: Rol[] = [];
  nuevoDesdeSol: boolean = false;
  isAddEmailAbo: boolean = false;

  arrEmailAbogados: EmailAbogado[] = [];
  inputAbogado: EmailAbogado = new EmailAbogado;

  arrEmailAbogadosN: string[] = [];
  inputAbogadoN: string;

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

  constructor(

    private abogadosService: AbogadosService,
    public utilService: UtilService,
    public emailAbogadoService: EmailAbogadoService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoAbogadoComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));

    this.nuevoDesdeSol = data.nuevoDesdeSol;
    this.isAddEmailAbo = data.isAddEmailAbo;
    console.log('nuevoDesdeSol:' + this.nuevoDesdeSol);
    console.log('isAddEmailAbo:' + this.isAddEmailAbo);

    if (this.nuevoDesdeSol) {
      this.titulo = "New Lawyer";
      if (!this.isAddEmailAbo) {
        this.creando = true;
      } else {
        this.titulo = "Add Lawyer mails"
      }
    } else {
      if (data.idAbogado) {
        this.titulo = "Edit Lawyer"
        this.abogado.idAbogado = data.idAbogado;
        this.refrescar();
        this.creando = false;
        this.obtenerEmailsAbogado(data.idAbogado);
      } else {
        this.titulo = "New Lawyer";
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
            ? this.abogadosService.obtenerAbogadosPorNombre(valor)
            : of([])
        )
      )
      .subscribe((res) => (this.abogados = res));

  }

  onOptionSelected(event: any): void {
    this.abogadoSeleccionado = event.option.value;
    console.log('Abogado seleccionado:', this.abogadoSeleccionado);
    this.isAddEmailAbo = false;
    this.abogado = this.abogadoSeleccionado;
    this.obtenerEmailsAbogado(this.abogado.idAbogado);
  }

  addMailAbogadoN() {
    if (!/^\S+@\S+\.\S+$/.test(this.inputAbogadoN)) {
      this.utilService.manejarError('Invalid email');
    } else {
      const existe = this.arrEmailAbogadosN.includes(this.inputAbogadoN);
      if (existe) {
        this.utilService.manejarError('Previously added email')
      } else {
        this.arrEmailAbogadosN.push(this.inputAbogadoN);
      }
    }
  }

  removeMailAbogadoN(email: string) {
    this.arrEmailAbogadosN = this.arrEmailAbogadosN.filter(e => e !== email);
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
      if (this.arrEmailAbogadosN.length === 0 && !errores) {
        errores = true;
        this.utilService.manejarError('You must add at least one email');

      }
    }
    return errores;
  }

  crear() {

    var errores = this.validarAlCrearoEditar(true);

    if (!errores) {
      this.cargando = true;
      this.abogadosService
        .insertarAbogado(this.abogado, this.arrEmailAbogadosN, this.usuario.idUsuario)
        .then(abogado => {
          this.cerrar('creado');
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);
    }
  }

  editar() {
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

    this.cargando = true;

    if (!/^\S+@\S+\.\S+$/.test(this.inputAbogado.email)) {
      this.cargando = false;
      this.utilService.manejarError('Invalid email');
    } else {
      this.emailAbogadoService.insertarEmailAbogado(this.abogado.idAbogado, this.inputAbogado.email, this.usuario.idUsuario)
        .then(() => {
          this.obtenerEmailsAbogado(this.abogado.idAbogado);
          this.inputAbogado.email = '';
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

}
