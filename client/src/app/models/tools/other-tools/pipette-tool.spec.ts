/* tslint:disable:no-any no-string-literal no-magic-numbers no-empty */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GridComponent } from '@components/pages/editor/drawing-surface/grid/grid.component';
import { ToolbarModule } from '@components/pages/editor/toolbar/toolbar.module';
import { DrawingSurfaceComponent } from 'src/app/components/pages/editor/drawing-surface/drawing-surface.component';
import { EditorComponent } from 'src/app/components/pages/editor/editor/editor.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { PipetteTool } from 'src/app/models/tools/other-tools/pipette-tool';
import { EditorService } from 'src/app/services/editor.service';
import { SelectedColorType } from 'src/app/services/selected-color-type.enum';
import { Color } from 'src/app/utils/color/color';
import { Coordinate } from 'src/app/utils/math/coordinate';
import createSpyObj = jasmine.createSpyObj;

describe('PipetteTool', () => {
  let pipetteTool: PipetteTool;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent, DrawingSurfaceComponent, GridComponent],
      imports: [SharedModule, RouterTestingModule, ToolbarModule],
      providers: [EditorService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    fixture.detectChanges();
    pipetteTool = new PipetteTool(fixture.componentInstance.editorService);
  });

  it('picks primary color on left click', () => {
    const pickColorSpy = spyOn<any>(pipetteTool, 'pickColor');
    pipetteTool.handleMouseEvent({ type: 'click', offsetX: 10, offsetY: 20 } as MouseEvent);
    expect(pickColorSpy).toHaveBeenCalledWith(new Coordinate(10, 20), SelectedColorType.primary);
  });

  it('picks secondary color on right click', () => {
    const pickColorSpy = spyOn<any>(pipetteTool, 'pickColor');
    pipetteTool.handleMouseEvent({
      type: 'contextmenu',
      offsetX: 10,
      offsetY: 20,
      preventDefault: () => {},
    } as MouseEvent);
    expect(pickColorSpy).toHaveBeenCalledWith(new Coordinate(10, 20), SelectedColorType.secondary);
  });

  it('can pick primary color', (done) => {
    spyOn(PipetteTool, 'colorAtPointInCanvas').and.returnValue(Color.BLUE);
    spyOn(pipetteTool['editorService'], 'viewToCanvas').and.returnValue(
      new Promise<CanvasRenderingContext2D>((resolve) => {
        resolve({} as CanvasRenderingContext2D);
        done();
      }),
    );

    pipetteTool['pickColor'](new Coordinate(), SelectedColorType.primary);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(pipetteTool['editorService']['colorsService'].primaryColor).toEqual(Color.BLUE);
      expect(PipetteTool.colorAtPointInCanvas).toHaveBeenCalled();
    });
  });

  it('can pick secondary color', (done) => {
    spyOn(PipetteTool, 'colorAtPointInCanvas').and.returnValue(Color.BLUE);
    spyOn(pipetteTool['editorService'], 'viewToCanvas').and.returnValue(
      new Promise<CanvasRenderingContext2D>((resolve) => {
        resolve({} as CanvasRenderingContext2D);
        done();
      }),
    );

    pipetteTool['pickColor'](new Coordinate(), SelectedColorType.secondary);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(pipetteTool['editorService']['colorsService'].secondaryColor).toEqual(Color.BLUE);
      expect(PipetteTool.colorAtPointInCanvas).toHaveBeenCalled();
    });
  });

  it('can get color at a position in a canvas', () => {
    const context: CanvasRenderingContext2D = createSpyObj('canvasContext', { getImageData: { data: [100, 200, 255] } });
    const color = PipetteTool.colorAtPointInCanvas(context, new Coordinate());

    expect(color.r255).toEqual(100);
    expect(color.g255).toEqual(200);
    expect(color.b255).toEqual(255);
  });
});