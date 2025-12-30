import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogoSimpleComponent } from '../common/dialogo-simple/dialogo-simple.component';
import { DialogoLoginComponent } from '../common/dialogo-login/dialogo-login.component';
import { DialogoFrameComponent } from '../common/dialogo-frame/dialogo-frame.component';
import { Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { API_URL } from '../app.config';
import { CustomI18nService } from '../custom-i18n.service';

export class Filter {
  campo: string = 'nombre';
  operador = 'startsWith';
  valor = null;
}

@Injectable({
  providedIn: 'root'
})
export class UtilService {


  appNavMenuHidden = true;
  workspaceNavMenuOpened = false;
  workspaceNavMenuShortened = false;

  private sTimeout: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    private customI18n: CustomI18nService
  ) { }

  formatoMoneda = function (amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  };

  dateAsYYYYMMDD(date: Date): string {
    return '' + date.getFullYear() + '-' + this.withLeadingZeros((date.getMonth() + 1), 2) + '-' + this.withLeadingZeros((date.getDate()), 2);
  }

  dateAsMMDDYYYY(date: Date): string {
    return this.withLeadingZeros((date.getMonth() + 1), 2)+'/'+ this.withLeadingZeros((date.getDate()), 2) +'/'+ date.getFullYear();
  }

  withLeadingZeros(integer: number, digits: number): string {
    let n = '' + Number.parseInt('' + integer);
    for (let i = n.length; i < digits; i++) n = '0' + n;
    return n;
  }

  validateInput(event: any) {
    let entrada = event.target.value;
    let decimal: boolean = false;
    let countDecimals: number = 0;
    let valida: boolean;
    for (var i = 0; i < entrada.length; i++) {
      let charCode = entrada.charCodeAt(i);
      if (charCode >= 48 && charCode <= 57) {
        if (decimal) {
          if (countDecimals < 2) {
            countDecimals++;
            valida = true;
          } else {
            valida = false;
            break;
          }
        } else {
          valida = true;
        }
      } else if (charCode == 46 && !decimal) {
        decimal = true;
        valida = true;
      } else {
        valida = false;
        break;
      }
    }

    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      if (decimal) {
        if (countDecimals < 2) {
          countDecimals++;
          valida = true;
        } else {
          valida = false;
        }
      } else {
        valida = true;
      }
    } else if (charCode == 46 && !decimal) {
      decimal = true;
      valida = true;
    } else {
      valida = false;
    }
    return valida;
  }

  goBack() {
    this.location.back();
  }

  manejarError(reason: any) {

    console.error(reason);

    let titulo = '';
    let texto = reason;

    if (reason instanceof HttpErrorResponse) {

      if (reason.status == 403) {
        this.mostrarDialogoLogin();
        return;
      }

      if (reason.error) {

        // CUALQUIER TEXTO QUE VENGA ES BUENO PARA MOSTRAR COMO ERROR
        texto = reason.error;

        // TRATANDO DE INTERPRETAR UN SERVICE RESULT
        if (reason.error.result) {
          titulo = texto.result.status;
          texto = texto.result.message;
        }

        // TRATANDO DE INTERPRETAR UN CONFLICTS
        // conflicts: [{id: "referencia", value: "size must be between 0 and 16"}]
        if (reason.error.conflicts) {
          texto = reason.error.conflicts[0].id + ': ' + reason.error.conflicts[0].value;
        }

        // MANEJANDO EL messageDialogDto DE CAJA CHICA
        if (reason.error.messageDialogDto) {
          titulo = reason.error.messageDialogDto.title;
          texto = reason.error.messageDialogDto.message;
        }

        if (reason.error.status) {
          titulo = reason.error.error;
          texto = reason.error.message;
        }

        // MANEJANDO los errores que regresan JSON
        let ts = reason ? String(reason) : '';
        if (ts.substring(0, 1) === '{') {
          let json = JSON.parse(texto);
          if (json.status) {
            titulo = json.error;
            texto = json.message;
          }
        }

        // Manejando el object ProgressEvent
        if (reason.status == 0) {
          titulo = reason.name;
          texto = reason.message;
        }

      } else {
        texto = "El error no cuenta con descripción";
      }

    } else if (texto.message) {
      texto = texto.message;
    }

    titulo = 'Error';

    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: titulo,
        texto: texto,
        botones: [{ texto: 'Ok', color: 'accent' },]
      },
      disableClose: true,
    });

  }

  mostrarDialogoLogin(recuperarPasswordOnly = false) {
    this.dialog.open(DialogoLoginComponent, {
      disableClose: !recuperarPasswordOnly,
      closeOnNavigation: true,
      data: {
        recuperarPasswordOnly: recuperarPasswordOnly
      }
    });
  }

  /**
   *
   * @param titulo titulo a mostrar
   * @param texto texto a mostrar
   * @param okText texto de ok
   * @param noText texto de no
   */
  mostrarDialogoSimple(
    titulo: string,
    texto: string,
    okText: string = "Ok",
    noText: string = null,
    okOptionColor: string = "primary"): Promise<any> {

    let botones = [
      { texto: okText, color: okOptionColor, valor: 'ok' }
    ];

    if (noText) botones.unshift({ texto: noText, color: null, valor: 'no' })

    let dialogRef = this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: titulo,
        texto: texto,
        botones: botones,
      },
      disableClose: true,
    });
    return dialogRef.afterClosed().toPromise();
  }

  mostrarDialogoFrame(src) {
    let dialogRef = this.dialog.open(DialogoFrameComponent, {
      data: {
        src: src
      },
      disableClose: false,
      width: 'calc((100vh - 48px))',
      height: 'calc(100vh - 48px)',
      panelClass: 'camarones'
    });
    return dialogRef.afterClosed().toPromise();
  }

  /**
   *
   * @param titulo
   * @param texto
   * @param okText
   * @param noText
   * @param label etiqueta que aparece sobre el combobox
   * @param items combox items
   * @param displayField campo de los elementos del combobox para mostrar en la lista
   * @param sublabel texto que aparece debajo del combobox
   */
  mostrarDialogoCombobox(titulo: string, texto: string, okText: string = "Aceptar", noText: string = "Cancelar",
    label: string, items: any[], displayField: string, sublabel: string): Promise<any> {

    let botones = [
      { texto: okText, color: 'primary', valor: 'ok' }
    ];

    if (noText) botones.unshift({ texto: noText, color: null, valor: 'no' })

    let dialogRef = this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: titulo,
        texto: texto,
        botones: botones,
        comboboxLabel: label,
        comboboxItems: items,
        comboboxDisplayField: displayField,
        comboboxSublabel: sublabel
      },
      disableClose: true,
    });
    return dialogRef.afterClosed().toPromise();
  }

  /**
   *
   * @param titulo titulo a mostrar
   * @param texto texto a mostrar
   * @param okText texto de ok
   * @param noText texto de no
   * @param campos campos del formulario
   */
  mostrarDialogoConFormulario(
    titulo: string, texto: string, okText: string = "Ok", noText: string = null, campos: any[] = [], okColor = 'primary'): Promise<any> {

    let botones = [
      { texto: okText, color: okColor, valor: 'ok' }
    ];

    if (noText) botones.unshift({ texto: noText, color: null, valor: 'no' })

    let dialogRef = this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: titulo,
        texto: texto,
        botones: botones,
        fields: campos
      },
      disableClose: true,
    });
    return dialogRef.afterClosed().toPromise();
  }

  tableWrapperScroll(evt: Event) {
    let e = evt.srcElement as HTMLDivElement;

    let rightScrollLeft = (e.scrollWidth - e.clientWidth) - e.scrollLeft;
    let leftScrollLeft = e.scrollLeft;

    let needsRightBorder = rightScrollLeft > 1;
    let needsLeftBorder = leftScrollLeft > 1;

    e.style.borderRightWidth = needsRightBorder ? '1px' : '0';
    e.style.borderLeftWidth = needsLeftBorder ? '1px' : '0';
  }

  rutaManual(manual: string) {
    /*const folder = API_URL.replace("viaticos-api/", "") + 'docs/manuales/';
    let name = null;
    switch (manual) {
        case 'ManualEmpleadosSLAPI':
            // name = this.customI18n.localeId === 'en' ? 'TravelExpensesManual.pdf' : 'ManualViaticos.pdf';
            name = 'ManualEmpleadosSLAPI.pdf';
            break;
        case 'ManualAprobadorSLAPI':
            name = 'ManualAprobadorSLAPI.pdf';
            break;
        case 'ManualAdministradorSLAPI':
            name = 'ManualAdministradorSLAPI.pdf';
            break;
        default:
            break;
    }
    // console.log('rutaManual() ' + folder + name);
    window.open(folder + name, '_blank');*/
  }

  iniciarContadorDeSesion() {
    let min = 120;
    this.sTimeout = setTimeout(() => {
      this.limpiarContadorDeSesion();
      this.mostrarDialogoLogin()
    }, ((min * 60) * 1000));
  }

  limpiarContadorDeSesion() {
    clearTimeout(this.sTimeout);
  }

  deshabilitaRetroceso() {
    window.location.hash = "no-back-button";
    window.location.hash = "Again-No-back-button" //chrome
    window.onhashchange = function () {
      window.location.hash = "";
    }
  }

  saveByteArray(reportName: string, byte: ArrayBuffer, formato: string) {
    var file;
    switch (formato) {
      case 'pdf':
        file = new Blob([byte], { type: 'application/pdf' });
        break;
      case 'xlsx':
        file = new Blob([byte], { type: 'application/vnd.ms-excel' });
        break;
      case 'xml':
        file = new Blob([byte], { type: 'application/xml' });
        break;
      case 'zip':
        file = new Blob([byte], { type: 'application/zip' });
        break;
      default:
        break;
    }

    var fileURL = URL.createObjectURL(file);
    let link: any = window.document.createElement('a');
    link.href = fileURL;
    link.download = reportName;
    link.click();
  }
}
