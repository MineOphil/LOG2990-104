import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EditorService } from 'src/app//services/editor.service';
import { DrawingSurfaceComponent } from 'src/app/components/pages/editor/drawing-surface/drawing-surface.component';
import { AbstractModalComponent } from 'src/app/components/shared/abstract-modal/abstract-modal.component';
@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
})
export class ExportModalComponent extends AbstractModalComponent {
  selectedExtension: string;
  fullName: string;
  name: string;
  extensions: string[] = ['svg', 'png', 'jpg'];
  previewImage: DrawingSurfaceComponent;

  constructor(
    public dialogRef: MatDialogRef<AbstractModalComponent>,
    private editorService: EditorService,
    private sanitizer: DomSanitizer,
  ) {
    super(dialogRef);
    editorService.clearShapesBuffer();
    this.previewImage = this.editorService.view;
    this.name = '';
    this.selectedExtension = '';
  }

  previewURL(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.editorService.createDataURL(this.previewImage));
  }

  submit(): void {
    this.fullName = this.name + '.' + this.selectedExtension;
    if (this.name !== '' && this.selectedExtension !== '') {
      if (this.selectedExtension === 'svg') {
        this.editorService.exportSVGElement(this.fullName, this.previewImage);
      } else {
        this.editorService.exportImageElement(this.fullName, this.selectedExtension, this.previewImage);
      }
    }
    this.dialogRef.close();
  }
}
