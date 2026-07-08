import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { API_URL } from "../app.config";
import { Solicitud } from "src/model/solicitud";
import { SolicitudList } from "src/model/solicitud-list";
import { SolicitudTelefono } from "src/model/solicitud-telefono";
import { ReporteComparacionAnios } from "src/model/reporte-comparacion-anios";
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  constructor(private http: HttpClient) { }

  obtenerSolicitud(idSolicitud: number, idUsuario: number): Promise<Solicitud> {
    return new Promise<Solicitud>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitud-por-id/" + idSolicitud + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as Solicitud);
        })
        .catch((reason) => reject(reason))
    );
  }


  obtenerSolicitudesUsuarioConFiltros(idUsuario: number, closed: string, primeraVez: boolean,ordenarPor: string, orden: string,
  fechai: string, fechaf: string, idSolicitud?: number, cliente?: string, telefono?: string, email?: string, estado?: string, idEstatusSolicitud?: number, idEstatusPago?: number,
  idTipoSolicitud?: number, waiver?: string, noshow?: string, importante?: string, asignado?: string,zipcodes?: string,
  consentimiento?: string): Observable<SolicitudList[]> {

    let queryParams: string = "";
    queryParams = "idUsuario=" + idUsuario + "&cerradas=" + closed + "&primeraVez=" + primeraVez + "&ordenarPor=" + ordenarPor + "&orden=" + orden + "&fechai=" + fechai + "&fechaf=" + fechaf+
      (idSolicitud ? ("&idSolicitud=" + idSolicitud) : "") + (cliente ? ("&cliente=" + cliente) : "") + (telefono ? ("&telefono=" + telefono) : "") + (email ? ("&email=" + email) : "") + 
      (estado ? ("&estado=" + estado) : "") + (idEstatusSolicitud ? ("&idEstatusSolicitud=" + idEstatusSolicitud) : "") + (idEstatusPago ? ("&idEstatusPago=" + idEstatusPago) : "") + 
      (idTipoSolicitud ? ("&idTipoSolicitud=" + idTipoSolicitud) : "") + (waiver ? ("&waiver=" + waiver) : "") + (noshow ? ("&noShow=" + noshow) : "") + (importante ? ("&importante=" + importante) : "") + 
      (asignado ? ("&asignado=" + asignado) : "") + (zipcodes ? ("&zipcodes=" + zipcodes) : "") + (consentimiento ? ("&consentimiento=" + consentimiento) : "");


    const url = API_URL + "solicitudes/solicitudes-de-usuario-filtros/" + idUsuario + "?" + queryParams;

    return this.http.get<SolicitudList[]>(url, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('auth_token') || ''
      })
    }).pipe(
      catchError(error => {
        console.error('Error:', error);
        return of([]); // Devuelve array vacío en errores
      })
    );

  }

  obtenerReporteSolicitudesFiltersExcel(idUsuario: number, closed: string, primeraVez: boolean,ordenarPor: string, orden: string,
  fechai: string, fechaf: string, idSolicitud?: number, cliente?: string, telefono?: string, email?: string, estado?: string, idEstatusSolicitud?: number, idEstatusPago?: number,
  idTipoSolicitud?: number, waiver?: string, noshow?: string, importante?: string, asignado?: string,zipcodes?: string, consentimiento?: string
): Observable<Blob> {
  
       let queryParams: string = "";
    queryParams = "idUsuario=" + idUsuario + "&cerradas=" + closed + "&primeraVez=" + primeraVez + "&ordenarPor=" + ordenarPor + "&orden=" + orden + "&fechai=" + fechai + "&fechaf=" + fechaf+
      (idSolicitud ? ("&idSolicitud=" + idSolicitud) : "") + (cliente ? ("&cliente=" + cliente) : "") + (telefono ? ("&telefono=" + telefono) : "") + (email ? ("&email=" + email) : "") + 
      (estado ? ("&estado=" + estado) : "") + (idEstatusSolicitud ? ("&idEstatusSolicitud=" + idEstatusSolicitud) : "") + (idEstatusPago ? ("&idEstatusPago=" + idEstatusPago) : "") + 
      (idTipoSolicitud ? ("&idTipoSolicitud=" + idTipoSolicitud) : "") + (waiver ? ("&waiver=" + waiver) : "") + (noshow ? ("&noShow=" + noshow) : "") + (importante ? ("&importante=" + importante) : "") + 
      (asignado ? ("&asignado=" + asignado) : "") + (zipcodes ? ("&zipcodes=" + zipcodes) : "") + (consentimiento ? ("&consentimiento=" + consentimiento) : "");

      
      const httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth_token'),
      });
      const options = {
      params: new HttpParams({ fromString: queryParams }),
      headers: httpHeaders,
      responseType: 'blob' as 'json'
    };
      return this.http.get<any>(
          
          API_URL + "solicitudes/solicitudes-de-usuario-filtros-excel/" + idUsuario,
          options
      );
    }

  obtenerSolicitudesUsuarioCerradas(idUsuario: number): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitudes-de-usuario/" + idUsuario + "?estatus=" + 11, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudList[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerSolicitudesDeTelefono(telefono: string): Promise<SolicitudTelefono[]> {
    return new Promise<SolicitudTelefono[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitudes-de-telefono/" + telefono, {
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

  obtenerTextosOrdenarPor(idUsuario: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/obtener-textos-ordenar-por/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as string[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerTextosTipoParaFiltros(idUsuario: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/obtener-textos-tipo-para-filtro/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as string[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  // Response vacio
  insertarSolicitud(idUsuario: number, solicitud: Solicitud, comentarios: string): Promise<any> {
    let nuevaSolicitud = {
      fechaInicio: solicitud.fechaInicio,
      cliente: solicitud.cliente,
      telefono: solicitud.telefono,
      email: solicitud.email,
      docusign: null,
      abogado: solicitud.abogado,
      email_abogado: solicitud.email_abogado,
      idTipoSolicitud: solicitud.idTipoSolicitud,
      firmaAbogados: solicitud.firmaAbogados,
      comentario: comentarios,
      fechaNacimiento: solicitud.fechaNacimiento,
      adicional: solicitud.adicional,
      apellidos: solicitud.apellidos,
      external: solicitud.external,
      usuarioExternal: solicitud.usuarioExternal,
      idioma: solicitud.idioma,
      estado: solicitud.estado,
      sexo: solicitud.sexo,
      idAbogado: solicitud.idAbogado,
      emailAboSel: solicitud.emailAboSel
    }

    let params = new HttpParams();
    params = params.set("idUsuario", idUsuario.toString());
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "solicitudes", nuevaSolicitud, {
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

  actualizarSolicitud(solicitud: Solicitud,cerrado: boolean,idUsuario: number): Promise<any> {
    console.log('s:'+cerrado);
    let c = '';
    if(cerrado){
     c = "?estatus=cerrado&idUsuario="+idUsuario;
    }else{
      c = "?idUsuario="+idUsuario;
    }
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes"+c, solicitud, {
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

  envioSiguienteProceso(idSolicitud: number, fechaAnterior: boolean, idUsuarioCambio: number, idDisponibilidad?: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-siguiente-proceso/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + (idDisponibilidad ? "&idDisponibilidad=" + idDisponibilidad : "") + "&fechaAnterior=" + fechaAnterior, {
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

  envioCaseManager(idSolicitud: number, fechaAnterior: boolean, idUsuarioCambio: number, idDisponibilidad: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-interviewer-case-manager/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + "&idDisponibilidad=" + idDisponibilidad + "&fechaAnterior=" + fechaAnterior, {
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

  envioInterviewerScales(idSolicitud: number, fechaAnterior: boolean, idUsuarioCambio: number, idDisponibilidad: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-interviewer-scales/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + "&idDisponibilidad=" + idDisponibilidad + "&fechaAnterior=" + fechaAnterior, {
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

  envioClinicianProcess(idSolicitud: number, fechaAnterior: boolean, idUsuarioCambio: number, idDisponibilidad: number,idDisponibilidadTraductor: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-interviewer-clinician/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + "&idDisponibilidad=" + idDisponibilidad + "&fechaAnterior=" + fechaAnterior
          + "&idDisponibilidadTraductor=" + idDisponibilidadTraductor, {
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

  actualizarEstatusSolicitud(idSolicitud: number, idEstatus: number, idUsuario: number, closed?: boolean,motivo?: string): Promise<any> {
    var m = "";
    if (motivo === undefined) {
      m = "";
    }else{
      m = "&motivo=" + motivo;
    }
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/actualizar-estatus-solicitud/" + idSolicitud + "/" + idEstatus + "?idUsuario=" + idUsuario + (closed ? ("&closed=" + closed) : "" + m), {
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

  envioFinEntrevistaCaseManager(idSolicitud: number,  idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-fin-entrevista-case-manager/" + idSolicitud + "?idUsuarioCambio=" + idUsuario , {
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

  envioFinEntrevistaScales(idSolicitud: number,  idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-fin-entrevista-scales/" + idSolicitud + "?idUsuarioCambio=" + idUsuario , {
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

  envioFinEntrevistaClinician(idSolicitud: number,  idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-fin-entrevista-clinician/" + idSolicitud + "?idUsuarioCambio=" + idUsuario , {
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

  parcheFinClinician(idSolicitud: number,  idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/parche-fin-clinician/" + idSolicitud + "?idUsuarioCambio=" + idUsuario , {
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

  rejectSolicitud(idSolicitud: number, idUsuarioEnvio: number, idUsuarioSeleccionado: number, motivo: string, esRechazo: boolean = false): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/reject/" + idSolicitud + "/" + idUsuarioSeleccionado + "?idUsuarioEnvio=" + idUsuarioEnvio + (esRechazo ? "&motivo=" + motivo : ""), {
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

  reopenSolicitud(idSolicitud: number, idUsuarioEnvio: number, motivo: string): Promise<any> {
    return new Promise<any>((resolve, reopen) =>
      this.http
        .put(API_URL + "solicitudes/reopen/" + idSolicitud + "/" + idUsuarioEnvio + "?motivo=" + motivo, {
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
        .catch((reason) => reopen(reason))
    );
  }

  envioTemplate(idSolicitud: number, idUsuarioEnvio: number, idUsuarioSeleccionado: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-template/" + idSolicitud + "/" + idUsuarioSeleccionado + "?idUsuarioEnvio=" + idUsuarioEnvio, {
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

  async noShow(idSolicitud: number, idUsuarioEnvio: number, motivo: string, esRechazo: boolean = false): Promise<any> {

    const url = `${API_URL}solicitudes/no-show/${idSolicitud}?idUsuarioEnvio=${idUsuarioEnvio}${esRechazo ? `&motivo=${encodeURIComponent(motivo)}` : ''}`;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', localStorage.getItem('auth_token') || '');

    try {
      const response = await lastValueFrom(
        this.http.put(url, null, {
          headers,
          withCredentials: true,
          observe: 'response'
        })
      );
      return response;
    } catch (error) {
      throw error;
    }

  }

  cancelTemplate(idSolicitud: number, idUsuarioEnvio: number, idUsuarioSeleccionado: number, motivo: string): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/cancel-template/" + idSolicitud + "/" + idUsuarioSeleccionado + "?idUsuarioEnvio=" + idUsuarioEnvio + "&motivo=" + motivo , {
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

  obtenerReporteComparacionAnios(anio: number, fileStatus: string): Promise<ReporteComparacionAnios> {
    return new Promise<ReporteComparacionAnios>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/reporte-anios/" + anio + "?filtro=" + fileStatus, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteComparacionAnios);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerReporteDash(idUsuarioEnvio: number, idUsuarioSeleccionado: number,fechai: string, fechaf: string,tileDash: number): Promise<ReporteComparacionAnios> {
    return new Promise<ReporteComparacionAnios>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/solicitudes-dashboard/" + idUsuarioEnvio + "?usuario=" + idUsuarioSeleccionado+"&fechai"+fechai+"&fechaf"+fechaf+"&tileDash"+tileDash, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteComparacionAnios);
        })
        .catch((reason) => reject(reason))
    );
  }

  actualizarConCuponSolicitud(idSolicitud: number, idUsuario: number): Promise<any> {
   
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/agregar-cupon/" + idSolicitud + "?idUsuario=" + idUsuario, {
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

  actualizarInterviewClinicianToCaseManager(idSolicitud: number, idUsuario: number,idUsuarioEnvio: number): Promise<any> {
   
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/actualizar-interview-to-case-manager/" + idSolicitud + "/" + idUsuario+"?idUsuarioEnvio=" + idUsuarioEnvio, {
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
