import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { EstadoUsuarioService } from 'src/app/services/estado-usuario.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from './../../../model/usuario';
import { Permiso } from './../../../model/permiso';
import { Rol } from './../../../model/rol';
import { EstadoUsuario } from './../../../model/estado-usuario';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {  US_STATES, VOC } from 'src/app/app.config';
import { formatearFecha } from '../../util/date-utils';
import { convertirAFechaMat } from '../../util/date-utils';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule],
  selector: 'app-dialogo-usuario',
  templateUrl: './dialogo-usuario.component.html',
  styleUrls: ['./dialogo-usuario.component.css']
})
export class DialogoUsuarioComponent implements OnInit {

  arrStates: any[] = [];
  stateSelected: string = '';
  licencia: string = '';

  cargando: boolean = false;
  creando: boolean = false;
  titulo: string = 'Usuario';
  usuario: Usuario = new Usuario();
  usuarioLogeado: Usuario = new Usuario();
  permisos: Permiso[] = [];
  permisosSeleccionados: { [key: number]: boolean } = {};
  roles: Rol[] = [];
  estadosUsuario: EstadoUsuario[] = [];
  fechaValidityMat: Date;
  filterUsuario: number = 0;
  arrFilterUsuarios: Usuario[] = [];

  public file: File[] = [];

  arrAnios: number[] = [];
  arrMeses: number[] = [];

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

    private usuariosService: UsuariosService,
    private reportesService: ReportesService,
    private estadoUsuarioService: EstadoUsuarioService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.usuarioLogeado = JSON.parse(localStorage.getItem('objUsuario'));

