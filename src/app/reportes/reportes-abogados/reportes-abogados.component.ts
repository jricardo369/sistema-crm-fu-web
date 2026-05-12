import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { formatearFecha } from '../../util/date-utils';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog } from "@angular/material/dialog";
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
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';

@Component({
    standalone: true,
    imports: [RouterModule, FormsModule, WorkspaceNavComponent, ExperimentalMenuComponent, MatIconModule, MatDialogModule, MatProgressSpinnerModule, ReportesNavComponent, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatTabsModule, NgxEchartsDirective],
    selector: 'app-reportes-abogados',
    templateUrl: './reportes-abogados.component.html',
    styleUrls: ['./reportes-abogados.component.css'],
})
export class ReportesAbogadosComponent implements OnInit {

    cargando: boolean = false;

    fechaF: string = '';
    fechaI: string = '';
    filterStartDateMat: Date | null = null;
    filterEndDateMat: Date | null = null;
    verticalBarOptionsStates: EChartsCoreOption = {};

    arrReporteClientePorEstado: ReporteClientePorEstado[] = [];

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
    }

    limpiarFechas() {
        this.fechaI = "";
        this.fechaF = "";
    }

    onStartDateChange() {
        if (this.filterStartDateMat) {
            this.fechaI = formatearFecha(this.filterStartDateMat);
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

    private initVerticalBarChartStates(estados: ReporteClientePorEstado[]): void {

    const sortedEstados = [...estados].sort((a, b) => b.numeroSolicitudes - a.numeroSolicitudes);
    const codigos = sortedEstados.map(e => e.estado);
    const referencias = sortedEstados.map(e => e.numeroSolicitudes);
    const maxValue = Math.max(...referencias, 1);

    this.verticalBarOptionsStates = {
      title: {
        text: `Total de Referencias por Estado `,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const estado = params[0].name;
          const valor = params[0].value;
          return `Estado: ${estado}<br/>Referencias: ${valor}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: codigos,
        axisLabel: {
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'Referencias',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Referencias',
          type: 'bar',
          data: referencias,
          itemStyle: {
            color: (params: any) => {
              const ratio = params.value / maxValue;
              const r = Math.round(65 + (200 - 65) * (1 - ratio));
              const g = Math.round(148 + (220 - 148) * (1 - ratio));
              const b = Math.round(155 + (215 - 155) * (1 - ratio));
              return `rgb(${r}, ${g}, ${b})`;
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            formatter: '{c}'
          }
        }
      ]
    };
  }

}
