import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { Router } from '@angular/router';
import { ToolbarType } from '@components/pages/editor/toolbar/toolbar/toolbar-type.enum';

import { ColorPickerComponent } from 'src/app/components/shared/color-picker/color-picker.component';
import { ToolType } from 'src/app/models/tools/tool-type.enum';
import { EditorService } from 'src/app/services/editor.service';
import { SelectedColorType } from 'src/app/services/selected-color-type.enum';
import { Color } from 'src/app/utils/color/color';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  static readonly SLIDER_STEP: number = 0.1; // todo

  @Input() stepThickness: number;

  @Input() currentToolType: ToolType;
  @Output() currentToolTypeChange: EventEmitter<ToolType> = new EventEmitter<ToolType>();

  @Output() editorBackgroundChanged: EventEmitter<Color>;
  @Output() guideButtonClicked: EventEmitter<boolean>;
  @Output() chooseExportSaveButtonClicked: EventEmitter<boolean>;

  ToolType: typeof ToolType = ToolType;
  toolTypeKeys: string[] = Object.values(ToolType);

  SelectedColorType: typeof SelectedColorType = SelectedColorType;
  selectedColor: SelectedColorType;

  ToolbarType: typeof ToolbarType = ToolbarType;
  toolbarType: ToolbarType;

  @ViewChild('drawer', { static: false })
  private readonly drawer: MatDrawer;

  @ViewChild('colorPicker', { static: false })
  colorPicker: ColorPickerComponent;

  readonly toolbarIcons: Map<ToolType | string, string>;

  constructor(private router: Router, public editorService: EditorService) {
    this.stepThickness = ToolbarComponent.SLIDER_STEP;
    this.editorBackgroundChanged = new EventEmitter<Color>();
    this.selectedColor = SelectedColorType.primary;
    this.guideButtonClicked = new EventEmitter<boolean>();
    this.chooseExportSaveButtonClicked = new EventEmitter<boolean>();
    this.toolbarType = ToolbarType.other;

    this.toolbarIcons = new Map<ToolType | string, string>([
      [ToolType.Pen, 'edit'],
      [ToolType.Brush, 'brush'],
      [ToolType.Rectangle, 'crop_square'],
      [ToolType.Line, 'show_chart'],
      [ToolType.Ellipse, 'panorama_fish_eye'],
      [ToolType.Pipette, 'colorize'],
      [ToolType.Polygon, 'category'],
      [ToolType.Spray, 'blur_on'],
      [ToolType.ColorApplicator, 'color_lens'],
      [ToolType.Select, 'near_me'],
      [ToolType.Eraser, 'delete_outline'],
    ]);
  }

  toolButtonId(tool: string): string {
    return `btn-${tool}`;
  }

  open(): void {
    this.drawer.open();
  }

  close(): void {
    this.drawer.close();
  }

  handleColorChanged(eventColor: Color): void {
    this.color = eventColor;
    this.toolbarType = ToolbarType.other;
    this.close();
  }

  openChooseExportSave(): void {
    this.chooseExportSaveButtonClicked.emit(true);
  }

  openGuide(): void {
    this.guideButtonClicked.emit(true);
  }

  selectTool(selection: string): void {
    const type = selection as ToolType;
    if (type) {
      this.currentToolType = type;
      this.toolbarType = ToolbarType.other;
      this.currentToolTypeChange.emit(type);
    }
  }

  editColor(selectedColorType: SelectedColorType): void {
    this.toolbarType = ToolbarType.colorPicker;
    this.open();
    this.selectedColor = selectedColorType;
  }

  editGrid(): void {
    this.toolbarType = ToolbarType.grid;
    this.open();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  updateBackground(color: Color): void {
    this.editorBackgroundChanged.emit(color);
  }

  get primaryColor(): Color {
    return this.editorService.colorsService.primaryColor;
  }

  get secondaryColor(): Color {
    return this.editorService.colorsService.secondaryColor;
  }

  set color(color: Color) {
    this.editorService.colorsService.setColorByType(color, this.selectedColor);
  }

  get color(): Color {
    return this.editorService.colorsService.getColor(this.selectedColor);
  }
}