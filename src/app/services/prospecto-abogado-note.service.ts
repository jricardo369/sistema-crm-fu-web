import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_URL } from '../app.config';
import { catchError } from 'rxjs/operators'; 
import { NotaProspectoAbogado } from 'src/model/nota-prospecto-abogado';

@Injectable({
  providedIn: 'root'
})
export class ProspectoAbogadoNoteService {

  constructor(private http: HttpClient) { }

  obtenerProspectoAbogadoNotasPorId(idProspectoAbogado: number): Observable<NotaProspectoAbogado[]> {

    let queryParams: string = '?' + 'idUsuario=' + JSON.parse(localStorage.getItem("objUsuario")).idUsuario;

    const url = API_URL + 'notas-prospecto-abogado/' + idProspectoAbogado + queryParams;

    return this.http.get<NotaProspectoAbogado[]>(url, {
      withCredentials: true,
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('auth_token') || ''
      })
    }).pipe(
      catchError(error => {
        console.error('Error:', error);
        // Devuelve un arreglo vacío en caso de error
        return of([] as NotaProspectoAbogado[]);
      })
    );

  }

  insertarProspectoAbogadoNota(nota: NotaProspectoAbogado): Promise<any> {
       let nuevoProspecto = {
         descripcion: nota.descripcion,
         idProspectoAbogado: nota.idProspectoAbogado,
         idUsuario: nota.idUsuario
       }
   
       return new Promise<any>((resolve, reject) =>
         this.http
           .post(API_URL + "notas-prospecto-abogado", nuevoProspecto, {
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


}