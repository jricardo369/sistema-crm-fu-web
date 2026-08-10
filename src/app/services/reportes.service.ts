import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { ReporteSolicitudesUsuarios } from 'src/model/reporte-solicitudes-usuarios';
import { ReporteSolicitudesUsuario } from 'src/model/reporte-solicitudes-usuario';
import { ReporteFilesFirma } from 'src/model/reporte-files-firma';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';
import { ReporteDash } from "src/model/reporte-dash";
import { SolicitudList } from 'src/model/solicitud-list';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { ReporteDetSols } from "src/model/reporte-det-sols";
import { ReporteClientePorEstado } from 'src/model/reporte-cliente-por-estado';
import { Observable } from 'rxjs';
import { ReporteClientePorFirma } from 'src/model/reporte-cliente-por-firma';
import { ReporteClientePorFirmaAnioMes } from 'src/model/reporte-cliente-por-firma-anio-mes';
import { ReporteNotasCitas } from 'src/model/reporte-notas-citas';
import { ReporteNotasRetrasadas } from 'src/model/reporte-notas-retrasadas';
import { NotaRetrasada } from 'src/model/nota-retrasada';


@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  obtenerUsersRequests(fechaInicio: string, fechaFin: string, idUsuario: number): Promise<ReporteSolicitudesUsuarios[]> {
    return new Promise<ReporteSolicitudesUsuarios[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/solicitudes-de-usuarios/" + idUsuario + "?fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteSolicitudesUsuarios[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerUsersRequestsObj(fechaInicio: string, fechaFin: string, idUsuario: number): Promise<ReporteSolicitudesUsuario[]> {
    return new Promise<ReporteSolicitudesUsuario[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/solicitudes-de-usuario/" + idUsuario + "?fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteSolicitudesUsuario[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerFilesFirmaAbogado(fechaInicio: string, fechaFin: string, firmaAbogado: string, idAbogado: number): Promise<ReporteFilesFirma[]> {
    return new Promise<ReporteFilesFirma[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/files-de-firma-abogado/?fechai=" + fechaInicio + "&fechaf=" + fechaFin + "&firmaAbogado=" + firmaAbogado + "&idAbogado=" + idAbogado, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteFilesFirma[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerFilesFirmaAbogadoExcel(fechaInicio: string, fechaFin: string, firmaAbogado: string): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('fechai', fechaInicio);
    params = params.set('fechaf', fechaFin);
    params = params.set('firmaAbogado', firmaAbogado);

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

      API_URL + 'reportes/files-de-firma-abogado-excel',
      options
    );

  }

  obtenerFilesFirmasAbogadosExcel(fechaInicio: string, fechaFin: string): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('fechai', fechaInicio);
    params = params.set('fechaf', fechaFin);

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

      API_URL + 'reportes/files-de-firma-abogados-excel',
      options
    );

  }

  obtenerCorreosEnviados(fechaInicio: string, fechaFin: string): Promise<ReporteCorreosEnviados[]> {
    return new Promise<ReporteCorreosEnviados[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/correos-a-abogados?fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteCorreosEnviados[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  generateW9(idSolicitud: number, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "reportes/w9/" + idSolicitud + "?idUsuario=" + idUsuario,
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

  obtenerDashboard(fechaInicio: string, fechaFin: string, idUsuarioLogeado: number, usuario: number): Promise<ReporteDash> {
    return new Promise<ReporteDash>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/reporte-cabecera-dashboard/" + idUsuarioLogeado + "?fechai=" + fechaInicio + "&fechaf=" + fechaFin + "&usuario=" + usuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteDash);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerDetalleDashboard(fechaInicio: string, fechaFin: string, idUsuarioLogeado: number, usuario: number, tileDash: number): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/solicitudes-dashboard/" + idUsuarioLogeado + "?fechai=" + fechaInicio + "&fechaf=" + fechaFin + "&usuario=" + usuario + '&tileDash=' + tileDash, {
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

  obtenerDetalleSolsDashboard(fechaInicio: string, fechaFin: string, idUsuarioLogeado: number, usuario: number, tileDash: number): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/detalle-solicitudes-dashboard/" + idUsuarioLogeado + "?fechai=" + fechaInicio + "&fechaf=" + fechaFin + "&usuario=" + usuario + '&tileDash=' + tileDash, {
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

  obtenerDetalleEventosDashboard(fechaInicio: string, fechaFin: string, idUsuarioLogeado: number, usuario: number, tileDash: number): Promise<EventoSolicitud[]> {
    return new Promise<EventoSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/eventos-dashboard/" + idUsuarioLogeado + "?fechai=" + fechaInicio + "&fechaf=" + fechaFin + "&usuario=" + usuario + '&tileDash=' + tileDash, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as EventoSolicitud[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  reporteDetalleSolsFechas(idUsuarioLogeado: number, fechai: string, fechaf: string, usuario: number): Promise<ReporteDetSols[]> {
    return new Promise<ReporteDetSols[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/detalle-solicitudes-all/" + idUsuarioLogeado + "?fechai=" + fechai + "&fechaf=" + fechaf + "&usuario=" + usuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteDetSols[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerClientesPorEstado(fechaInicio: string, fechaFin: string): Promise<ReporteClientePorEstado[]> {
    return new Promise<ReporteClientePorEstado[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes-abogado/por-estado?fechaInicio=" + fechaInicio + "&fechaFin=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteClientePorEstado[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerClientesPorFirma(fechaInicio: string, fechaFin: string): Promise<ReporteClientePorFirma[]> {
    return new Promise<ReporteClientePorFirma[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes-abogado/clientes-por-firma?fechaInicio=" + fechaInicio + "&fechaFin=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteClientePorFirma[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerClientesPorFirmaAnioMes(fechaInicio: string, fechaFin: string): Promise<ReporteClientePorFirmaAnioMes[]> {
    return new Promise<ReporteClientePorFirmaAnioMes[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes-abogado/total-firmas-anio-mes?fechaInicio=" + fechaInicio + "&fechaFin=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteClientePorFirmaAnioMes[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerNotasCitasRangoFechas(fechaInicio: string, fechaFin: string): Promise<ReporteNotasCitas> {
    return new Promise<ReporteNotasCitas>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/notas-citas-rango-fechas?fechaf=" + fechaFin + "&fechai=" + fechaInicio, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          const body = response.body as ReporteNotasCitas[];
          resolve(Array.isArray(body) ? body[0] : body);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerNotasCitasTerapeutasRangoFechas(fechaInicio: string, fechaFin: string): Promise<ReporteNotasRetrasadas[]> {
    return new Promise<ReporteNotasRetrasadas[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/notas-citas-terapeutas-rango-fechas?fechaf=" + fechaFin + "&fechai=" + fechaInicio, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteNotasRetrasadas[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerNotasCitasTerapeutasDetalleRangoFechas(idUsuario: number, fechaInicio: string, fechaFin: string): Promise<NotaRetrasada[]> {
    return new Promise<NotaRetrasada[]>((resolve, reject) =>
      this.http
        .get(API_URL + "reportes/notas-citas-terapeutas-detalle-rango-fechas/" + idUsuario + "?fechaf=" + fechaFin + "&fechai=" + fechaInicio, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as NotaRetrasada[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerHorasMesTerapeuta(idTerapeuta: number, anio: number, mes: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "reportes/horas-mes-terapeuta/" + idTerapeuta + "?anio=" + anio + "&mes=" + mes,
          {
            withCredentials: true,
            observe: 'response',
            responseType: 'arraybuffer',
            headers: new HttpHeaders()
              .append('Content-Type', 'application/octet-stream')
              .append('Authorization', localStorage.getItem('auth_token'))
          })
        .toPromise()
        .then(response => {
          resolve(response.body);
        }).catch(reason => reject(reason));
    });
  }

  obtenerHorasMesTerapeutaPdf(idTerapeuta: number, anio: number, mes: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "reportes/horas-mes-terapeuta-pdf/" + idTerapeuta + "?anio=" + anio + "&mes=" + mes,
          {
            withCredentials: true,
            observe: 'response',
            responseType: 'arraybuffer',
            headers: new HttpHeaders()
              .append('Content-Type', 'application/octet-stream')
              .append('Authorization', localStorage.getItem('auth_token'))
          })
        .toPromise()
        .then(response => {
          resolve(response.body);
        }).catch(reason => reject(reason));
    });
  }

  obtenerHorasMensualVocPdf(anio: number, mes: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "reportes/horas-mensual-voc-pdf?anio=" + anio + "&mes=" + mes,
          {
            withCredentials: true,
            observe: 'response',
            responseType: 'arraybuffer',
            headers: new HttpHeaders()
              .append('Content-Type', 'application/octet-stream')
              .append('Authorization', localStorage.getItem('auth_token'))
          })
        .toPromise()
        .then(response => {
          resolve(response.body);
        }).catch(reason => reject(reason));
    });
  }

}
