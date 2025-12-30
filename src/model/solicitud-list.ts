import { EstatusPago } from "./estatus-pago";
import { EstatusSolicitud } from "./estatus-solicitud";
import { TipoSolicitud } from "./tipo-solicitud";

export class SolicitudList {
    idSolicitud: number;
    fechaInicio: Date;
    cliente: string;
    telefono: string;
    email: string;
    docusign: string;
    amount: number;
    abogado: string;
    email_abogado: string;
    numeroDeCaso: string;
    idTipoSolicitud: number;
    idEstatusSolicitud: number;
    idEstatusPago: number;
    firmaAbogados: string;
    tipoSolicitud: TipoSolicitud;
    estatusSolicitud: EstatusSolicitud;
    estatusPago: EstatusPago;
    age: number;
    fecha_schedule: Date;
    idUsuarioRevisor: number;
    importante: string;
    usuarioRevisor: string;
    usuarioRevisando: string;
    idUsuarioRevisando: number;
    fecha_schedule_scales: Date;

    interviewMaster: boolean;
    usuarioRevisandoNombre: string;
    asignacionIntSc: boolean;
    tieneScale: boolean;
    usuarioCreacion: string;
}
