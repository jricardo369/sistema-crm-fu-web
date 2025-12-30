import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { PaginationManager } from 'src/util/pagination';
import { Usuario } from 'src/model/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-asignar-terapeuta',
  templateUrl: './dialogo-asignar-terapeuta.component.html',
  styleUrls: ['./dialogo-asignar-terapeuta.component.css']
})
export class DialogoAsignarTerapeutaComponent implements OnInit {

  cargando: boolean = false;

  arrTerapeutas: Usuario[] = [];
  paginacion: PaginationManager = new PaginationManager();
  idUsuarioSelected: number = null;
  idSolicitud: number = null;
  idUsuarioEntrada: number = null;

  constructor(
    private usuariosService: UsuariosService,
    private solicitudesVocService: SolicitudesVocService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoAsignarTerapeutaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.idSolicitud = data.idSolicitud;
      this.idUsuarioEntrada = data.idUsuario;
      this.idUsuarioSelected = data.terapeuta;

      this.paginacion.size = 5;
      this.obtenerUsuarios();
  }

  ngOnInit(): void {
  }

  estaSeleccionado(idUsuario: number) {
    return this.idUsuarioSelected == idUsuario;
  }

  check(event: Event, idUsuario: number) {
    if ((event.srcElement as HTMLInputElement).checked) {
      if (!this.estaSeleccionado(idUsuario)) this.idUsuarioSelected = idUsuario;
    } else {
      if (this.estaSeleccionado(idUsuario)) this.idUsuarioSelected = null;
    }
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.usuariosService.obtenerUsuariosPorRol(10)
      .then(usuarios => {
        this.arrTerapeutas = usuarios;
        this.paginacion.setArray(this.arrTerapeutas,10);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  asignar() {
    this.cargando = true;
    this.solicitudesVocService.asignarTerapeuta(this.idSolicitud, this.idUsuarioSelected, this.idUsuarioEntrada)
    .then(() => {
      this.cargando = false;
      this.cerrar('asignado');
    })
    .catch((reason) => this.utilService.manejarError(reason))
    .then(() => (this.cargando = false));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
