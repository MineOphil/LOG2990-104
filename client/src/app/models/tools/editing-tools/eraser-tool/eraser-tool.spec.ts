/* tslint:disable:no-string-literal no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingSurfaceComponent } from '@components/pages/editor/drawing-surface/drawing-surface.component';
import { SharedModule } from '@components/shared/shared.module';
import { Ellipse } from '@models/shapes/ellipse';
import { Rectangle } from '@models/shapes/rectangle';
import { EditorService } from '@services/editor.service';
import { ImageExportService } from '@services/image-export.service';
import { NumericProperty } from '@tool-properties/props/numeric-property/numeric-property';
import { mouseDown, mouseMove, mouseUp } from '@tools/creator-tools/stroke-tools/stroke-tool.spec';
import { EraserTool } from '@tools/editing-tools/eraser-tool/eraser-tool';
import { EraserUtils } from '@tools/editing-tools/eraser-tool/eraser-utils';
import { PipetteTool } from '@tools/other-tools/pipette-tool';
import { Color } from '@utils/color/color';
import { Coordinate } from '@utils/math/coordinate';

describe('EraserTool', () => {
  let eraser: EraserTool;
  let fixture: ComponentFixture<DrawingSurfaceComponent>;
  let drawingSurface: DrawingSurfaceComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DrawingSurfaceComponent],
      providers: [EditorService],
    }).compileComponents();

    eraser = new EraserTool(TestBed.get(EditorService));
    fixture = TestBed.createComponent(DrawingSurfaceComponent);
    drawingSurface = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(eraser).toBeDefined();
  });

  it('updates selection on mouse move', () => {
    const updateSelectionSpy = spyOn(eraser, 'updateSelection');
    eraser.handleMouseMove(mouseMove(new Coordinate()));
    expect(updateSelectionSpy).toHaveBeenCalled();
  });

  it('erases shapes on mouse move if active', () => {
    const eraseSpy = spyOn(eraser['editorService'], 'removeShapeFromView');
    spyOn(eraser, 'init');
    spyOn(eraser, 'selectShapes').and.callFake(() => {
      eraser['selectedIndexes'] = [0, 1];
    });

    const ellipse = new Ellipse();
    ellipse.id = 0;
    eraser['editorService'].shapes.push(ellipse);
    eraser['isActive'] = true;
    spyOn(eraser['editorService'], 'findShapeById').and.returnValue(ellipse);

    eraser.handleMouseMove(mouseMove(new Coordinate()));

    expect(eraseSpy).toHaveBeenCalledWith(ellipse);
    expect(eraser['removedShapes'][0]).toEqual(ellipse);
  });

  it('erases selected shape and updates selection on mouse down', () => {
    const eraseSpy = spyOn(eraser['editorService'], 'removeShapeFromView');
    spyOn(eraser, 'init');
    spyOn(eraser, 'selectShapes').and.callFake(() => {
      eraser['selectedIndexes'] = [0, 1];
    });

    const ellipse = new Ellipse();
    ellipse.id = 0;
    eraser['editorService'].shapes.push(ellipse);
    eraser['isActive'] = true;
    spyOn(eraser['editorService'], 'findShapeById').and.returnValue(ellipse);

    eraser.handleMouseDown(mouseDown(new Coordinate()));

    expect(eraseSpy).toHaveBeenCalledWith(ellipse);
    expect(eraser['removedShapes'][0]).toEqual(ellipse);
  });

  it('sends the command on mouseup if there are shapes to remove', () => {
    const addCommandSpy = spyOn(eraser.editorService.commandReceiver, 'add');

    const ellipse = new Ellipse();
    eraser['removedShapes'] = [ellipse];
    eraser['isActive'] = true;

    eraser.handleMouseUp(mouseUp(new Coordinate()));

    expect(addCommandSpy).toHaveBeenCalled();
  });
  it('does not send command on mouseup if there are no shapes to remove', () => {
    const addCommandSpy = spyOn(eraser.editorService.commandReceiver, 'add');
    eraser.handleMouseUp(mouseUp(new Coordinate()));
    expect(addCommandSpy).not.toHaveBeenCalled();
  });

  it('resets selection on updateSelection', () => {
    eraser.updateSelection();
    expect(eraser.editorService['shapesBuffer'].length).toEqual(0);
    expect(eraser['selectedIndexes'].length).toEqual(0);
  });

  it('highlights selected shapes on updateSelection', () => {
    const shape = new Rectangle();
    spyOn(eraser, 'selectShapes').and.callFake(() => {
      eraser['selectedIndexes'] = [0, 1];
    });
    spyOn(eraser['editorService'], 'findShapeById').and.returnValue(shape);
    const highlightShapeSpy = spyOn(EraserUtils, 'highlightShape').and.callThrough();

    eraser.updateSelection();

    expect(highlightShapeSpy).toHaveBeenCalledWith(shape);
    expect(shape.svgNode.style.stroke).toEqual(Color.RED.rgbString);
  });

  it('reverts shapes that are not selected on updateSelection', () => {
    const shape = new Rectangle();
    shape.primaryColor = Color.BLUE;
    EraserUtils.highlightShape(shape);
    spyOn(eraser, 'getShapesNotSelected').and.returnValue([shape]);
    eraser.updateSelection();
    expect(shape.svgNode.style.fill).toEqual(Color.BLUE.rgbString);
  });

  it('can get eraser size', () => {
    eraser.toolProperties.eraserSize = new NumericProperty(1, 1, 1);
    expect(eraser.size).toEqual(1);
  });

  it('can get eraser position', () => {
    spyOnProperty(eraser, 'size').and.returnValue(10);
    eraser['_mousePosition'] = new Coordinate(20, 50);
    expect(eraser.eraserPosition).toEqual(new Coordinate(15, 45));
  });

  it('can detect collisions', () => {
    spyOn(PipetteTool, 'colorAtPointInCanvas').and.callFake((ctx, coord) => {
      return coord.x === 5 ? Color.BLUE : Color.RED;
    });
    // @ts-ignore
    eraser['ctx'] = true;
    spyOn(EraserUtils, 'indexFromColor').and.returnValue(1);
    spyOnProperty(eraser, 'size').and.returnValue(5);
    eraser.selectShapes(new Coordinate(2, 2));
    expect(eraser['selectedIndexes'].length).not.toEqual(0);
  });

  it('does not select objects that do not collide', () => {
    spyOn(PipetteTool, 'colorAtPointInCanvas').and.callFake((ctx, coord) => {
      return coord.x === 5 ? Color.BLUE : Color.RED;
    });
    spyOn(EraserUtils, 'indexFromColor').and.returnValue(1);
    spyOnProperty(eraser, 'size').and.returnValue(5);
    eraser.selectShapes(new Coordinate(50, 50));
    expect(eraser['selectedIndexes'].length).toEqual(0);
  });

  it('inits onSelect', () => {
    const initSpy = spyOn(eraser, 'init');
    const initEraserViewSpy = spyOn(eraser, 'initEraserView');

    eraser.onSelect();

    expect(initSpy).toHaveBeenCalled();
    expect(initEraserViewSpy).toHaveBeenCalled();
  });

  it('inits on undo or redo', () => {
    const initSpy = spyOn(eraser, 'init');

    eraser.handleUndoRedoEvent(true);

    expect(initSpy).toHaveBeenCalled();
  });

  it('does not select shape if color difference is greater than tolerance', () => {
    spyOn(PipetteTool, 'colorAtPointInCanvas').and.callFake((ctx, coord) => {
      return coord.x === 5 ? Color.BLUE : Color.RED;
    });
    // @ts-ignore
    eraser['ctx'] = true;
    spyOn(EraserUtils, 'indexFromColor').and.returnValue(1.5);
    spyOnProperty(eraser, 'size').and.returnValue(5);

    eraser.selectShapes(new Coordinate(2, 2));

    expect(eraser['selectedIndexes'].length).toEqual(0);
  });

  it('creates a copy of the view with assigned colors on init', () => {
    const viewToCanvasSpy = spyOn(ImageExportService, 'viewToCanvas');
    const sanitizeSpy = spyOn(EraserUtils, 'sanitizeAndAssignColorToSvgNode');

    const rect = new Rectangle();

    drawingSurface.addShape(rect);
    rect.id = 7;
    rect.svgNode.id = 'shape-7';

    eraser.editorService.view = drawingSurface;

    eraser.init();

    expect(sanitizeSpy).toHaveBeenCalledWith(rect.svgNode, 8);
    expect(viewToCanvasSpy).toHaveBeenCalled();
  });
});
