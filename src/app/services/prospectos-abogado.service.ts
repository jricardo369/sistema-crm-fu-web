import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { API_URL } from "../app.config";
import { ProspectoAbogado } from "src/model/prospecto-abogado";

@Injectable({
  providedIn: "root",
})
export class ProspectosAbogadoService {
  constructor(private http: HttpClient) { }

  obtenerProspectosAbogado(fechai: string, fechaf: string, idUsuario: number, estatus: string,
    estado: string, telefono: string,lawFirmOrContactName: string, email: string,
    mailPackageReceived: string, emailSent: string, porcentaje20: string, followUp20Porcent: string, prospectSentClient: string
  ): Observable<ProspectoAbogado[]> {

    let queryParams: string = "";
    queryParams = "fechai=" + fechai + "&fechaf=" + fechaf + "&idUsuario=" + idUsuario + "&estatus=" + estatus+
    "&estado=" + estado + "&telefono=" + telefono + "&lawFirmOrContactName=" + lawFirmOrContactName + "&email=" + email +
    "&mailPackageReceived=" + mailPackageReceived + "&emailSent=" + emailSent + "&porcentaje20=" + porcentaje20 + "&followUp20Porcent=" + followUp20Porcent + "&prospectSentClient=" + prospectSentClient;


    const url = API_URL + "prospecto-abogado" + "?" + queryParams;

    return this.http.get<ProspectoAbogado[]>(url, {
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

  obtenerProspectoAbogadoPorId(idProspectoAbogado: number): Observable<ProspectoAbogado> {

    const url = API_URL + "prospecto-abogado/" + idProspectoAbogado;

    return this.http.get<ProspectoAbogado>(url, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('auth_token') || ''
      })
    }).pipe(
      catchError(error => {
        console.error('Error:', error);
        // Devuelve null tipado como ProspectoAbogado en caso de error
        return of(null as unknown as ProspectoAbogado);
      })
    );

  }

 insertarProspectoAbogado(prospecto: ProspectoAbogado,arrEmailAbogadosN: string[]): Promise<any> {
     let nuevoProspecto = {
       fechaAlta: prospecto.fechaAlta,
       firma: prospecto.firma,
       nombre: prospecto.nombre,
       telefono: prospecto.telefono,
       idUsuario: prospecto.idUsuario
     }
 
     let params = new HttpParams();
     params = params.set("idUsuario", prospecto.idUsuario);
     return new Promise<any>((resolve, reject) =>
       this.http
         .post(API_URL + "prospecto-abogado"+"?emailsAbogado="+arrEmailAbogadosN, nuevoProspecto, {
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

  actualizarProspectoAbogado(prospecto: ProspectoAbogado, idEstatusProspecto: number, idUsuario: number, motivo: string): Promise<any> {
    if (idEstatusProspecto != 0) {
      prospecto.idEstatusProspecto = idEstatusProspecto;
    }
    let c = '';
    c = "?idUsuario=" + idUsuario + "&motivo=" + motivo;

    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "prospecto-abogado" + c, prospecto, {
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

  obtenerProspectosAbogadosPorMail(nombre: string): Promise<ProspectoAbogado[]> {
    return new Promise<ProspectoAbogado[]>((resolve, reject) => this.http
      .get(API_URL + 'prospecto-abogado/mails-por-nombre/' + nombre,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body as ProspectoAbogado[]);
      })
      .catch(reason => reject(reason))
    );
  }

  

}
