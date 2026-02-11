import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PivotDataService } from '../../../core/services/pivot-data.service';
import { Subscription } from 'rxjs';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-chart-viewer',
  imports: [
    CommonModule,
    BaseChartDirective,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './chart-viewer.html',
  styleUrl: './chart-viewer.scss',
})
export class ChartViewer implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };
  private configSubscription?: Subscription;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(context.parsed.y as number);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0
            }).format(value as number);
          }
        }
      }
    }
  };

  availableChartTypes = [
    { id: 'bar', label: 'Gráfico de Barras', icon: 'bar_chart' },
    { id: 'horizontalBar', label: 'Gráfico de Barras Horizontais', icon: 'align_horizontal_left' },
    { id: 'line', label: 'Gráfico de Linha', icon: 'show_chart' },
    { id: 'pie', label: 'Gráfico de Pizza', icon: 'pie_chart' },
    { id: 'doughnut', label: 'Gráfico de Rosca', icon: 'donut_large' },
    { id: 'radar', label: 'Gráfico de Radar', icon: 'radar' }
  ];

  selectedChartTypeId = 'bar';

  constructor(
    private pivotService: PivotDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Inscrever nas mudanças de configuração para atualização instantânea
    this.configSubscription = this.pivotService.config$.subscribe(() => {
      this.loadChartData();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
  }

  loadChartData(): void {
    const pivotData = this.pivotService.generatePivotData();
    
    // Se não há dados do pivot, buscar dados brutos
    if (!pivotData.rows || pivotData.rows.length === 0) {
      this.loadRawData();
      return;
    }

    const labels = pivotData.rows.map(row => row.label);

    // Procurar chaves que contém os valores - verificar múltiplas variações
    const receivableValues = pivotData.rows.map(row => {
      // Procurar por várias variações de chaves para Receber
      const keys = Object.keys(row.values);
      let key = keys.find(k => k.toLowerCase().includes('receber'));
      
      // Se não encontrou, verificar se é um valor positivo
      if (!key) {
        const positiveKey = keys.find(k => {
          const val = row.values[k];
          return typeof val === 'number' && val > 0;
        });
        if (positiveKey) key = positiveKey;
      }
      
      return key ? Math.abs(row.values[key]) : 0;
    });

    const payableValues = pivotData.rows.map(row => {
      // Procurar por várias variações de chaves para Pagar
      const keys = Object.keys(row.values);
      let key = keys.find(k => k.toLowerCase().includes('pagar'));
      
      // Se não encontrou, verificar se é um valor negativo
      if (!key) {
        const negativeKey = keys.find(k => {
          const val = row.values[k];
          return typeof val === 'number' && val < 0;
        });
        if (negativeKey) key = negativeKey;
      }
      
      return key ? Math.abs(row.values[key]) : 0;
    });

    // Se não encontrou dados separados, usar dados brutos por tipo
    const hasReceivable = receivableValues.some(v => v > 0);
    const hasPayable = payableValues.some(v => v > 0);

    if (!hasReceivable || !hasPayable) {
      this.loadDataByType();
      return;
    }

    // Cores para gráficos de pizza/rosca
    const greenColors = this.generateColors('green', labels.length);
    const redColors = this.generateColors('red', labels.length);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Contas a Receber',
          data: receivableValues,
          backgroundColor: this.isPieOrDoughnut() ? greenColors : 'rgba(76, 175, 80, 0.6)',
          borderColor: this.isPieOrDoughnut() ? greenColors.map(() => 'rgba(76, 175, 80, 1)') : 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
          fill: this.selectedChartTypeId === 'radar'
        },
        {
          label: 'Contas a Pagar',
          data: payableValues,
          backgroundColor: this.isPieOrDoughnut() ? redColors : 'rgba(244, 67, 54, 0.6)',
          borderColor: this.isPieOrDoughnut() ? redColors.map(() => 'rgba(244, 67, 54, 1)') : 'rgba(244, 67, 54, 1)',
          borderWidth: 1,
          fill: this.selectedChartTypeId === 'radar'
        }
      ]
    };

    this.chart?.update();
  }

  private loadDataByType(): void {
    // Obter dados brutos e agrupar por data/label com separação por tipo
    const config = this.pivotService.configSubject.value;
    const pivotData = this.pivotService.generatePivotData();
    
    if (!pivotData.rows || pivotData.rows.length === 0) {
      this.loadRawData();
      return;
    }

    const labels = pivotData.rows.map(row => row.label);
    
    // Calcular valores baseados nos rawData de cada row
    const receivableValues = pivotData.rows.map(row => {
      if (!row.rawData) return 0;
      return row.rawData
        .filter((r: any) => r.tipo === 'Contas a Receber')
        .reduce((sum: number, r: any) => sum + Math.abs(r.valorConta || 0), 0);
    });

    const payableValues = pivotData.rows.map(row => {
      if (!row.rawData) return 0;
      return row.rawData
        .filter((r: any) => r.tipo === 'Contas a Pagar')
        .reduce((sum: number, r: any) => sum + Math.abs(r.valorConta || 0), 0);
    });

    const greenColors = this.generateColors('green', labels.length);
    const redColors = this.generateColors('red', labels.length);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Contas a Receber',
          data: receivableValues,
          backgroundColor: this.isPieOrDoughnut() ? greenColors : 'rgba(76, 175, 80, 0.6)',
          borderColor: this.isPieOrDoughnut() ? greenColors.map(() => 'rgba(76, 175, 80, 1)') : 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
          fill: this.selectedChartTypeId === 'radar'
        },
        {
          label: 'Contas a Pagar',
          data: payableValues,
          backgroundColor: this.isPieOrDoughnut() ? redColors : 'rgba(244, 67, 54, 0.6)',
          borderColor: this.isPieOrDoughnut() ? redColors.map(() => 'rgba(244, 67, 54, 1)') : 'rgba(244, 67, 54, 1)',
          borderWidth: 1,
          fill: this.selectedChartTypeId === 'radar'
        }
      ]
    };

    this.chart?.update();
  }

  private isPieOrDoughnut(): boolean {
    return this.selectedChartTypeId === 'pie' || this.selectedChartTypeId === 'doughnut';
  }

  private generateColors(baseColor: string, count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const opacity = 0.4 + (i * 0.05);
      if (baseColor === 'green') {
        colors.push(`rgba(76, 175, 80, ${Math.min(opacity, 0.9)})`);
      } else {
        colors.push(`rgba(244, 67, 54, ${Math.min(opacity, 0.9)})`);
      }
    }
    return colors;
  }

  private loadRawData(): void {
    // Dados exemplo para demonstração
    this.chartData = {
      labels: ['23/03/2025', '24/03/2025', '26/03/2025'],
      datasets: [
        {
          label: 'Contas a Receber',
          data: [0, 32185.75, 0],
          backgroundColor: 'rgba(76, 175, 80, 0.6)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1
        },
        {
          label: 'Contas a Pagar',
          data: [622.94, 19867.40, 1041.80],
          backgroundColor: 'rgba(244, 67, 54, 0.6)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  changeChartType(type: string): void {
    this.selectedChartTypeId = type;
    
    // Resetar opções para o padrão
    this.chartOptions = this.getDefaultOptions();

    if (type === 'pie' || type === 'doughnut') {
      this.chartType = type as ChartType;
      this.chartOptions = {
        ...this.chartOptions,
        scales: undefined,
        plugins: {
          ...this.chartOptions?.plugins,
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed as number;
                const formatted = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value);
                return `${label}: ${formatted}`;
              }
            }
          }
        }
      };
    } else if (type === 'horizontalBar') {
      this.chartType = 'bar';
      this.chartOptions = {
        ...this.chartOptions,
        indexAxis: 'y',
        scales: {
          x: {
            ticks: {
              callback: (value) => {
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0
                }).format(value as number);
              }
            }
          }
        }
      } as ChartConfiguration['options'];
    } else if (type === 'line') {
      this.chartType = 'line';
      this.chartOptions = {
        ...this.chartOptions,
        elements: {
          line: {
            tension: 0.3
          }
        }
      };
    } else if (type === 'radar') {
      this.chartType = 'radar';
      this.chartOptions = {
        ...this.chartOptions,
        scales: undefined
      };
    } else {
      this.chartType = type as ChartType;
    }

    // Recarregar dados para aplicar cores corretas ao tipo
    this.loadChartData();
    this.cdr.markForCheck();
  }

  getCurrentChartLabel(): string {
    const found = this.availableChartTypes.find(t => t.id === this.selectedChartTypeId);
    return found ? found.label : 'Gráfico de Barras';
  }

  getCurrentChartIcon(): string {
    const found = this.availableChartTypes.find(t => t.id === this.selectedChartTypeId);
    return found ? found.icon : 'bar_chart';
  }

  isCurrentChartType(typeId: string): boolean {
    return this.selectedChartTypeId === typeId;
  }

  private getDefaultOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y as number);
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0
              }).format(value as number);
            }
          }
        }
      }
    };
  }
}
