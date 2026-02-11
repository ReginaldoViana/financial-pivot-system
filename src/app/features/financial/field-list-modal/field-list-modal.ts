import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { Field } from '../../../core/models/field.model';
import { PivotConfig } from '../../../core/models/pivot-config.model';
import { PivotDataService } from '../../../core/services/pivot-data.service';
import { CalculatedFieldModal } from '../calculated-field-modal/calculated-field-modal';

@Component({
  selector: 'app-field-list-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    DragDropModule,
    FormsModule
  ],
  templateUrl: './field-list-modal.html',
  styleUrl: './field-list-modal.scss',
})
export class FieldListModal implements OnInit {
  searchTerm = '';
  availableFields: Field[] = [];
  selectedFields: Field[] = [];

  filterFields: Field[] = [];
  rowFields: Field[] = [];
  columnFields: Field[] = [];
  valueFields: Field[] = [];

  constructor(
    public dialogRef: MatDialogRef<FieldListModal>,
    @Inject(MAT_DIALOG_DATA) public data: { config: PivotConfig },
    private pivotService: PivotDataService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.availableFields = this.pivotService.getAvailableFields();

    if (this.data.config) {
      this.rowFields = [...this.data.config.rows];
      this.columnFields = [...this.data.config.columns];
      this.valueFields = [...this.data.config.values];
      this.filterFields = this.data.config.filters?.map(filter =>
        this.availableFields.find(field => field.id === filter.fieldId)
      ).filter((field): field is Field => !!field) || [];
    }

    this.updateSelectedFields();
  }

  get filteredFields(): Field[] {
    if (!this.searchTerm) {
      return this.availableFields;
    }
    return this.availableFields.filter(field =>
      field.displayName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isFieldSelected(field: Field): boolean {
    return this.selectedFields.some(f => f.id === field.id);
  }

  toggleFieldSelection(field: Field, event: any): void {
    if (event.checked) {
      if (!this.isFieldUsed(field)) {
        if (field.type === 'number') {
          this.valueFields.push({ ...field, aggregationType: 'sum' });
        } else {
          this.rowFields.push(field);
        }
      }
    } else {
      this.removeFieldFromAll(field);
    }
    this.updateSelectedFields();
  }

  private isFieldUsed(field: Field): boolean {
    return this.rowFields.some(f => f.id === field.id) ||
      this.columnFields.some(f => f.id === field.id) ||
      this.valueFields.some(f => f.id === field.id) ||
      this.filterFields.some(f => f.id === field.id);
  }

  private removeFieldFromAll(field: Field): void {
    this.rowFields = this.rowFields.filter(f => f.id !== field.id);
    this.columnFields = this.columnFields.filter(f => f.id !== field.id);
    this.valueFields = this.valueFields.filter(f => f.id !== field.id);
    this.filterFields = this.filterFields.filter(f => f.id !== field.id);
  }

  private updateSelectedFields(): void {
    this.selectedFields = [
      ...this.rowFields,
      ...this.columnFields,
      ...this.valueFields,
      ...this.filterFields
    ];
  }

  drop(event: CdkDragDrop<Field[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateSelectedFields();
  }

  removeField(field: Field, area: 'filter' | 'row' | 'column' | 'value'): void {
    switch (area) {
      case 'filter':
        this.filterFields = this.filterFields.filter(f => f.id !== field.id);
        break;
      case 'row':
        this.rowFields = this.rowFields.filter(f => f.id !== field.id);
        break;
      case 'column':
        this.columnFields = this.columnFields.filter(f => f.id !== field.id);
        break;
      case 'value':
        this.valueFields = this.valueFields.filter(f => f.id !== field.id);
        break;
    }
    this.updateSelectedFields();
  }

  changeAggregation(field: Field, type: string): void {
    const valueField = this.valueFields.find(f => f.id === field.id);
    if (valueField) {
      valueField.aggregationType = type as any;
    }
  }

  openCalculatedFieldModal(): void {
    // Filtrar apenas campos numéricos para uso em cálculos
    const numericFields = this.availableFields.filter(field => 
      field.type === 'number' || field.aggregationType
    );

    const dialogRef = this.dialog.open(CalculatedFieldModal, {
      width: '900px',
      height: '700px',
      data: { fields: numericFields }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Salvar o campo calculado no serviço para persistência
        this.pivotService.addCalculatedField(result);
        
        // Recarregar a lista de campos disponíveis (agora inclui o novo campo calculado)
        this.availableFields = this.pivotService.getAvailableFields();
        
        // Adicionar automaticamente aos valores
        const newField = { ...result, aggregationType: 'sum' as const };
        this.valueFields = [...this.valueFields, newField];
        
        this.updateSelectedFields();
        
        // Forçar atualização da vista
        this.cdr.detectChanges();
      }
    });
  }

  apply(): void {
    const config: PivotConfig = {
      rows: this.rowFields,
      columns: this.columnFields,
      values: this.valueFields,
      filters: this.filterFields.map(field => ({
        fieldId: field.id,
        operator: 'equals',
        value: null
      })),
      calculatedFields: this.pivotService.getCalculatedFields()
    };

    this.dialogRef.close(config);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
