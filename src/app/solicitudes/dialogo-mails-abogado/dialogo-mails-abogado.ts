import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportesService } from './../../services/reportes.service';
import { EmailAbogadoService } from 'src/app/services/email-abogado.service';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PaginationManager } from 'src/util/pagination';
import { ReporteSolicitudesUsuario } from 'src/model/reporte-solicitudes-usuario';
import { Usuario } from '../../../model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { EmailAbogado } from 'src/model/email-abogado';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-mails-abogado',
  imports: [RouterModule, FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, DateMMDDYYYYPipe],
  templateUrl: './dialogo-mails-abogado.html',
  styleUrl: './dialogo-mails-abogado.css'
})
export class DialogoMailsAbogado implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  size: number;
  arrEmailAbogados: EmailAbogado[] = [];
  emailsSeleccionados: string = "";

  lawyerName: string = "";
  idLawyer: number;
  idSolicitud: number;

  arrReporteSolicitudesUsuario: ReporteSolicitudesUsuario[] = [];
  paginacion: PaginationManager = new PaginationManager();

  constructor(private reportesService: ReportesService,
    public utilService: UtilService,
    public emailAbogadoService: EmailAbogadoService,
    public usuariosService: UsuariosService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoMailsAbogado>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.lawyerName = data.lawyerName;
    this.idLawyer = data.idLawyer;
    this.emailsSeleccionados = data.emails;
    this.idSolicitud = data.idSolicitud;
    console.log("idLawyer: ", this.idLawyer);
    this.obtenerMailsAbogado(this.idLawyer);
    this.paginacion.size =10;
  }

  ngOnInit(): void {
    console.log('arrEmailAbogados:', this.arrEmailAbogados);
  console.log('arrEmailAbogados.length:', this.arrEmailAbogados.length);
  console.log('paginacion:', this.paginacion);
  console.log('paginacion.begin:', this.paginacion.begin);
  console.log('paginacion.end:', this.paginacion.end);

   this.paginacion.setArray(this.arrEmailAbogados, 10); // o el tamaño que uses
  this.paginacion.fix();

  }

  obtenerMailsAbogado(idAbogado: number) {

    this.cargando = true;
    this.emailAbogadoService
      .obtenerEmailsDeAbogado(idAbogado).subscribe({
        next: (emailsAbo) => {
          console.log("emailsAbo: ", emailsAbo);
          this.arrEmailAbogados = emailsAbo;
          this.cargando = false;
          this.paginacion.setArray(this.arrEmailAbogados,10);
        },
        error: (reason) => {
          this.utilService.manejarError(reason);
          this.cargando = false;
        }
      });
  }

  actualizarEmailsAbo() {

    this.cargando = true;
    this.emailAbogadoService
      .actualizarEmailsAbo(this.idSolicitud, this.emailsSeleccionados)
      .then(() => {
            this.cargando = false;
            this.cerrar("update");
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

  // Función para verificar si un email está seleccionado
  isEmailSelected(email: string): boolean {
    if (!this.emailsSeleccionados || !email) {
      return false;
    }
    const emailsArray = this.emailsSeleccionados.split(',').map(e => e.trim().toLowerCase());
    return emailsArray.includes(email.toLowerCase());
  }

  // Función para manejar checkbox individual
  check(event: any, email: string) {
    const isChecked = event.target.checked;
    const emailsArray = this.emailsSeleccionados ? this.emailsSeleccionados.split(',').map(e => e.trim()) : [];
    
    if (isChecked) {
      if (!emailsArray.includes(email)) {
        emailsArray.push(email);
      }
    } else {
      const index = emailsArray.indexOf(email);
      if (index > -1) {
        emailsArray.splice(index, 1);
      }
    }
    
    this.emailsSeleccionados = emailsArray.join(',');
  }

  // Función para verificar si todos están seleccionados
  estanTodosSeleccionados(): boolean {
    if (!this.arrEmailAbogados || this.arrEmailAbogados.length === 0) {
      return false;
    }
    return this.arrEmailAbogados.every(e => this.isEmailSelected(e.email));
  }

  // Función para seleccionar/deseleccionar todos
  checkAll(event: any) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      const todosLosEmails = this.arrEmailAbogados.map(e => e.email);
      const emailsActuales = this.emailsSeleccionados ? this.emailsSeleccionados.split(',').map(e => e.trim()) : [];
      
      todosLosEmails.forEach(email => {
        if (!emailsActuales.includes(email)) {
          emailsActuales.push(email);
        }
      });
      
      this.emailsSeleccionados = emailsActuales.join(',');
    } else {
      const emailsVisibles = this.arrEmailAbogados.map(e => e.email);
      const emailsActuales = this.emailsSeleccionados ? this.emailsSeleccionados.split(',').map(e => e.trim()) : [];
      const emailsFiltrados = emailsActuales.filter(email => !emailsVisibles.includes(email));
      this.emailsSeleccionados = emailsFiltrados.join(',');
    }
  }

}
