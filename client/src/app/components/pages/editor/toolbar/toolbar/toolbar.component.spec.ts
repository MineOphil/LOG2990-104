import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrushToolbarComponent } from 'src/app/components/pages/editor/toolbar/brush-toolbar/brush-toolbar.component';
import { LineToolbarComponent } from 'src/app/components/pages/editor/toolbar/line-toolbar/line-toolbar.component';
import { PenToolbarComponent } from 'src/app/components/pages/editor/toolbar/pen-toolbar/pen-toolbar.component';
import { RectangleToolbarComponent } from 'src/app/components/pages/editor/toolbar/rectangle-toolbar/rectangle-toolbar.component';
import { ToolbarComponent } from 'src/app/components/pages/editor/toolbar/toolbar/toolbar.component';
import { UserGuideModule } from 'src/app/components/pages/user-guide/user-guide.module';
import { UserGuideModalComponent } from 'src/app/components/pages/user-guide/user-guide/user-guide-modal.component';
import { AbstractModalComponent } from 'src/app/components/shared/abstract-modal/abstract-modal.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ToolType } from 'src/app/models/tools/tool';
import { Color } from 'src/app/utils/color/color';
import Spy = jasmine.Spy;

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  let router: Router;

  let dialogOpenSpy: Spy;
  let afterClosedFunc: () => void;
  const matDialogRefMock = {
    close: () => {
      afterClosedFunc();
    },
    afterClosed: () => {
      return {
        subscribe: (func: () => void) => {
          afterClosedFunc = func;
        },
      };
    },
  } as MatDialogRef<AbstractModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, UserGuideModule],
      declarations: [ToolbarComponent, PenToolbarComponent, BrushToolbarComponent, RectangleToolbarComponent, LineToolbarComponent],
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [UserGuideModalComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;

    dialogOpenSpy = spyOn(component.dialog, 'open').and.returnValue(matDialogRefMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go home', () => {
    const spy = spyOn(router, 'navigate');

    const backButton = fixture.debugElement.nativeElement.querySelector('#back-button');

    backButton.click();

    expect(spy).toHaveBeenCalledWith(['']);
  });

  it('should select the pen tool', () => {
    fixture.debugElement.nativeElement.querySelector('#btn-pen-tool').click();
    fixture.detectChanges();

    expect(component.currentToolType).toBe(ToolType.Pen);
  });

  it('should select the rectangle tool', () => {
    const rectangleButton = fixture.debugElement.nativeElement.querySelector('#btn-rectangle-tool');
    rectangleButton.click();
    fixture.detectChanges();

    expect(component.currentToolType).toBe(ToolType.Rectangle);
  });

  it('should select the line tool', () => {
    const lineButton = fixture.debugElement.nativeElement.querySelector('#btn-line-tool');
    lineButton.click();
    fixture.detectChanges();

    expect(component.currentToolType).toBe(ToolType.Line);
  });

  it('should select the brush tool', () => {
    const brushButton = fixture.debugElement.nativeElement.querySelector('#btn-brush-tool');
    brushButton.click();
    fixture.detectChanges();

    expect(component.currentToolType).toBe(ToolType.Brush);
  });

  it('should select the primary color and the secondary color when clicking associated squares', () => {
    const primaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-primary-color');
    const secondaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-secondary-color');

    secondaryColorSquare.click();

    expect(component.selectedColor).toEqual(1);

    primaryColorSquare.click();

    expect(component.selectedColor).toEqual(0);
  });

  it('should show the correct primary color in the square when a new color is picked', () => {
    const primaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-primary-color');
    primaryColorSquare.click();
    fixture.detectChanges();

    component.colorPicker.color = Color.BLUE;
    component.colorPicker.colorChanged.emit(component.colorPicker.color);

    expect(component.primaryColor.hexString).toEqual(Color.BLUE.hexString);
  });

  it('should show the correct secondary color in the square when a new color is picked', () => {
    const secondaryColorSquare = fixture.debugElement.nativeElement.querySelector('#toolbar-secondary-color');
    secondaryColorSquare.click();
    fixture.detectChanges();

    component.colorPicker.color = Color.GREEN;
    component.colorPicker.colorChanged.emit(component.colorPicker.color);

    expect(component.secondaryColor.hexString).toEqual(Color.GREEN.hexString);
  });

  it('should emit editBackgroundChanged on update background button clicked', () => {
    const backgroundChangedSpy = spyOn(component.editorBackgroundChanged, 'emit');
    component.editColor(1);
    fixture.detectChanges();
    component.colorPicker.color = Color.GREEN;

    fixture.debugElement.nativeElement.querySelector('#btn-update-background').click();

    expect(backgroundChangedSpy).toHaveBeenCalledWith(Color.GREEN);
  });

  it('should open the help modal when clicking the help button', () => {
    const helpButton = fixture.debugElement.nativeElement.querySelector('#help-button');
    helpButton.click();

    expect(dialogOpenSpy).toHaveBeenCalled();
  });

  it('should not open modal if already opened', () => {
    component.openModal();
    component.openModal();
    expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
  });

  it('should open second modal after first one is closed', () => {
    component.openModal();
    expect(component.modalIsOpened).toEqual(true);

    component.dialogRef.close();
    expect(component.modalIsOpened).toEqual(false);

    component.openModal();
    expect(dialogOpenSpy).toHaveBeenCalledTimes(2);
  });

  it('can get toolbar icons', () => {
    expect(component.toolbarIcons.get(ToolType.Pen)).toEqual('edit');
  });
});
