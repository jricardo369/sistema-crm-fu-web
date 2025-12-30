export class ReporteComparacionAnios {
  anioActual: number;
  anioAnterior: number;
  mesesAnioActual: ReporteComparacionAniosMes[];
  mesesAnioAnterior: ReporteComparacionAniosMes[];
  montoTotalAnioActual: number
	montoTotalAnioAnterior: number;
}

export class ReporteComparacionAniosMes {
  mes: string;
  mesNum: number;
  monto: number;
  numSolicitudes: number;
}
