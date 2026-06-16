import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTitleSubtitle, ApexYAxis } from 'ng-apexcharts';
import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { formatearFecha } from '../../util/date-utils';
import { UtilService } from 'src/app/services/util.service';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ReporteClientePorEstado } from 'src/model/reporte-cliente-por-estado';

import { inject } from '@angular/core';
import { ReporteClientePorFirma } from 'src/model/reporte-cliente-por-firma';
import { ReporteClientePorFirmaAnioMes } from 'src/model/reporte-cliente-por-firma-anio-mes';


interface EstadoData {
  estado: string;
  referencias: number;
}

interface EstadoApiItem {
  estado: string;
  numeroSolicitudes: number;
}

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, WorkspaceNavComponent, ExperimentalMenuComponent, MatIconModule, MatDialogModule, MatProgressSpinnerModule, ReportesNavComponent, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatTabsModule, NgApexchartsModule],
  selector: 'app-reportes-abogados',
  templateUrl: './reportes-abogados.component.html',
  styleUrls: ['./reportes-abogados.component.css']
})
export class ReportesAbogadosComponent implements OnInit {

  private http = inject(HttpClient);

  arrReporteClientePorEstado: ReporteClientePorEstado[] = [];
  arrReporteClientePorFirma: ReporteClientePorFirma[] = [];
  arrReporteClientePorFirmaAnioMes: ReporteClientePorFirmaAnioMes[] = [];

  cargando: boolean = false;

  fechaF: string = '';
  fechaI: string = '';
  filterStartDateMat: Date | null = null;
  filterEndDateMat: Date | null = null;

