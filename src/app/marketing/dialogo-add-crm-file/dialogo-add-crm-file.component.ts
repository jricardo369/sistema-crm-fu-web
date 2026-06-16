import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';
import { MotivoCancelService } from 'src/app/services/motivo-cancel.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { Usuario } from 'src/model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ProspectoAbogado } from 'src/model/prospecto-abogado';
import { ProspectosAbogadoService } from 'src/app/services/prospectos-abogado.service';
import { formatearFecha } from '../../util/date-utils';
import { convertirAFechaMat } from '../../util/date-utils';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  selector: 'app-dialogo-add-crm-file',
  templateUrl: './dialogo-add-crm-file.component.html',
  styleUrls: ['./dialogo-add-crm-file.component.css']
})
export class DialogoAddCrmFileComponent implements OnInit {

  prospecto: ProspectoAbogado | null = null;
  titulo: string = '';
  subtitulo: string = '';
  crmFile: string = '';

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  filterUsuario: number = 0;
  arrFilterUsuarios: Usuario[] = [];

  fecha: string = '';
  fechaMat: Date | null = null;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    public utilService: UtilService,
    private prospectosAbogadoService: ProspectosAbogadoService,
    public dialogRef: MatDialogRef<DialogoAddCrmFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.prospecto = data.prospecto;
    this.titulo = data.titulo;
    this.subtitulo = data.subtitulo;

    const storedUser = localStorage.getItem('objUsuario');
    this.usuario = storedUser ? JSON.parse(storedUser) : new Usuario();

  }

  ngOnInit(): void {

    // Esperar 2 segundos antes de asignar fechaNacimientoMat
            setTimeout(() => {
    
              if (this.fecha) {
                  this.fechaMat = convertirAFechaMat(this.fecha as string);  
              }
    
    
            }, 2000);
   
  }

    envioAddCrmFile() {
        console.log('Enviando CRM file manualmente:', this.crmFile + " |fecha:" + this.fecha);
        if (this.crmFile == '' || this.fechaMat == null) {
            this.utilService.manejarError('Please fill in all required fields.')
            return;
        }

        this.cargando = true;
        this.prospectosAbogadoService.agregarCrmFile(this.prospecto.idProspectoAbogado, this.crmFile, this.fecha).then((prospecto) => {
            this.dialogRef.close("");
        })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));

    }

  cerrar(accion: string = '') { this.dialogRef.close(accion); }

    changeFechaMat() {
        console.log('fechaMat changed:', this.fechaMat);
    
        if (this.fechaMat) {
          this.fecha = formatearFecha(this.fechaMat);
          console.log('Fecha formateada (string):', this.fecha);
        }
    
        
      }

}