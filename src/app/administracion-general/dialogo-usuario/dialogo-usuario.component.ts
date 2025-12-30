import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from './../../../model/usuario';
import { Permiso } from './../../../model/permiso';
import { Rol } from './../../../model/rol';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-usuario',
  templateUrl: './dialogo-usuario.component.html',
  styleUrls: ['./dialogo-usuario.component.css']
})
export class DialogoUsuarioComponent implements OnInit {

  cargando: boolean = false;
  creando: boolean = false;
  titulo: string = 'Usuario';
  usuario: Usuario = new Usuario();
  permisos: Permiso[] = [];
  roles: Rol[] = [];

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

    private usuariosService: UsuariosService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.permisos.push({ id: 1, nombre: "Send Notifications" });
    this.permisos.push({ id: 2, nombre: "Add Events" });
    this.permisos.push({ id: 3, nombre: "Add Payments" });
    this.permisos.push({ id: 4, nombre: "Edit requests" });

    if (data.idUsuario) {
      this.titulo = "Edit User"
      this.usuario.idUsuario = data.idUsuario;
      this.refrescar();
      this.creando = false;
    } else {
      this.titulo = "New User";
      this.creando = true;
      this.usuario.permisos = [];
    }

   
  }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  estaSeleccionado(permiso: Permiso) {
    return this.usuario.permisos.find(p => p.id == permiso.id) != null;
  }

  checkAllPermisos(permisosUsuario: Permiso[]) {
    permisosUsuario.forEach(permiso => (<HTMLInputElement>document.getElementById(permiso.id.toString())).checked = true);
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
    this.usuario.estatus = "1";
    this.usuario.ausencia = false;
    console.log(this.usuario)
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
    
    if(this.usuario.withSupervision){
      if(this.usuario.supervisor == null || this.usuario.supervisor == ''){
          this.utilService.mostrarDialogoSimple("Error", "You must enter the supervisor"); 
          return; // Salir de la función si no hay supervisor
      }
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

}
