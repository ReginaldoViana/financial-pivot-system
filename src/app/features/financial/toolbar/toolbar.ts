import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-toolbar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  @Output() refresh = new EventEmitter<void>();
  @Output() openFile = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() chartChange = new EventEmitter<string>();
  @Output() format = new EventEmitter<void>();
  @Output() fieldsClick = new EventEmitter<void>();
  @Output() export = new EventEmitter<string>();
  @Output() fullscreen = new EventEmitter<void>();

  onRefresh(): void {
    this.refresh.emit();
  }

  onOpen(): void {
    this.openFile.emit();
  }

  onSave(): void {
    this.save.emit();
  }

  onChartChange(type: string): void {
    this.chartChange.emit(type);
  }

  onFormat(): void {
    this.format.emit();
  }

  onFieldsClick(): void {
    this.fieldsClick.emit();
  }

  onExport(type: string): void {
    this.export.emit(type);
  }

  onFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.fullscreen.emit();
  }
}
