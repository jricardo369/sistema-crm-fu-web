import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { LawyersNotesComponent } from 'src/app/marketing/lawyers-notes/lawyers-notes.component';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { MarketingNavComponent } from 'src/app/marketing/marketing-nav/marketing-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { ProspectosAbogadoService } from 'src/app/services/prospectos-abogado.service';
import { ProspectoAbogado } from 'src/model/prospecto-abogado';
import { UtilService } from 'src/app/services/util.service';

import { DatePipe } from '@angular/common';
import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';
import { Usuario } from 'src/model/usuario';

import { MARKETING,MARKETING_REV,DIG_MAR_MAN,US_STATES } from 'src/app/app.config';

import { EmailProspectoAbogado } from 'src/model/email-prospecto-abogado';
import { EmailProspectoAbogadoService } from 'src/app/services/email-prospecto-abogado.service';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { MatDialog } from "@angular/material/dialog";
import { DialogoNotInteresedComponent } from '../dialogo-not-interesed/dialogo-not-interesed.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { formatearFecha } from '../../util/date-utils';
import { convertirAFechaMat } from '../../util/date-utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WorkspaceNavComponent,
    MarketingNavComponent,
    ExperimentalMenuComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    DateMMDDYYYYPipe,
    PhonePipe,
    LawyersNotesComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  selector: 'app-lawyer-prospect',
  templateUrl: './lawyer-prospect.component.html',
  styleUrls: ['./lawyer-prospect.component.css'],
  providers: [
      DatePipe,
      PhonePipe]
})
export class LawyerProspectComponent {

    @ViewChild(LawyersNotesComponent, { static: false }) lawyersNotesComponent: LawyersNotesComponent;

  cargando: boolean = false;
  prospecto: ProspectoAbogado | null = null;
  idEstatusProspecto: number = 0;
  creando: boolean = false;
  titulo: string = "";
  usuario: Usuario = new Usuario();
  arrStates: any[] = [];

  arrEmailAbogados: EmailProspectoAbogado[] = [];
  inputAbogado: EmailProspectoAbogado = new EmailProspectoAbogado;

  arrEmailAbogadosN: string[] = [];
  inputAbogadoN: string | undefined;

  isMarketing: boolean = false;
  isMarketingRev: boolean = false;
  isDigitalMarketingManager: boolean = false;

