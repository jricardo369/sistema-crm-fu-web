import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UtilService } from 'src/app/services/util.service';
import { Configuracion } from 'src/model/configuracion';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GeneralNavComponent } from 'src/app/administracion-general/general-nav/general-nav.component';

@Component({
  selector: 'app-message-settings',
  imports: [RouterModule, FormsModule, GeneralNavComponent, WorkspaceNavComponent, ExperimentalMenuComponent, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './message-settings.html',
  styleUrl: './message-settings.css'
})
export class MessageSettingsComponent {

  //config = new Configuracion();
  arrConfiguraciones: Array<Configuracion> = [];
  //objconfiguracion = new Configuracion;
  configuracion = new Configuracion;

  cargando: boolean = false;

  //Se creo una variable por cada configuracion
  cambiandoMensajeRecordatorioUs: boolean = false;
  mensajeRecordatorioUs: string = "";
  mensajeRecordatorioUsOld: string = "";

  cambiandoMensajeRecordatorioEs: boolean = false;
  mensajeRecordatorioEs: string = "";
  mensajeRecordatorioEsOld: string = "";

  cambiandoMensajePaymentUs: boolean = false;
  mensajePaymentUs: string = "";
  mensajePaymentUsOld: string = "";

  cambiandoMensajePaymentEs: boolean = false;
  mensajePaymentEs: string = "";
  mensajePaymentEsOld: string = "";

  

  constructor(
    private router: Router,
    private configuracionService: ConfiguracionService,
    public utilService: UtilService) {
    localStorage.setItem('manual_name', 'Manual de Administrador');
    localStorage.setItem('manual_file', 'ManualAdministradorSLAPI');

    this.obtenerConfiguraciones();
  }

  obtenerConfiguraciones() {
    this.cargando = true;
    this.configuracionService
      .getConfiguraciones()
      .subscribe(result => {
        this.arrConfiguraciones = result;
        this.procesarConfiguraciones();
      },
        error => {
          this.utilService.manejarError(error);
        });
  }

  procesarConfiguraciones() {
    for (let index = 0; index < this.arrConfiguraciones.length; index++) {
      switch (Number(this.arrConfiguraciones[index].idConfiguracion)) {

        case 17:
          this.mensajeRecordatorioUs = this.arrConfiguraciones[index].valor;
          this.mensajeRecordatorioUsOld = this.mensajeRecordatorioUs;
          break;
        case 18:
          this.mensajeRecordatorioEs = this.arrConfiguraciones[index].valor;
          this.mensajeRecordatorioUsOld = this.mensajeRecordatorioEs;
          break;
        case 19:
          this.mensajePaymentUs = this.arrConfiguraciones[index].valor;
          this.mensajePaymentUsOld = this.mensajePaymentUs;
          break;
        case 20:
          this.mensajePaymentEs = this.arrConfiguraciones[index].valor;
          this.mensajePaymentUsOld = this.mensajePaymentEs;
          break;

        default:
          break;
      }
    }
    this.cargando = false;
  }

  cambiarDato(caso: number) {
    this.configuracion.idConfiguracion = caso;
    this.configuracion.codigo = this.arrConfiguraciones[caso - 1].codigo;
    this.configuracion.descripcion = this.arrConfiguraciones[caso - 1].descripcion;
    switch (caso) {
      
      case 17:
        this.configuracion.valor = this.mensajeRecordatorioUs.toString();
        break;
      case 18:
        this.configuracion.valor = this.mensajeRecordatorioEs.toString();
        break;
        case 17:
        this.configuracion.valor = this.mensajePaymentUs.toString();
        break;
      case 18:
        this.configuracion.valor = this.mensajePaymentEs.toString();
        break;



      default:
        break;
    }

    this.cargando = true;
    this.configuracionService
      .asignarVariable(this.configuracion)
      .then(response => {
        this.utilService.mostrarDialogoSimple("Change made successfully", "");
        if (response.status === 200) {
          switch (caso) {
            
              case 17:
              this.mensajeRecordatorioUsOld = this.mensajeRecordatorioUs;
              this.cambiandoMensajeRecordatorioUs = false;
              break;
              case 18:
              this.mensajeRecordatorioEsOld = this.mensajeRecordatorioEs;
              this.cambiandoMensajeRecordatorioEs = false;
              break;
              case 19:
              this.mensajePaymentUsOld = this.mensajePaymentUs;
              this.cambiandoMensajePaymentUs = false;
              break;
              case 20:
              this.mensajePaymentEsOld = this.mensajePaymentEs;
              this.cambiandoMensajePaymentEs = false;
              break;
              
            default:
              break;
          }
          this.obtenerConfiguraciones();
          this.cargando = false;
        }
      }).catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  cancelarCambio(caso: number) {
    switch (caso) {
      
        case 17:
        this.cambiandoMensajeRecordatorioUs = false;
        this.mensajeRecordatorioUs = this.mensajeRecordatorioUsOld;
        break;
        case 18:
        this.cambiandoMensajeRecordatorioEs = false;
        this.mensajeRecordatorioEs = this.mensajeRecordatorioEsOld;
        break;
        case 17:
        this.cambiandoMensajePaymentUs = false;
        this.mensajePaymentUs = this.mensajePaymentUsOld;
        break;
        case 18:
        this.cambiandoMensajePaymentEs = false;
        this.mensajePaymentEs = this.mensajePaymentEsOld;
        break;

        

      default:
        break;
    }
  }

  onPhoneNumberInput(inputText: string): string {
    let trimmedValue = inputText.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    if (trimmedValue.length > 10) {
      trimmedValue = trimmedValue.slice(0, 10); // Limitar a 10 dígitos (formato de teléfono sin código de país)
    }

    // Aplicar la máscara (###) ###-####
    if (trimmedValue.length > 6) {
      trimmedValue = `(${trimmedValue.slice(0, 3)}) ${trimmedValue.slice(3, 6)}-${trimmedValue.slice(6)}`;
    } else if (trimmedValue.length > 3) {
      trimmedValue = `(${trimmedValue.slice(0, 3)}) ${trimmedValue.slice(3)}`;
    }
    return trimmedValue;
  }

  testMessage() {
    this.cargando = true;
    this.configuracionService
      .envioMensajePrueba()
      .then(response => {
        if (response.status === 200) {
          this.utilService.mostrarDialogoSimple("Message sent successfully", "");
        } else {
          this.utilService.mostrarDialogoSimple("There was an error sending the message", "");
        }
        this.cargando = false;
      }).catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

}
