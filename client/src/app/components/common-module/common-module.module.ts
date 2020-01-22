import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AbstractModalComponent } from './abstract-modal/abstract-modal.component';

@NgModule({
    imports: [CommonModule, BrowserAnimationsModule, MatSliderModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
    declarations: [AbstractModalComponent],
    entryComponents: [AbstractModalComponent],
    exports: [AbstractModalComponent, CommonModule, MatSliderModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class CommonModuleModule {}
