import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { EmailAbogado } from 'src/model/email-abogado';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class EmailAbogadoService {

    constructor(private http: HttpClient) { }

    obtenerEmailsDeAbogado(idAbogado: number): Observable<EmailAbogado[]> {

        const url = API_URL + "email-abogado/" + idAbogado;

        return this.http.get<EmailAbogado[]>(url, {
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

    insertarEmailAbogado(idAbogado: number, emailAbo: string, idUsuario: number) {

        let nuevoEmailAbo = {
            email: emailAbo,
            idAbogado: idAbogado
        }

        let params = new HttpParams();
        params = params.set("idUsuario", idUsuario.toString());
        
        return new Promise((resolve, reject) => this.http
            .post(API_URL + 'email-abogado', nuevoEmailAbo,
                {
                    params: params,
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                console.log(response);
                resolve(response.body);
            })
            .catch(reason => reject(reason))
        );

    }

    eliminarEmailAbogado(idEmailAbogado: number) {
        return new Promise((resolve, reject) => this.http
            .delete(API_URL + 'email-abogado/' + idEmailAbogado,
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                resolve(response.body);
            })
            .catch(reason => reject(reason))
        );
    }

    actualizarEmailsAbo(idSolicitud: number, emailAbo: string) {
        
        return new Promise((resolve, reject) => this.http
            .put(API_URL + 'solicitudes/actualizar-emails-abo-sel/'+idSolicitud+"?emails="+emailAbo, {},
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                console.log(response);
                resolve(response.body);
            })
            .catch(reason => reject(reason))
        );

    }
}
