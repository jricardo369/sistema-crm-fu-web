import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URL } from '../app.config';
import { Observable } from 'rxjs';
import { TareaProgramada } from 'src/model/tarea-programada';

@Injectable({
	providedIn: 'root'
})
export class TareasProgramadasService {

	constructor(private http: HttpClient) { }

	getTareas(): Observable<TareaProgramada[]> {
		return this.http.get<TareaProgramada[]>(API_URL + 'tareas-programadas',
			{
				withCredentials: true,
				headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
			});
	}

	asignarVariable(tarea: TareaProgramada) {
		return this.http.put(API_URL + 'tareas-programadas', tarea, {
			withCredentials: true,
			headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token')),
			observe: 'response'
		}).toPromise();
	}

	ejecutarTarea(codigoTarea: string, fechai?: string, fechaf?: string) {
		return this.http.get(API_URL + 'tareas-programadas/ejecutar-tarea/' + codigoTarea + (fechai ? "?fechai=" + fechai : "") + (fechaf ? "&fechaf=" + fechaf : ""), {
			withCredentials: true,
			observe: 'response',
			headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
		}).toPromise();
	}

}
