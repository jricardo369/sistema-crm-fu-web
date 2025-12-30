import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UtilService } from 'src/app/services/util.service';
import { Configuracion } from 'src/model/configuracion';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GeneralNavComponent } from 'src/app/administracion-general/general-nav/general-nav.component';

@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,GeneralNavComponent,WorkspaceNavComponent,ExperimentalMenuComponent,CommonModule,MatIconModule,MatProgressSpinnerModule],
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent {
  //config = new Configuracion();
  arrConfiguraciones: Array<Configuracion> = [];
  //objconfiguracion = new Configuracion;
  configuracion = new Configuracion;

  cargando: boolean = false;

  //Se creo una variable por cada configuracion
  cambiandoDiasPermitidosParaPagar: boolean = false;
  diasPermitidosParaPagar: number = 0;
  diasPermitidosParaPagarOld: number = 0;

  cambiandoTokenCode: boolean = false;
  tokenCode: string = "";
  tokenCodeOld: string = "";

  cambiandoClientSecret: boolean = false;
  clientSecret: string = "";
  clientSecretOld: string = "";

  cambiandoClientId: boolean = false;
  clientId: string = "";
  clientIdOld: string = "";

  cambiandoTokenId: boolean = false;
  tokenId: string = "";
  tokenIdOld: string = "";

  cambiandoPhoneGoTo: boolean = false;
  phoneGoTo: string = "";
  phoneGoToOld: string = "";

  cambiandoPhoneTest: boolean = false;
  phoneTest: string = "";
  phoneTestOld: string = "";

  cambiandoAdminEmail: boolean = false;
  adminEmail: string = "";
  adminEmailOld: string = "";

  cambiandoJobPayments: boolean = false;
  jobPayments: boolean = false
  jobPaymentstOld: boolean = false;

  cambiandoJobLateRequest: boolean = false;
  jobLateRequest: boolean = false
  jobLateRequestOld: boolean = false;

  cambiandoJobRecordatorio: boolean = false;
  jobRecordatorio: boolean = false
  jobRecordatorioOld: boolean = false;

  cambiandoMailBvndClt: boolean = false;
  mailBvndClt: boolean = false
  mailBvndCltOld: boolean = false;

  cambiandoMailBvndAbo: boolean = false;
  mailBvndAbo: boolean = false
  mailBvndAboOld: boolean = false;

  cambiandoContactName: boolean = false;
  contactName: string = "";
  contactNameOld: string = "";

  cambiandoCompanyName: boolean = false;
  companyName: string = "";
  companyNameOld: string = "";

  cambiandoPhoneInfo: boolean = false;
  phoneInfo: string = "";
  phoneInfoOld: string = "";

  cambiandoMensajeRecordatorioUs: boolean = false;
  mensajeRecordatorioUs: string = "";
  mensajeRecordatorioUsOld: string = "";

  cambiandoMensajeRecordatorioEs: boolean = false;
  mensajeRecordatorioEs: string = "";
  mensajeRecordatorioEsOld: string = "";

  cambiendoVOCAdminMail: boolean = false;
  vocAdminMail: string = "";
  vocAdminMailOld: string = "";

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
        case 1:
          this.diasPermitidosParaPagar = Number(this.arrConfiguraciones[index].valor);
          this.diasPermitidosParaPagarOld = this.diasPermitidosParaPagar;
          break;
        case 2:
          this.tokenCode = this.arrConfiguraciones[index].valor;
          this.tokenCodeOld = this.tokenCode;
          break;
        case 3:
          this.clientSecret = this.arrConfiguraciones[index].valor;
          this.clientSecretOld = this.clientSecret;
          break;
        case 4:
          this.clientId = this.arrConfiguraciones[index].valor;
          this.clientIdOld = this.clientId;
          break;
        case 5:
          this.tokenId = this.arrConfiguraciones[index].valor;
          this.tokenIdOld = this.tokenId;
          break;
        case 6:
          this.phoneGoTo = this.arrConfiguraciones[index].valor;
          this.phoneGoTo = this.onPhoneNumberInput(this.phoneGoTo);
          this.phoneGoToOld = this.phoneGoTo;
          break;
        case 7:
          this.phoneTest = this.arrConfiguraciones[index].valor;
          this.phoneTest = this.onPhoneNumberInput(this.phoneTest);
          this.phoneTestOld = this.phoneTest;
          break;
        case 8:
          this.adminEmail = this.arrConfiguraciones[index].valor;
          this.adminEmailOld = this.adminEmail;
          break;
        case 9:
          this.jobPayments = JSON.parse(this.arrConfiguraciones[index].valor);
          this.jobPaymentstOld = this.jobPayments;
          break;
        case 10:
          this.jobLateRequest = JSON.parse(this.arrConfiguraciones[index].valor);
          this.jobLateRequestOld = this.jobLateRequest;
          break;
        case 11:
          this.jobRecordatorio = JSON.parse(this.arrConfiguraciones[index].valor);
          this.jobRecordatorioOld = this.jobRecordatorio;
          break;
        case 12:
          this.mailBvndClt = JSON.parse(this.arrConfiguraciones[index].valor);
          this.mailBvndCltOld = this.mailBvndClt;
          break;
        case 13:
          this.mailBvndAbo = JSON.parse(this.arrConfiguraciones[index].valor);
          this.mailBvndAboOld = this.mailBvndAbo;
          break;

          case 14:
          this.contactName = this.arrConfiguraciones[index].valor;
          this.contactNameOld = this.contactName;
          break;
          case 15:
          this.companyName = this.arrConfiguraciones[index].valor;
          this.companyNameOld = this.companyName ;
          break;
          case 16:
          this.phoneInfo = this.arrConfiguraciones[index].valor;
          this.phoneInfoOld = this.phoneInfo;
          break;
          case 17:
          this.mensajeRecordatorioUs = this.arrConfiguraciones[index].valor;
          this.mensajeRecordatorioUsOld = this.mensajeRecordatorioUs;
          break;
          case 18:
          this.mensajeRecordatorioEs = this.arrConfiguraciones[index].valor;
          this.mensajeRecordatorioUsOld = this.mensajeRecordatorioEs;
          break;
           case 24:
          this.vocAdminMail = this.arrConfiguraciones[index].valor;
          this.vocAdminMailOld = this.mensajeRecordatorioEs;
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
      case 1:
        this.configuracion.valor = this.diasPermitidosParaPagar.toString();
        break;
      case 2:
        this.configuracion.valor = this.tokenCode.toString();
        break;
      case 3:
        this.configuracion.valor = this.clientSecret.toString();
        break;
      case 4:
        this.configuracion.valor = this.clientId.toString();
        break;
      case 5:
        this.configuracion.valor = this.tokenId.toString();
        break;
      case 6:
        this.configuracion.valor = this.phoneGoTo.toString();
        break;
      case 7:
        this.configuracion.valor = this.phoneTest.toString();
        break;
      case 8:
        this.configuracion.valor = this.adminEmail.toString();
        break;
      case 9:
        this.configuracion.valor = this.jobPayments.toString();
        break;
      case 10:
        this.configuracion.valor = this.jobLateRequest.toString();
        break;
      case 11:
        this.configuracion.valor = this.jobRecordatorio.toString();
        break;
      case 12:
        this.configuracion.valor = this.mailBvndClt.toString();
        break;
      case 13:
        this.configuracion.valor = this.mailBvndAbo.toString();
        break;
      case 14:
        this.configuracion.valor = this.contactName.toString();
        break;
      case 15:
        this.configuracion.valor = this.companyName.toString();
        break;
      case 16:
        this.configuracion.valor = this.phoneInfo.toString();
        break;
      case 17:
        this.configuracion.valor = this.mensajeRecordatorioUs.toString();
        break;
      case 18:
        this.configuracion.valor = this.mensajeRecordatorioEs.toString();
        break;
       case 24:
        this.configuracion.valor = this.vocAdminMail.toString();
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
            case 1:
              this.diasPermitidosParaPagarOld = this.diasPermitidosParaPagar;
              this.cambiandoDiasPermitidosParaPagar = false;
              break;
            case 2:
              this.tokenCodeOld = this.tokenCode;
              this.cambiandoTokenCode = false;
              break;
            case 3:
              this.clientSecretOld = this.clientSecret;
              this.cambiandoClientSecret = false;
              break;
            case 4:
              this.clientIdOld = this.clientId;
              this.cambiandoClientId = false;
              break;
            case 5:
              this.tokenIdOld = this.tokenId;
              this.cambiandoTokenId = false;
              break;
            case 6:
              this.phoneGoToOld = this.phoneGoTo;
              this.cambiandoPhoneGoTo = false;
              break;
            case 7:
              this.phoneTestOld = this.phoneTest;
              this.cambiandoPhoneTest = false;
              break;
            case 8:
              this.adminEmailOld = this.adminEmail;
              this.cambiandoAdminEmail = false;
              break;
            case 9:
              this.jobPaymentstOld = this.jobPayments;
              this.cambiandoJobPayments = false;
              break;
            case 10:
              this.jobLateRequestOld = this.jobLateRequest;
              this.cambiandoJobLateRequest = false;
              break;
            case 11:
              this.jobRecordatorioOld = this.jobRecordatorio;
              this.cambiandoJobRecordatorio = false;
              break;
            case 12:
              this.mailBvndCltOld = this.mailBvndClt;
              this.cambiandoMailBvndClt = false;
              break;
            case 13:
              this.mailBvndAboOld = this.mailBvndAbo;
              this.cambiandoMailBvndAbo = false;
              break;

              case 14:
              this.contactNameOld = this.contactName;
              this.cambiandoContactName = false;
              break;
              case 15:
              this.companyNameOld = this.companyName;
              this.cambiandoCompanyName = false;
              break;
              case 16:
              this.phoneInfoOld = this.phoneInfo;
              this.cambiandoPhoneInfo = false;
              break;
              case 17:
              this.mensajeRecordatorioUsOld = this.mensajeRecordatorioUs;
              this.cambiandoMensajeRecordatorioUs = false;
              break;
              case 18:
              this.mensajeRecordatorioEsOld = this.mensajeRecordatorioEs;
              this.cambiandoMensajeRecordatorioEs = false;
              break;
              case 24:
              this.vocAdminMailOld = this.vocAdminMail;
              this.cambiendoVOCAdminMail = false;
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
      case 1:
        this.cambiandoDiasPermitidosParaPagar = false;
        this.diasPermitidosParaPagar = this.diasPermitidosParaPagarOld;
        break;
      case 2:
        this.cambiandoTokenCode = false;
        this.tokenCode = this.tokenCodeOld;
        break;
      case 3:
        this.cambiandoClientSecret = false;
        this.clientSecret = this.clientSecretOld;
        break;
      case 4:
        this.cambiandoClientId = false;
        this.clientId = this.clientIdOld;
        break;
      case 5:
        this.cambiandoTokenId = false;
        this.tokenId = this.tokenIdOld;
        break;
      case 6:
        this.cambiandoPhoneGoTo = false;
        this.phoneGoTo = this.phoneGoToOld;
        break;
      case 7:
        this.cambiandoPhoneTest = false;
        this.phoneTest = this.phoneTestOld;
        break;
      case 8:
        this.cambiandoAdminEmail = false;
        this.adminEmail = this.adminEmailOld;
        break;
      case 9:
        this.cambiandoJobPayments = false;
        this.jobPayments = this.jobPaymentstOld;
        break;
      case 10:
        this.cambiandoJobLateRequest = false;
        this.jobLateRequest = this.jobLateRequestOld;
        break;
      case 11:
        this.cambiandoJobRecordatorio = false;
        this.jobRecordatorio = this.jobRecordatorioOld;
        break;
      case 12:
        this.cambiandoMailBvndClt = false;
        this.mailBvndClt = this.mailBvndCltOld;
        break;
      case 13:
        this.cambiandoMailBvndAbo = false;
        this.mailBvndAbo = this.mailBvndAboOld;
        break;

        case 14:
        this.cambiandoContactName = false;
        this.contactName = this.contactNameOld;
        break;
        case 15:
        this.cambiandoCompanyName = false;
        this.companyName = this.companyNameOld;
        break;
        case 16:
        this.cambiandoPhoneInfo = false;
        this.phoneInfo = this.phoneInfoOld;
        break;
        case 17:
        this.cambiandoMensajeRecordatorioUs = false;
        this.mensajeRecordatorioUs = this.mensajeRecordatorioUsOld;
        break;
        case 18:
        this.cambiandoMensajeRecordatorioEs = false;
        this.mensajeRecordatorioEs = this.mensajeRecordatorioEsOld;
        break;
         case 24:
        this.cambiendoVOCAdminMail = false;
        this.vocAdminMail = this.vocAdminMailOld;
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
