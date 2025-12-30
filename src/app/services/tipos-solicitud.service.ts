import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { Solicitud } from "src/model/solicitud";
import { TipoSolicitud } from "src/model/tipo-solicitud";

@Injectable({
	providedIn: "root",
})
export class TiposSolicitudService {
	constructor(private http: HttpClient) { }

	obtenerTiposSolicitud(): Promise<TipoSolicitud[]> {
		return new Promise<TipoSolicitud[]>((resolve, reject) =>
			this.http
				.get(API_URL + "tipos-solicitud", {
					withCredentials: true,
					observe: "response",
					headers: new HttpHeaders()
						.append("Content-Type", "application/json")
						.append("Authorization", localStorage.getItem("auth_token")),
				})
				.toPromise()
				.then((response) => {
					resolve(response.body as TipoSolicitud[]);
				})
				.catch((reason) => reject(reason))
		);
	}

}
