import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { CargoVoc } from 'src/model/cargo-voc';
import { Observable } from 'rxjs';
import { CargoVocCabecera } from 'src/model/cargos-voc-cabecera';

@Injectable({
  providedIn: 'root'
})
export class CitaSolicitudService {

  constructor(private http: HttpClient) { }

  obtenerCitasSolicitud(idSolicitud: number): Promise<CitaSolicitud[]> {
    return new Promise<CitaSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "citas/citas-de-solicitud/" + idSolicitud, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as CitaSolicitud[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  crearCitaSolicitud(citaSolicitud: CitaSolicitud, idUsuario: number): Promise<any> {
    let nuevaCitaSolicitud = {
      comentario: citaSolicitud.comentario,
      fecha: citaSolicitud.fecha,
      hora: citaSolicitud.hora,
      tipo: citaSolicitud.tipo,
      dosCitas: citaSolicitud.dosCitas,
      idUsuario: idUsuario,
      idSolicitud: citaSolicitud.idSolicitud,
      recurrente: citaSolicitud.recurrente
    }
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "citas", nuevaCitaSolicitud, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body);
        })
        .catch((reason) => reject(reason))
    );
  }

  no_show(idCita: number, idUsuario: number,motivo: string): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "citas/no-show/" + idCita + "?idUsuario=" + idUsuario+"&motivo="+motivo, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }

  deleteCita(idCita: number, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .delete(API_URL + "citas/" + idCita + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }

  descargarCita(idCita: number, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "citas/reporte/" + idCita + "?idUsuario=" + idUsuario,
          {
            withCredentials: true,
            observe: 'response',
            responseType: 'arraybuffer',
            headers: new HttpHeaders().append('Content-Type', 'application/octet-stream').append('Authorization', localStorage.getItem('auth_token'))
          })
        .toPromise()
        .then(response => {
          resolve(response.body);
        }).catch(reason => reject(reason));
    });
  }

  async testAuthentication(): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    console.log('1. Token en localStorage:', token);
    
    // Prueba el endpoint de verificación
    const verifyResponse = await this.http.get(
      `${API_URL}citas/verify-token`,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        }),
        withCredentials: true
      }
    ).toPromise();
    
    console.log('2. Verificación exitosa:', verifyResponse);
    
    // Luego prueba tu endpoint real
    await this.obtenerCitasPorSemana('2025-10-06', 0, false, 15,"5","All","");
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

  obtenerCitasPorSemana(filterFecha: string, filterUsuario: number, filterViewAvalability: boolean, idUsuario: number, rol: string, estatusCita: string, estado: string): Promise<CitaSolicitud[]> {
    //this.testAuthentication();
    return new Promise<CitaSolicitud[]>((resolve, reject) => this.http
      .get(API_URL + 'citas/citas-de-usuario-semana/' + idUsuario + "?fecha=" + filterFecha + "&filtro=" + (filterUsuario > 0 ? filterUsuario : "") + "&disponibilidad=" + filterViewAvalability+
      "&idRol="+rol+"&estatusCita="+estatusCita+"&estado="+estado,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body as CitaSolicitud[]);
      })
      .catch(reason => reject(reason))
    );
  }

  obtenerCargosPendientes(fechai: string, fechaf: string, filtro: string, idUsuario: number, campo: string,valor: string,tipo: string): Promise<CargoVocCabecera> {
    return new Promise<CargoVocCabecera>((resolve, reject) => this.http
      .get(API_URL + 'citas/cargos-pendientes?idUsuario=' + idUsuario + "&fechai=" + fechai + "&fechaf=" + fechaf 
        + "&campo=" + campo+ "&valor=" + valor+ "&tipo=" + tipo,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body as CargoVocCabecera);
      })
      .catch(reason => reject(reason))
    );
  }

  obtenerCargosPendientesExcel(fechai: string, fechaf: string, filtro: string, idUsuario: number, campo: string,valor: string,tipo: string): Observable<Blob> {
      let params = new HttpParams();
    params = params.set('idUsuario', idUsuario.toString());
    params = params.set('fechai', fechai);
    params = params.set('fechaf', fechaf);
    params = params.set('valor', valor);
    params = params.set('campo', campo);
    params = params.set('tipo', tipo);
    
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_token'),
    });
    const options = {
      params: params,
      headers: httpHeaders,
      responseType: 'blob' as 'json'
    };
    return this.http.get<any>(
        
        API_URL + 'citas/cargos-pendientes-excel',
        options
    );
  
    }

  pagado(idCita: number, pagado: boolean, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "citas/pagado/" + idCita + "/" + pagado + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }

  enviarRecordatorio(idEvento: number): Promise<CitaSolicitud[]> {
    return new Promise<CitaSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "citas/recordatorio/" + idEvento , {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as CitaSolicitud[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  enviarRecordatorios(fecha: string,idUsuario: number): Promise<CitaSolicitud[]> {
    return new Promise<CitaSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "citas/recordatorios/" + fecha+"?idUsuario="+idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as CitaSolicitud[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  actualizarCita(citaSolicitud: CitaSolicitud, ChangeAllConcurrency: boolean,idUsuarioCambio: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "citas/actualizar-cita" + "?ChangeAllConcurrency=" + ChangeAllConcurrency+"&idUsuarioCambio="+idUsuarioCambio, citaSolicitud,{
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }

  deleteConcurrenceCita(citaSolicitud: CitaSolicitud,ChangeAllConcurrency: boolean,codigoConcurrencia: string,idUsuarioCambio: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "citas/eliminar-cita" + "?ChangeAllConcurrency=" + ChangeAllConcurrency+"&idUsuarioCambio="+idUsuarioCambio+"&codigoConcurrencia="+codigoConcurrencia,citaSolicitud,{
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }

}
