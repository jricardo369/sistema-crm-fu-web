import { Usuario } from 'src/model/usuario';
import { DisponibilidadUsuario } from 'src/model/disponibilidad-usuario';
import { Component, Inject, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-disponibilidad-usuario',
  templateUrl: './dialogo-disponibilidad-usuario.component.html',
  styleUrls: ['./dialogo-disponibilidad-usuario.component.css']
})
export class DialogoDisponibilidadUsuarioComponent implements OnInit {

  cargando: boolean = false;
  disponibilidadUsuario: DisponibilidadUsuario = new DisponibilidadUsuario;
  usuario: Usuario = new Usuario;

  arrTime: string[] = [
    '12:00',
    '12:30',
    '1:00',
    '1:30',
    '2:00',
    '2:30',
    '3:00',
    '3:30',
    '4:00',
    '4:30',
    '5:00',
    '5:30',
    '6:00',
    '6:30',
    '7:00',
    '7:30',
    '8:00',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30'
];

  constructor(
    private disponibilidadUsuariosService: DisponibilidadUsuariosService,
    public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoDisponibilidadUsuarioComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
	}

  ngOnInit(): void {
  }

  agregar() {
    this.disponibilidadUsuario.idUsuario = this.usuario.idUsuario;
    this.disponibilidadUsuario.nombreUsuario = this.usuario.nombre;
		this.cargando = true;
		this.disponibilidadUsuariosService.agregarDisponibilidadUsuario(this.disponibilidadUsuario)
			.then(() => {
				this.cerrar('agregada');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);
	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