    this.isVOC = this.usuarioLogeado.rol == VOC;

    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= 2020; i--) {
      this.arrAnios.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      this.arrMeses.push(i);
    }

    this.arrStates = US_STATES;

    this.permisos.push({ id: 1, nombre: "Send Notifications" });
    this.permisos.push({ id: 2, nombre: "Add Events" });
    this.permisos.push({ id: 3, nombre: "Add Payments" });
    this.permisos.push({ id: 4, nombre: "Edit requests" });
    this.permisos.push({ id: 5, nombre: "Permission 5" });

    this.permisos.forEach(permiso => this.permisosSeleccionados[permiso.id] = false);

     this.obtenerUsuariosSupervisores();
   

    if (data.idUsuario) {
      this.titulo = "Edit User"
      this.usuario.idUsuario = data.idUsuario;
      this.refrescar();
      this.creando = false;
    } else {
      this.titulo = "New User";
      this.creando = true;
      this.usuario.permisos = [];
      this.checkAllPermisos([]);
    }

     if(!this.creando) {
          this.obtenerEstadosUsuario();
          // Esperar 2 segundos antes de asignar fechaNacimientoMat
                  setTimeout(() => {
          
                    if (this.usuario.licenciaValida) {
                       this.fechaValidityMat = convertirAFechaMat(this.usuario.licenciaValida as string);  
                    }
          
          
                  }, 2000);
     }  

   
  }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  changeFechaValidityMat() {
      console.log('fechaNacimientoMat changed:', this.fechaValidityMat);
  
      if (this.fechaValidityMat) {
        this.usuario.licenciaValida = formatearFecha(this.fechaValidityMat);
        console.log('Fecha formateada (string):', this.usuario.licenciaValida);
      }
  
      
    }

  estaSeleccionado(permiso: Permiso) {
    return this.usuario.permisos.find(p => p.id == permiso.id) != null;
  }

  checkAllPermisos(permisosUsuario: Permiso[]) {
    const permisosIds = new Set((permisosUsuario || []).map(permiso => permiso.id));
    this.permisos.forEach(permiso => {
      this.permisosSeleccionados[permiso.id] = permisosIds.has(permiso.id);
    });
    this.usuario.permisos = this.obtenerPermisosSeleccionados();
  }

  obtenerPermisosSeleccionados(): Permiso[] {
    return this.permisos
      .filter(permiso => this.permisosSeleccionados[permiso.id])
      .map(permiso => ({ id: permiso.id, nombre: permiso.nombre }));
  }

  check(event: Event, permiso: Permiso) {
    if ((event.srcElement as HTMLInputElement).checked) {
      //add
      if (!this.estaSeleccionado(permiso)) this.usuario.permisos.push(permiso);
    } else {
      //remove
      if (this.estaSeleccionado(permiso)) this.usuario.permisos.splice(this.usuario.permisos.indexOf(permiso), 1);
    }
  }

  rolSelected() {
    //this.usuario.rol = this.usuario.rol == "5" ? this.usuario.rol : null;
  }

  getEstatusTexto(estatus: string): string {
  switch (estatus) {
    case '1':
      return 'Active';
    case '2':
      return 'Inactive';
    case '3':
      return 'Blocking by attempts';
    default:
      return 'Unknown';
  }
}

  refrescar() {
    this.cargando = true;
    this.usuariosService
      .obtenerUsuarioPorId(this.usuario.idUsuario)
      .then(usuario => {
        this.usuario = usuario;
        this.checkAllPermisos(this.usuario.permisos);
        this.filterUsuario = this.usuario.supervisor ? parseInt(this.usuario.supervisor) : 0;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  desbloquear() {
    this.cargando = true;
    this.usuariosService
      .desbloquearUsuario(this.usuario.idUsuario)
      .then(usuario => {
        this.cerrar('editando');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  crear() {
    this.usuario.permisos = this.obtenerPermisosSeleccionados();
    this.usuario.estatus = "1";
    this.usuario.ausencia = false;
    console.log(this.usuario)
   

    if(this.usuario.withSupervision){
      
      console.log('supervisor:'+this.filterUsuario);
      if(this.filterUsuario == 0){
          this.utilService.mostrarDialogoSimple("Error", "You must enter the supervisor"); 
          return; // Salir de la función si no hay supervisor
      }
      this.usuario.supervisor = this.filterUsuario.toString();

    }

     this.cargando = true;
    this.usuariosService
      .insertarUsuario(this.usuario)
      .then(usuario => {
        this.cerrar('creado');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  editar() {
    this.usuario.permisos = this.obtenerPermisosSeleccionados();
    
    if(this.usuario.withSupervision){
      
      console.log('supervisor:'+this.filterUsuario);
      if(this.filterUsuario == 0){
          this.utilService.mostrarDialogoSimple("Error", "You must enter the supervisor"); 
          return; // Salir de la función si no hay supervisor
      }
      this.usuario.supervisor = this.filterUsuario.toString();

    }

    this.cargando = true;
    this.usuariosService
      .editarUsuario(this.usuario)
      .then(usuario => {
        this.cerrar('editando');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  descargarReporte() {
    let campos = [];
    campos.push({
      label: "Year",
      type: "select",
      value: new Date().getFullYear(),
      options: this.arrAnios.map(a => ({ display: a, value: a }))
    });
    campos.push({
      label: "Month",
      type: "select",
      value: new Date().getMonth() + 1,
      options: this.arrMeses.map(m => ({ display: m, value: m }))
    });

    this.utilService.mostrarDialogoConFormulario(
      "Download hours report",
      "Select the year and month for the report",
      "Download",
      "Cancel",
      campos
    ).then(valor => {
      if (valor == 'ok') {
        const anio = campos[0].value;
        const mes = campos[1].value;
        this.cargando = true;
        this.reportesService.obtenerHorasMesTerapeutaPdf(this.usuario.idUsuario, anio, mes)
          .then(response => {
            this.utilService.saveByteArray("horas-mes-terapeuta-" + this.usuario.idUsuario + "-" + anio + "-" + mes, response, 'pdf');
          })
          .catch(reason => this.utilService.manejarError(reason))
          .finally(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  eliminar() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete user',
        texto: 'Do you really want to delete the user? This action is not reversible.',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Delete user', color: 'primary', valor: 'eliminar' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'eliminar') {
        this.cargando = true;
        this.usuariosService
          .eliminarUsuario(this.usuario.idUsuario)
          .then(usuario => {
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

  cargarAdjunto() {
    let promises = [];
    
  }

  quitarAdjunto(archivo: File) {
    let start = this.file.findIndex(f => f == archivo);
    this.file.splice(start, 1);
  }

  obtenerRoles() {
    this.cargando = true;
    this.usuariosService
     .obtenerRoles()
      .then(roles => {
        this.roles = roles;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  obtenerEstadosUsuario() {
    this.cargando = true;
    this.estadoUsuarioService
      .obtenerEstadosUsuarios(this.usuario.idUsuario)
      .then(estadosUsuario => {
        this.estadosUsuario = estadosUsuario;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

   agregarEstadoUsuario() {
    console.log(this.usuario)
    this.cargando = true;
    this.estadoUsuarioService
      .insertarEstadoUsuario(this.stateSelected, this.usuario.idUsuario,0,this.licencia)
      .then(estadoUsuario => {
       
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  eliminarEstadoUsuario(idEstadoUsuario: number) {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete state for user',
        texto: 'Do you really want to delete the state for the user? This action is not reversible.',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Delete state', color: 'primary', valor: 'eliminar' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'eliminar') {
        this.cargando = true;
        this.estadoUsuarioService
          .eliminarEstadoUSuario(idEstadoUsuario)
          .then(usuario => {
            this.obtenerEstadosUsuario();
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  obtenerUsuariosSupervisores() {
    this.cargando = true;
    this.usuariosService
      .obtenerUsuariosSupervisores(this.usuarioLogeado.idUsuario)
      .then(usuarios => {
        this.arrFilterUsuarios = usuarios;
        //console.log(this.arrFilterUsuarios)
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

}