  public chartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
    colors: string[];
  } = {
      series: [],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            colors: ['#333']
          }
        }
      },
      yaxis: {
        title: {
          text: 'Customers files',
          style: {
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            color: '#333'
          }
        },
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            colors: ['#333']
          }
        }
      },
      dataLabels: {
        enabled: true
      },
      title: {
        text: '',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          fontFamily: 'Roboto, Arial, Helvetica, sans-serif'
        }
      },
      colors: ['#00949b']
    };
  
  
  



  expandedRow: number | null = null;
  constructor(
    private reportesService: ReportesService,
    private utilService: UtilService,
  ) {

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.filterStartDateMat = date;

    var dateEnd = new Date();
    this.filterEndDateMat = dateEnd;

    this.fechaI = formatearFecha(this.filterStartDateMat);
    this.fechaF = formatearFecha(this.filterEndDateMat);

  }

  ngOnInit(): void {
    this.obtenerClientesPorEstado();
    this.obtenerClientesPorFirma();
    this.obtenerClientesPorFirmaAnioMes();
  }

  limpiarFechas() {
    this.fechaI = "";
    this.fechaF = "";
  }

  onStartDateChange() {
    if (this.filterStartDateMat) {
      this.fechaI = formatearFecha(this.filterStartDateMat);
      this.obtenerClientesPorEstado();
      this.obtenerClientesPorFirma();
    this.obtenerClientesPorFirmaAnioMes();
    } else {
      this.fechaI = "";
    }
  }

  onEndDateChange() {
    if (this.filterEndDateMat) {
      this.fechaF = formatearFecha(this.filterEndDateMat);
    } else {
      this.fechaF = "";
    }
  }

  obtenerClientesPorEstado() {
    this.cargando = true;
    this.reportesService.obtenerClientesPorEstado(this.fechaI, this.fechaF)
      .then((rep) => {
        this.arrReporteClientePorEstado = rep;
        this.initVerticalBarChartStates(this.arrReporteClientePorEstado);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerClientesPorFirma() {
    this.cargando = true;
    this.reportesService.obtenerClientesPorFirma(this.fechaI, this.fechaF)
      .then((rep) => {
        this.arrReporteClientePorFirma = rep;
        this.initVerticalBarChartFirma(this.arrReporteClientePorFirma);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerClientesPorFirmaAnioMes() {
    this.cargando = true;
    this.reportesService.obtenerClientesPorFirmaAnioMes(this.fechaI, this.fechaF)
      .then((rep) => {
        this.arrReporteClientePorFirmaAnioMes = rep;
        this.initFirmasPorMesChart(this.arrReporteClientePorFirmaAnioMes);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  private initVerticalBarChartStates(estados: ReporteClientePorEstado[]): void {
    const sortedEstados = Array.isArray(estados) ? [...estados].sort((a, b) => b.numeroSolicitudes - a.numeroSolicitudes) : [];
    const codigos = sortedEstados.map(e => e.estado);
    const referencias = sortedEstados.map(e => e.numeroSolicitudes);
    // Degradado dinámico
    const max = Math.max(...referencias);
    const min = Math.min(...referencias);
    const baseColor = [0, 148, 155]; // #00949b
    const minColor = [200, 240, 242]; // celeste claro, no blanco
    let colors: string[];
    if (max === min) {
      colors = referencias.map((_, i, arr) => {
        const t = arr.length <= 1 ? 1 : i / (arr.length - 1);
        const r = Math.round(baseColor[0] + (minColor[0] - baseColor[0]) * (1 - t));
        const g = Math.round(baseColor[1] + (minColor[1] - baseColor[1]) * (1 - t));
        const b = Math.round(baseColor[2] + (minColor[2] - baseColor[2]) * (1 - t));
        return `rgb(${r},${g},${b})`;
      });
    } else {
      colors = referencias.map(val => {
        const t = (val - min) / (max - min);
        const t2 = 0.2 + 0.8 * t;
        const r = Math.round(baseColor[0] + (minColor[0] - baseColor[0]) * (1 - t2));
        const g = Math.round(baseColor[1] + (minColor[1] - baseColor[1]) * (1 - t2));
        const b = Math.round(baseColor[2] + (minColor[2] - baseColor[2]) * (1 - t2));
        return `rgb(${r},${g},${b})`;
      });
    }
    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: 'Referencias',
        data: Array.isArray(referencias) ? referencias : []
      }],
      xaxis: {
        categories: Array.isArray(codigos) ? codigos : []
      },
      colors
    };
  
  
  
  }


  public chartOptionsFirma: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: any;
    colors: string[];
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
    series: [],
    chart: {
      type: 'bar',
      height: 500,
      toolbar: { show: false },
      animations: { enabled: true },
      width: '100%',
      stacked: false
    },
    plotOptions: {
      bar: {
        columnWidth: '25%',
        borderRadius: 12,
        distributed: true,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all'
      }
    },
    colors: ['#9c27b0'],
      xaxis: {
        categories: [],
        labels: {
          rotate: -45,
          style: {
            fontSize: '11px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            colors: ['#333']
          }
        }
      },
    yaxis: {
      title: {
        text: 'Lawyers offices',
        style: {
          fontSize: '13px',
          fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
          color: '#333'
        }
      },
      labels: {
        style: {
          fontSize: '13px',
          fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
          colors: ['#333']
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    title: {
      text: '',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Roboto, Arial, Helvetica, sans-serif'
      }
    }
  };
  
  
  

  private initVerticalBarChartFirma(abogados: ReporteClientePorFirma[]): void {
    const sortedAbogados = Array.isArray(abogados) ? [...abogados].sort((a, b) => b.total - a.total) : [];
    const correos = sortedAbogados.map(a => a.email);
    const referencias = sortedAbogados.map(a => a.total);
    // Generar colores degradados notoriamente distintos aunque los valores sean parecidos
    const max = Math.max(...referencias);
    const min = Math.min(...referencias);
    const baseColor = [156, 39, 176]; // #9c27b0
    const minColor = [230, 200, 240]; // lila claro, no blanco
    // Si todos los valores son iguales, forzar un degradado artificial
    let colors: string[];
    if (max === min) {
      colors = referencias.map((_, i, arr) => {
        // Espaciar el degradado artificialmente
        const t = arr.length <= 1 ? 1 : i / (arr.length - 1);
        const r = Math.round(baseColor[0] + (minColor[0] - baseColor[0]) * (1 - t));
        const g = Math.round(baseColor[1] + (minColor[1] - baseColor[1]) * (1 - t));
        const b = Math.round(baseColor[2] + (minColor[2] - baseColor[2]) * (1 - t));
        return `rgb(${r},${g},${b})`;
      });
    } else {
      colors = referencias.map(val => {
        // Normalizar valor entre 0 y 1
        const t = (val - min) / (max - min);
        // Forzar que el degradado nunca sea menor a 0.2 (más notorio)
        const t2 = 0.2 + 0.8 * t;
        const r = Math.round(baseColor[0] + (minColor[0] - baseColor[0]) * (1 - t2));
        const g = Math.round(baseColor[1] + (minColor[1] - baseColor[1]) * (1 - t2));
        const b = Math.round(baseColor[2] + (minColor[2] - baseColor[2]) * (1 - t2));
        return `rgb(${r},${g},${b})`;
      });
    }
    this.chartOptionsFirma = {
      ...this.chartOptionsFirma,
      series: [{
        name: 'Referencias',
        data: Array.isArray(referencias) ? referencias : []
      }],
      colors,
      plotOptions: {
        bar: {
          columnWidth: '25%',
          borderRadius: 3,
          distributed: true,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
        }
      },
      xaxis: {
        categories: Array.isArray(correos)
          ? correos.map(email => {
              const emailStr = (email ?? '').toString();
              if (emailStr.includes('@')) {
                return emailStr.split('@')[0];
              }
              return emailStr;
            })
          : [],
        labels: {
          rotate: -45,
          style: {
            fontSize: '11px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            colors: ['#333']
          }
        }
      }
    };
  }

   private readonly MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


  public chartOptionsFirmasPorMes: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: 'Number of new offices',
      }
    },
    dataLabels: {
      enabled: true
    },
    title: {
      text: '',
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333'
      }
    }
  };

  private initFirmasPorMesChart(data: ReporteClientePorFirmaAnioMes[]): void {
    const items = Array.isArray(data) ? [...data].sort((a, b) => a.anio - b.anio || a.mes - b.mes) : [];
    const labels = items.map(d => `${this.MONTH_NAMES[d.mes - 1]} ${d.anio}`);
    const values = items.map(d => d.total);
    this.chartOptionsFirmasPorMes = {
      ...this.chartOptionsFirmasPorMes,
      series: [{
        name: 'New lawyer offices with files',
        data: Array.isArray(values) ? values : []
      }],
      xaxis: {
        categories: Array.isArray(labels) ? labels : [],
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            colors: ['#333']
          }
        }
      },
      yaxis: {
        title: {
          text: 'Number of new offices',
          style: {
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            color: '#333'
          }
        },
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            colors: ['#333']
          }
        }
      },
      title: {
        text: '',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          fontFamily: 'Roboto, Arial, Helvetica, sans-serif'
        }
      }
    };
  }


}
