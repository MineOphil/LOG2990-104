/* tslint:disable:no-string-literal */
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { Rectangle } from 'src/app/models/shapes/rectangle';
import { ColorApplicatorTool } from 'src/app/models/tools/editing-tools/color-applicator-tool';
import { EditorService } from 'src/app/services/editor.service';
import { Color } from 'src/app/utils/color/color';

describe('ColorApplicatorTool', () => {
  let tool: ColorApplicatorTool;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [EditorService],
    }).compileComponents();

    tool = new ColorApplicatorTool(TestBed.get(EditorService));
  });

  it('should create an instance', () => {
    expect(tool).toBeTruthy();
  });

  it('should change primary color of a shape on selectShape with left click', () => {
    tool['editorService'].colorsService.primaryColor = Color.RED;
    const shape = new Rectangle();
    shape.shapeProperties.primaryColor = Color.GREEN;
    tool.selectShape(shape, false);

    expect(shape.shapeProperties.primaryColor).toEqual(Color.RED);
  });

  it('should change secondary color of a shape on selectShape with right click', () => {
    tool['editorService'].colorsService.secondaryColor = Color.RED;
    const shape = new Rectangle();
    shape.shapeProperties.secondaryColor = Color.GREEN;
    tool.selectShape(shape, true);

    expect(shape.shapeProperties.secondaryColor).toEqual(Color.RED);
  });
});
