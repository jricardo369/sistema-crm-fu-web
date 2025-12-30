import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Abogado } from 'src/model/abogado';
import { API_URL } from '../app.config';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class  AbogadosService {

    abogadoPromise: Promise<Abogado> = null;

    constructor(private http: HttpClient) { }

    obtenerAbogadosPorNombre(nombre: string): Promise<Abogado[]> {
        return new Promise<Abogado[]>((resolve, reject) => this.http
            .get(API_URL + 'abogados/por-nombre/' + nombre,
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                resolve(response.body as Abogado[]);
            })
            .catch(reason => reject(reason))
        );
    }

    obtenerAbogadosEmailsPorNombre(nombre: string): Promise<Abogado[]> {
        return new Promise<Abogado[]>((resolve, reject) => this.http
            .get(API_URL + 'abogados/mails-por-nombre/' + nombre,
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                resolve(response.body as Abogado[]);
            })
            .catch(reason => reject(reason))
        );
    }

     obtenerUsuarioPorId(idAbogado: number): Promise<Abogado> {

        /*this.abogadoPromise = new Promise((resolve, reject) =>
          this.http
            .get(API_URL + "abogados/" + idAbogado, {
              withCredentials: true,
              observe: "response",
              headers: new HttpHeaders()
                .append("Content-Type", "application/json")
                .append("Authorization", localStorage.getItem("auth_token")),
            })
            .toPromise()
            .then((response) => {
              resolve(response.body as Abogado);
            })
            .catch((reason) => reject(reason))
        );*/

        return this.http
    .get<Abogado>(API_URL + "abogados/" + idAbogado, {
      observe: 'response',
      withCredentials: true,
      headers: new HttpHeaders()
        .append("Content-Type", "application/json")
        .append("Authorization", localStorage.getItem("auth_token") || ''),
    })
    .toPromise()
    .then((response: HttpResponse<Abogado>) => {
      return response.body as Abogado;
    });

        //return this.abogadoPromise;
      }

    obtenerAbogados(): Promise<Abogado[]> {
        return new Promise<Abogado[]>((resolve, reject) =>
          this.http
            .get(API_URL + "abogados", {
              withCredentials: true,
              observe: "response",
              headers: new HttpHeaders()
                .append("Content-Type", "application/json")
                .append("Authorization", localStorage.getItem("auth_token")),
            })
            .toPromise()
            .then((response) => {
              resolve(response.body as Abogado[]);
            })
            .catch((reason) => reject(reason))
        );
      }

    insertarAbogado(abogado: Abogado,arrEmailAbogadosN: string[],idUsuario: number): Promise<Abogado> {
        this.abogadoPromise = new Promise((resolve, reject) =>
          this.http
            .post(API_URL + "abogados?emailsAbogado="+arrEmailAbogadosN+"&idUsuario="+idUsuario, abogado, {
              withCredentials: true,
              observe: "response",
              headers: new HttpHeaders()
                .append("Content-Type", "application/json")
                .append("Authorization", localStorage.getItem("auth_token")),
            })
            .toPromise()
            .then((response) => {
              resolve(response.body as Abogado);
            })
            .catch((reason) => reject(reason))
        );
        return this.abogadoPromise;
      }
    
      editarAbogado(usuario: Abogado): Promise<Abogado> {
        this.abogadoPromise = new Promise((resolve, reject) =>
          this.http
            .put(API_URL + "abogados", usuario, {
              withCredentials: true,
              observe: "response",
              headers: new HttpHeaders()
                .append("Content-Type", "application/json")
                .append("Authorization", localStorage.getItem("auth_token")),
            })
            .toPromise()
            .then((response) => {
              resolve(response.body as Abogado);
            })
            .catch((reason) => reject(reason))
        );
        return this.abogadoPromise;
      }
    
      eliminarAbogado(idUsuario: number): Promise<Abogado> {
        this.abogadoPromise = new Promise((resolve, reject) =>
          this.http
            .delete(API_URL + "abogados/" + idUsuario, {
              withCredentials: true,
              observe: "response",
              headers: new HttpHeaders()
                .append("Content-Type", "application/json")
                .append("Authorization", localStorage.getItem("auth_token")),
            })
            .toPromise()
            .then((response) => {
              resolve(response.body as Abogado);
            })
            .catch((reason) => reject(reason))
        );
        return this.abogadoPromise;
      }

      obtenerAbogadosExcel(): Observable<Blob> {
        
        const httpHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('auth_token'),
        });
        const options = {
          headers: httpHeaders,
          responseType: 'blob' as 'json'
        };
        return this.http.get<any>(
            
            API_URL + 'abogados/excel',
            options
        );
      
        }

}