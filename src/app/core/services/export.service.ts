import { Injectable } from '@angular/core';
import * as XLSX from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as Papa from 'papaparse';
import { PivotData } from '../models/financial-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  async exportToExcel(data: PivotData, filename: string = 'relatorio-financeiro'): Promise<void> {
    const workbook = new XLSX.Workbook();
    const worksheet = workbook.addWorksheet('Relatório Financeiro');

    worksheet.columns = [
      { header: 'Data', key: 'data', width: 15 },
      { header: 'Cliente/Fornecedor', key: 'cliente', width: 30 },
      { header: 'Tipo', key: 'tipo', width: 20 },
      { header: 'Valor da Conta', key: 'valor', width: 20 },
      { header: 'A Pagar/Receber', key: 'pagarReceber', width: 20 }
    ];

    data.rows.forEach(row => {
      this.addRowToWorksheet(worksheet, row, 0);
    });

    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `${filename}.xlsx`);
  }

  private addRowToWorksheet(worksheet: any, row: any, level: number): void {
    worksheet.addRow({
      data: row.label,
      cliente: ' '.repeat(level * 2) + row.label,
      valor: row.values['valorConta'],
      pagarReceber: row.values['aPagarReceber']
    });

    if (row.children) {
      row.children.forEach((child: any) => {
        this.addRowToWorksheet(worksheet, child, level + 1);
      });
    }
  }

  async exportToPDF(elementId: string, filename: string = 'relatorio-financeiro'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    
    const imgWidth = 280;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  }

  exportToCSV(data: any[], filename: string = 'relatorio-financeiro'): void {
    const csv = Papa.unparse(data, {
      delimiter: ';',
      header: true
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }

  exportToHTML(elementId: string, filename: string = 'relatorio-financeiro'): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório Financeiro</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          .negative { color: #f44336; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    saveAs(blob, `${filename}.html`);
  }

  printReport(elementId: string): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Imprimir Relatório</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          .negative { color: #f44336; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          window.print();
          window.onafterprint = function() { window.close(); }
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  }
}
