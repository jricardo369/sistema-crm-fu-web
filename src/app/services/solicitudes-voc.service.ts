import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { SolicitudNumeroCaso } from "src/model/solicitud-numerocaso";
import { SolicitudTelefono } from "src/model/solicitud-telefono";
import { SolicitudVoc } from "src/model/solicitud-voc";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class SolicitudesVocService {
  constructor(private http: HttpClient) { }

  obtenerSolicitud(idSolicitud: number, idUsuario: number): Promise<SolicitudVoc> {
    return new Promise<SolicitudVoc>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes-voc/solicitud-por-id/" + idSolicitud + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudVoc);
        })
        .catch((reason) => reject(reason))
    );
  }

  

  obtenerSolicitudesUsuario(idUsuario: number): Promise<SolicitudVoc[]> {
    return new Promise<SolicitudVoc[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes-voc/solicitudes-de-usuario/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudVoc[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerSolicitudesActivasUsuario(idUsuario: number): Promise<SolicitudVoc[]> {
    return new Promise<SolicitudVoc[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes-voc/solicitudes-activas-de-usuario/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudVoc[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerSolicitudesUsuarioCerradas(idUsuario: number): Promise<SolicitudVoc[]> {
    return new Promise<SolicitudVoc[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes-voc/solicitudes-de-usuario/" + idUsuario + "?estatus=" + 11, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudVoc[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerSolicitudesDeTelefono(telefono: string): Promise<SolicitudTelefono[]> {
    return new Promise<SolicitudTelefono[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes-voc/solicitudes-de-telefono/" + telefono, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudTelefono[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerReporteSolicitudesFiltersExcel(idUsuario: number, campo: string, valor: string, fecha1: string, fecha2: string, myFiles: boolean, fechai: string,fechaf: string,cerradas: string): Observable<Blob> {

    let params = new HttpParams();
    params = params.set('idUsuario', idUsuario.toString());
    params = params.set('fechai', fechai);
    params = params.set('fechaf', fechaf);
    params = params.set('valor', valor);
    params = params.set('campo', campo);
    params = params.set('cerradas', cerradas);
    params = params.set('myFiles', myFiles);
    
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
        
        API_URL + "solicitudes-voc/solicitudes-de-usuario-excel/" + idUsuario,
        options
    );
  }

  obtenerReporteSolicitudesFilters(idUsuario: number, campo: string, valor: string, fecha1: string, fecha2: string, myFiles: boolean, fechai: string,fechaf: string,cerradas: string): Promise<SolicitudVoc[]> {
    let queryParams: string = "";
      queryParams = "idUsuario=" + idUsuario + "&campo=" + campo + "&valor=" + valor + "&myFiles=" + myFiles+ "&fechai=" + fechai+"&fechaf=" + fechaf+"&cerradas=" + cerradas;
    
    return new Promise<SolicitudVoc[]>((resolve, reject) =>
      this.http
        //.get(API_URL + "solicitudes-voc/reporte-solicitudes-filters?" + queryParams, {
          .get(API_URL + "solicitudes-voc/solicitudes-de-usuario/" + idUsuario +'?'+ queryParams, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudVoc[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  // Response vacio
  insertarSolicitud(idUsuario: number, solicitud: SolicitudVoc): Promise<any> {
    let nuevaSolicitud = {
      fechaInicio: solicitud.fechaInicio,
      cliente: solicitud.cliente,
      telefono: solicitud.telefono,
      email: solicitud.email,
      idTipoSolicitud: solicitud.idTipoSolicitud,
      apellidos: solicitud.apellidos,
      numeroDeCaso: solicitud.numeroDeCaso,
      code: solicitud.code
      // external: solicitud.external,
      // usuarioExternal: solicitud.usuarioExternal
    }

    let params = new HttpParams();
    params = params.set("idUsuario", idUsuario.toString());
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "solicitudes-voc", nuevaSolicitud, {
          params: params,
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

  actualizarSolicitud(solicitud: SolicitudVoc): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes-voc", solicitud, {
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

  envioSiguienteProceso(idSolicitud: number, idUsuarioCambio: number, idDisponibilidad?: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes-voc/envio-siguiente-proceso/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + (idDisponibilidad ? "&idDisponibilidad=" + idDisponibilidad : ""), {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  asignarTerapeuta(idSolicitud: number, idUsuarioSelected: number, idUsuarioEntrada: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes-voc/asignar-terapeuta/" + idSolicitud + "/" + idUsuarioSelected + "?idUsuarioEntrada=" + idUsuarioEntrada, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  actualizarEstatusSolicitud(idSolicitud: number, idEstatus: number, idUsuario: number, closed: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes-voc/actualizar-estatus-solicitud/" + idSolicitud + "/" + idEstatus + "?idUsuario=" + idUsuario + "&closed=" + closed, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  reasignarSolicitud(idSolicitud: number, idUsuarioEnvio: number, idUsuarioSeleccionado: number, motivo: string, esRechazo: boolean = false): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes-voc/reasignar/" + idSolicitud + "/" + idUsuarioSeleccionado + "?idUsuarioEnvio=" + idUsuarioEnvio + (esRechazo ? "&motivo=" + motivo : ""), {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  generateProcessLetter(idSolicitud: number, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "solicitudes-voc/generar-process-letter/" + idSolicitud + "?idUsuario=" + idUsuario,
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

  obtenerSolicitudesDeNumerosCasos(numcaso: string): Promise<SolicitudNumeroCaso[]> {
    return new Promise<SolicitudNumeroCaso[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes-voc/solicitudes-de-numerocasos/" + numcaso, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudNumeroCaso[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  syncSolicitudSesiones(idSolicitud: number, idUsuarioEnvio: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes-voc/syncronizar-sesiones/" + idSolicitud + "/" + idUsuarioEnvio , {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

}
