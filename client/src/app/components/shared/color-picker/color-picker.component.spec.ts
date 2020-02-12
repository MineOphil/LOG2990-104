import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlphaComponent } from 'src/app/components/shared/color-picker/color-strip/alpha/alpha.component';
import { ColorLightnessComponent } from 'src/app/components/shared/color-picker/color-strip/color-lightness/color-lightness.component';
import { CustomInputComponent } from 'src/app/components/shared/inputs/custom-input/custom-input.component';
import { HexInputComponent } from 'src/app/components/shared/inputs/hex-input/hex-input.component';
import { NumberInputComponent } from 'src/app/components/shared/inputs/number-input/number-input.component';
import { Color } from 'src/app/utils/color/color';

import { ColorPickerComponent } from './color-picker.component';
import Spy = jasmine.Spy;

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let drawAllSpy: Spy;
  let colorSquareElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
      declarations: [
        ColorPickerComponent,
        ColorLightnessComponent,
        AlphaComponent,
        NumberInputComponent,
        CustomInputComponent,
        HexInputComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;

    component.size = 500;

    colorSquareElement = fixture.debugElement.query(By.css('#color-square'));
    drawAllSpy = spyOn(component, 'drawAll').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();
    drawAllSpy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw indicator on draw all', () => {
    const drawSpy = spyOn(component, 'draw');
    const drawIndicatorSpy = spyOn(component, 'drawIndicator');
    component.drawAll();
    expect(drawSpy).toHaveBeenCalled();
    expect(drawIndicatorSpy).toHaveBeenCalled();
  });

  it('can calculate indicator position', () => {
    component.color = Color.hsl(120, 0.5, 1);
    component.size = 200;

    const position = component.calculateIndicatorPosition();

    expect(position.x).toEqual((120 / 360) * 200);
    expect(position.y).toEqual(0.5 * 200);
  });

  it('should update color on colorChange with lightness component', () => {
    const colorLightnessComponent = fixture.debugElement.query(By.directive(ColorLightnessComponent)).componentInstance;
    const colorChangeSpy = spyOn(component, 'colorChange').and.callThrough();
    const l = 0.4;

    colorLightnessComponent.colorChanged.emit(Color.hsl(0, 0, l));
    fixture.detectChanges();

    expect(colorChangeSpy).toHaveBeenCalledWith(Color.hsl(0, 0, l));
    expect(component.color.l).toBe(l);
  });

  it('should update color on colorChange with alpha component', () => {
    const alphaComponent = fixture.debugElement.query(By.directive(AlphaComponent)).componentInstance;
    const alphaChangedSpy = spyOn(component, 'colorChange').and.callThrough();
    const a = 0.4;

    alphaComponent.colorChanged.emit(Color.alpha(Color.RED, a));
    fixture.detectChanges();

    expect(alphaChangedSpy).toHaveBeenCalledWith(Color.alpha(Color.RED, a));
    expect(component.color.a).toBe(a);
  });

  it('should update on RGB inputs change', () => {
    const redColorInputComponent: HexInputComponent = fixture.debugElement.query(By.css('#red-color-input')).componentInstance;
    const greenColorInputComponent: HexInputComponent = fixture.debugElement.query(By.css('#green-color-input')).componentInstance;
    const blueColorInputComponent: HexInputComponent = fixture.debugElement.query(By.css('#blue-color-input')).componentInstance;
    const colorChangeSpy = spyOn(component, 'rgbChange').and.callThrough();

    redColorInputComponent.onBlur('11');
    fixture.detectChanges();
    expect(colorChangeSpy).toHaveBeenCalledWith('11', 'r');

    greenColorInputComponent.onBlur('22');
    fixture.detectChanges();
    expect(colorChangeSpy).toHaveBeenCalledWith('22', 'g');

    blueColorInputComponent.onBlur('33');
    fixture.detectChanges();
    expect(colorChangeSpy).toHaveBeenCalledWith('33', 'b');

    expect(component.color.hex).toEqual('112233');
    expect(drawAllSpy).toHaveBeenCalledTimes(3);
  });

  it('should update on hex color input change', () => {
    const hexColorInputComponent: HexInputComponent = fixture.debugElement.query(By.css('#hex-color-input')).componentInstance;
    const hexChangeSpy = spyOn(component, 'hexChange').and.callThrough();
    const colorHex = 'ff22ff';

    hexColorInputComponent.onBlur(colorHex);
    fixture.detectChanges();

    expect(hexChangeSpy).toHaveBeenCalledWith(colorHex);
    expect(component.color.hex).toEqual(colorHex);
    expect(drawAllSpy).toHaveBeenCalled();
  });

  it('calls onMouseDown when mouse is down', () => {
    const mouseDownSpy = spyOn(component, 'onMouseDown').and.callThrough();
    colorSquareElement.triggerEventHandler('mousedown', { offsetX: 50, offsetY: 40 });

    expect(mouseDownSpy).toHaveBeenCalled();
  });

  it('can draw on mouse down', () => {
    component.onMouseDown({ offsetX: 50, offsetY: 40 } as MouseEvent);

    fixture.detectChanges();

    const h = (50 / 500) * 360;
    const s = 40 / 500;
    expect(component.color.h).toEqual(h);
    expect(component.color.s).toEqual(s);
    expect(drawAllSpy).toHaveBeenCalled();
  });

  it('calls onMouseMove when mouse is moved', () => {
    const mouseMoveSpy = spyOn(component, 'onMouseMove').and.callThrough();
    colorSquareElement.triggerEventHandler('mousemove', { offsetX: 50, offsetY: 40 });

    expect(mouseMoveSpy).toHaveBeenCalled();
  });

  it('can draw on mouse move if mouse is down', () => {
    component.onMouseDown({ offsetX: 100, offsetY: 100 } as MouseEvent);
    component.onMouseMove({ offsetX: 50, offsetY: 40 } as MouseEvent);

    fixture.detectChanges();

    const h = (50 / 500) * 360;
    const s = 40 / 500;
    expect(component.color.h).toEqual(h);
    expect(component.color.s).toEqual(s);
    expect(drawAllSpy).toHaveBeenCalledTimes(2);
  });

  it('does not draw on mouse move if mouse is not down', () => {
    const mouseMoveSpy = spyOn(component, 'onMouseMove').and.callThrough();
    component.onMouseMove({ offsetX: 50, offsetY: 40 } as MouseEvent);
    fixture.detectChanges();

    expect(drawAllSpy).not.toHaveBeenCalled();
    expect(mouseMoveSpy).toHaveBeenCalled();
  });

  it('detects mouse up event', () => {
    const mouseUpSpy = spyOn(component, 'onMouseUp').and.callThrough();
    window.dispatchEvent(new Event('mouseup'));
    expect(mouseUpSpy).toHaveBeenCalled();
  });

  it('does not draw on mouse move if mouse has been released', () => {
    const mouseMoveSpy = spyOn(component, 'onMouseMove').and.callThrough();

    component.onMouseDown({ offsetX: 100, offsetY: 100 } as MouseEvent);
    component.onMouseUp();
    component.onMouseMove({ offsetX: 50, offsetY: 40 } as MouseEvent);

    const h = (100 / 500) * 360;
    const s = 100 / 500;
    expect(component.color.h).toEqual(h);
    expect(component.color.s).toEqual(s);
    expect(drawAllSpy).toHaveBeenCalledTimes(1);
    expect(mouseMoveSpy).toHaveBeenCalled();
  });
});
