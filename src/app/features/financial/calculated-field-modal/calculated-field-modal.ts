import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Field, CalculatedField } from '../../../core/models/field.model';
import { CalculationService } from '../../../core/services/calculation.service';

interface CalculatorButton {
  label: string;
  value: string;
  type: 'operator' | 'function';
}

@Component({
  selector: 'app-calculated-field-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './calculated-field-modal.html',
  styleUrl: './calculated-field-modal.scss',
})
export class CalculatedFieldModal implements OnInit {
  fieldName = '';
  formula = '';
  searchTerm = '';
  availableFields: Field[] = [];
  isValid = false;

  calculatorButtons: CalculatorButton[][] = [
    [
      { label: '+', value: '+', type: 'operator' },
      { label: '-', value: '-', type: 'operator' },
      { label: '*', value: '*', type: 'operator' },
      { label: '/', value: '/', type: 'operator' },
      { label: '^', value: '^', type: 'operator' },
      { label: '%', value: '%', type: 'operator' },
      { label: '<', value: '<', type: 'operator' },
      { label: '>', value: '>', type: 'operator' },
      { label: '<=', value: '<=', type: 'operator' }
    ],
    [
      { label: '>=', value: '>=', type: 'operator' },
      { label: '=', value: '==', type: 'operator' },
      { label: '!=', value: '!=', type: 'operator' },
      { label: 'OR', value: 'OR', type: 'operator' },
      { label: 'AND', value: 'AND', type: 'operator' },
      { label: 'IF', value: 'IF()', type: 'function' },
      { label: 'ABS', value: 'ABS()', type: 'function' },
      { label: 'RD', value: 'RD()', type: 'function' },
      { label: 'MIN', value: 'MIN()', type: 'function' },
      { label: 'MAX', value: 'MAX()', type: 'function' }
    ]
  ];

  constructor(
    public dialogRef: MatDialogRef<CalculatedFieldModal>,
    @Inject(MAT_DIALOG_DATA) public data: { fields: Field[] },
    private calculationService: CalculationService
  ) {}

  ngOnInit(): void {
    this.availableFields = this.data.fields || [];
  }

  getAggregationLabel(field: Field): string {
    const labels: Record<string, string> = {
      'sum': 'Soma',
      'count': 'Contagem',
      'avg': 'Média',
      'min': 'Mínimo',
      'max': 'Máximo',
      'number': 'Soma',
      'string': 'Contagem',
      'date': 'Contagem'
    };
    return labels[field.aggregationType || field.type] || field.type;
  }

  get filteredFields(): Field[] {
    if (!this.searchTerm) {
      return this.availableFields;
    }
    return this.availableFields.filter(field =>
      field.displayName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addFieldToFormula(field: Field): void {
    const aggregation = field.aggregationType || 'sum';
    const fieldReference = `${aggregation}("${field.displayName}")`;
    this.insertAtCursor(fieldReference);
    this.validateFormula();
  }

  addToFormula(value: string): void {
    this.insertAtCursor(value);
    this.validateFormula();
  }

  private insertAtCursor(text: string): void {
    const textarea = document.querySelector('.formula-editor') as HTMLTextAreaElement;
    if (!textarea) {
      this.formula += text;
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = this.formula.substring(0, start);
    const after = this.formula.substring(end);

    this.formula = before + text + after;

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  }

  validateFormula(): void {
    if (!this.formula.trim()) {
      this.isValid = false;
      return;
    }

    const fieldIds = this.availableFields.map(field => field.id);
    this.isValid = this.calculationService.validateFormula(this.formula, fieldIds);
  }

  clearFormula(): void {
    this.formula = '';
    this.isValid = false;
  }

  apply(): void {
    if (!this.isValid || !this.fieldName.trim()) {
      return;
    }

    const fieldIds = this.availableFields.map(field => field.id);
    const calculatedField: CalculatedField = {
      id: `calc_${Date.now()}`,
      name: this.fieldName,
      displayName: this.fieldName,
      type: 'number',
      formula: this.formula,
      dependencies: this.calculationService.extractDependencies(this.formula, fieldIds)
    };

    this.dialogRef.close(calculatedField);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
