import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { API_URL } from "../app.config";
import { EstatusProspectoAbogado } from "src/model/estatus-prospecto-abogado";

@Injectable({
  providedIn: "root",
})
export class EstatusProspectosAbogadoService {
  constructor(private http: HttpClient) { }


  obtenerEstatusProspectosAbogado(): Observable<EstatusProspectoAbogado[]> {

    const url = API_URL + "estatus-prospecto-abogado/";

    return this.http.get<EstatusProspectoAbogado[]>(url, {
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

  

}
