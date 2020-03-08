import { BrushTextureType } from 'src/app/models/tool-properties/brush-texture-type.enum';
import { BrushToolProperties } from 'src/app/models/tool-properties/brush-tool-properties';
import { ToolType } from 'src/app/models/tools/tool-type.enum';

describe('Brush Tool Properties', () => {
  let brushProperties: BrushToolProperties;

  beforeEach(() => {
    brushProperties = new BrushToolProperties();
  });

  it('should create with the correct tool type', () => {
    expect(brushProperties.type).toBe(ToolType.Brush);
  });

  it('should create with the default thickness', () => {
    expect(brushProperties.strokeWidth).toBe(BrushToolProperties.MIN_THICKNESS);
  });

  it('should create with the default texture', () => {
    expect(brushProperties.texture).toBe(BrushTextureType.TEXTURE_1);
  });
});
