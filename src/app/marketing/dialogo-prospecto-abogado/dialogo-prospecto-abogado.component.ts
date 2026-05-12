import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { ProspectoAbogadoNoteService } from 'src/app/services/prospecto-abogado-note.service';
import { NotaProspectoAbogado } from 'src/model/nota-prospecto-abogado';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  selector: 'app-dialogo-prospecto-abogado',
  templateUrl: './dialogo-prospecto-abogado.component.html',
  styleUrls: ['./dialogo-prospecto-abogado.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogoProspectoAbogadoComponent implements OnInit {

  cargando: boolean = false;
  public notaProspectoAbogado: NotaProspectoAbogado = new NotaProspectoAbogado();
  usuario: Usuario = new Usuario();
  rol: string;  

  constructor(
    private prospectoAbogadoNoteService: ProspectoAbogadoNoteService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoProspectoAbogadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    this.notaProspectoAbogado.idProspectoAbogado = data.idProspectoAbogado;
    this.notaProspectoAbogado.idUsuario = this.usuario.idUsuario;

  }

  ngOnInit(): void {}

  typeSelected() {}

  crear() {
    this.cargando = true;
    this.prospectoAbogadoNoteService
      .insertarProspectoAbogadoNota(this.notaProspectoAbogado)
      .then(() => {
        this.cerrar('creado');
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  cerrar(accion: string = '') {
    this.dialogRef.close(accion);
  }

}
