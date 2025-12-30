import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MotivoCancel } from 'src/model/motivo-cancel';
import { API_URL } from '../app.config';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class  MotivoCancelService {

  abogadoPromise: Promise<MotivoCancel> = null;

  constructor(private http: HttpClient) { }

  async obtenerMotivosCancel(tipo: string,idUsuario: number): Promise<MotivoCancel[]> {

    const url = `${API_URL}motivos-cancel/${tipo}`+`?idUsuario=${idUsuario}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('auth_token') || ''
    });

    try {
      const response = await lastValueFrom(
        this.http.get<MotivoCancel[]>(url, {
          withCredentials: true,
          headers: headers
        })
      );
      return response;
    } catch (error) {
      throw error;
    }

  }

     
}