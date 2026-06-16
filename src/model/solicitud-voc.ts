export class SolicitudVoc {
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
  tipoSolicitud: string;
  estatusSolicitud: string;
  estatusPago: string;
  age: string;
  importantNotes: string;
  comentario: string;
  fechaNacimiento: Date | string;
  adicional: string;
  idioma: string;
  tipoEntrevista: string;
  direccion: string;
  estado: string;
  referencia: string;
  apellidos: string;
  paralegalName: string;
  paralegalEmails: string;
  paralegalTelefonos: string;
  numSesiones: number;
  numSchedules: number;
  sesionesPendientes: number;
  documento1: boolean;
  fechaDoc1: Date | string;
  documento2: boolean;
  fechaDoc2: Date | string;
  terapeuta: number;
  usuarioRevisando: number;
  apellidosSinNull: string;
  code: string;
  nombreTerapeuta: string;
  sexo: string;
  purposeTreatament: string;
  participation: string;
  recommendations: string;

  nombreDelPadre: string;
  consejera: string;
  nombreEscuela: string;
  lenguajePreferente: string;

  numCitasTerapeutasPorSolicitud: string[];
  info: string;

}