  fechaRecordatorioLiaisonMat: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prospectosAbogadoService: ProspectosAbogadoService,
    private emailProspectoAbogadoService: EmailProspectoAbogadoService,
     private dialog: MatDialog,
    public utilService: UtilService
  ) {
    this.route.params.subscribe((params) => {

       this.arrStates = US_STATES;
      this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
      const codigo = params['id'];

      // Si no hay id en la URL, asumimos creación de nuevo prospecto
      if (!codigo) {
        this.titulo = 'New Lawyer Prospect';
        this.creando = true;
        this.prospecto = new ProspectoAbogado();
      } else {
        this.titulo = 'Lawyer Prospect #' + codigo;
        this.creando = false;
        this.obtenerEmailsAbogado(Number(codigo));
        this.cargarProspecto();
        
      }

      this.isMarketing = this.usuario.rol == MARKETING ? true : false;
      this.isMarketingRev = this.usuario.rol == MARKETING_REV ? true : false;
      this.isDigitalMarketingManager = this.usuario.rol == DIG_MAR_MAN ? true : false;

    });
  }

  cargarProspecto() {
    this.cargando = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.cargando = false;
      return;
    }

    this.prospectosAbogadoService.obtenerProspectoAbogadoPorId(id).subscribe({
      next: (prospecto) => {
        this.prospecto = prospecto;
        console.log('Prospecto estatus:', this.prospecto.idEstatusProspecto);
        this.cargando = false;
        this.idEstatusProspecto = this.prospecto.idEstatusProspecto;

        // Esperar 2 segundos antes de asignar fechaNacimientoMat
        setTimeout(() => {

          if (this.prospecto?.fechaRecordatorioLiaison) {
              this.fechaRecordatorioLiaisonMat = convertirAFechaMat(this.prospecto.fechaRecordatorioLiaison as string);  
          }


        }, 2000);

      },
      error: (reason) => {
        this.utilService.manejarError(reason);
        this.cargando = false;
      }
    });
  }

   crearCrearProspectoAbogado() {

    this.prospecto.idUsuario = this.usuario.idUsuario; 
    console.log(this.prospecto);
    this.cargando = true;
    this.prospectosAbogadoService
      .insertarProspectoAbogado(
        this.prospecto, 
        this.arrEmailAbogadosN
      )
      .then((prospecto) => {
        this.router.navigate(['/marketing/lawyers-prospects']);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambios() {
    
    this.cargando = true;
    console.log('Guardar cambios para el prospecto:', this.prospecto);
     this.prospectosAbogadoService.actualizarProspectoAbogado(this.prospecto, 0, this.usuario.idUsuario,"").then((prospecto) => {
      this.cargarProspecto();
      this.lawyersNotesComponent.refresh();
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  terminarProspecto() {

    if(!this.prospecto?.envioCorreo){
      this.utilService.mostrarDialogoSimple('Warning', 'You must check \"Email sent\" to the prospect before sending to next process');
      return;
    }

        if(this.arrEmailAbogados.length == 0){
      this.utilService.mostrarDialogoSimple('Warning', 'You must add at least one email address before submitting to the next process');
      return;
    }

    this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'Send next process',
            texto: 'Do you really want to send to next process?',
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Yes', color: 'primary', valor: 'ok' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'ok') {        
            this.cargando = true;
            console.log('Guardar cambios para el prospecto:', this.prospecto);
            this.prospectosAbogadoService.actualizarProspectoAbogado(this.prospecto,2, this.usuario.idUsuario,"").then((prospecto) => {
              this.cargarProspecto();
              this.router.navigate(['/marketing/lawyers-prospects']);
            })
              .catch((reason) => this.utilService.manejarError(reason))
              .then(() => (this.cargando = false));

          }
        }).catch(reason => this.utilService.manejarError(reason));



    
  }

  sucessfulClient() {

    if(!this.prospecto?.idAbogadoRelacionado){
      this.utilService.mostrarDialogoSimple('Warning', 'A related customer must exist to send to successful status');
      return;
    }

    this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'Sucessful client',
            texto: 'Do you really want to mark this prospect as a successful client?',
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Yes', color: 'primary', valor: 'ok' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'ok') {
            
            this.cargando = true; 
            console.log('Guardar cambios para el prospecto:', this.prospecto);
            this.prospectosAbogadoService.actualizarProspectoAbogado(this.prospecto,4, this.usuario.idUsuario,"").then((prospecto) => {
              this.cargarProspecto();
              this.router.navigate(['/marketing/lawyers-prospects']);
            })
              .catch((reason) => this.utilService.manejarError(reason))
              .then(() => (this.cargando = false));

          }
        }).catch(reason => this.utilService.manejarError(reason));
    
  }

  cancelarProspecto() {
    this.dialog.open(DialogoNotInteresedComponent, {
              data: {
                idEstatusProspecto: 3,
                prospecto: this.prospecto,
                titulo: 'Send to not interested',
                subtitulo: 'Do you really want to send the prospect to not interested?',
                textolabel: 'Please select the not interested reason'
              },
              disableClose: true,
            }).afterClosed().toPromise().then(valor => {
              //this.refesh();
            }).catch(reason => this.utilService.manejarError(reason));


  }

  closedProspecto() {

    this.dialog.open(DialogoNotInteresedComponent, {
              data: {
                idEstatusProspecto: 5,
                prospecto: this.prospecto,
                titulo: 'Send to closed',
                subtitulo: 'Do you really want to send the closed the prospect?',
                textolabel: 'Please select the closed reason'
              },
              disableClose: true,
            }).afterClosed().toPromise().then(valor => {
              //this.refesh();
            }).catch(reason => this.utilService.manejarError(reason));


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

  obtenerEmailsAbogado(idProspectoAbogado: number) {
    this.cargando = true;
    this.emailProspectoAbogadoService
      .obtenerEmailsDeAbogado(idProspectoAbogado).subscribe({
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

  removeEmailAbo(idEmailAbo: number) {
    this.cargando = true;
    this.emailProspectoAbogadoService
      .eliminarEmailAbogado(idEmailAbo)
      .then(abogado => {
        this.obtenerEmailsAbogado(this.prospecto.idProspectoAbogado);
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
      this.emailProspectoAbogadoService.insertarEmailAbogado(this.prospecto.idProspectoAbogado, this.inputAbogado.email, this.usuario.idUsuario)
        .then(() => {
          this.obtenerEmailsAbogado(this.prospecto.idProspectoAbogado);
          this.inputAbogado.email = '';
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
    }

  }

  changeFechaRecordatorioLiaisonMat() {
      console.log('fechaRecordatorioLiaisonMat changed:', this.fechaRecordatorioLiaisonMat);
  
      if (this.fechaRecordatorioLiaisonMat) {
        this.prospecto.fechaRecordatorioLiaison = formatearFecha(this.fechaRecordatorioLiaisonMat);
        console.log('Fecha formateada (string):', this.prospecto.fechaRecordatorioLiaison);
      }
  
      
    }


}
