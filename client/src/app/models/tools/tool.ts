import { ToolProperties } from 'src/app/models/tool-properties/tool-properties';
import { EditorService } from 'src/app/services/editor.service';
import { KeyboardEventHandler } from 'src/app/utils/events/keyboard-event-handler';
import { KeyboardListener } from 'src/app/utils/events/keyboard-listener';
import { Coordinate } from 'src/app/utils/math/coordinate';

export enum ToolType {
  Pen = 'pen-tool',
  Brush = 'brush-tool',
  Rectangle = 'rectangle-tool',
  Line = 'line-tool',
}
export abstract class Tool<T = ToolProperties> {
  protected keyboardEventHandler: KeyboardEventHandler;
  private _mousePosition: Coordinate;
  protected editorService: EditorService;
  protected isActive: boolean;
  toolProperties: T;

  get mousePosition(): Coordinate {
    return this._mousePosition;
  }

  protected constructor(editorService: EditorService) {
    this.editorService = editorService;
    this.keyboardEventHandler = {} as KeyboardEventHandler;
    this._mousePosition = new Coordinate();
  }

  handleMouseEvent(e: MouseEvent): void {
    this._mousePosition = new Coordinate(e.offsetX, e.offsetY);
  }

  handleKeyboardEvent(e: KeyboardEvent): boolean {
    return KeyboardListener.keyEvent(e, this.keyboardEventHandler);
  }

  cancel(): void {
    this.isActive = false;
    this.editorService.clearShapesBuffer();
  }
}
