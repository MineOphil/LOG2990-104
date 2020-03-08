import { Injectable } from '@angular/core';

export type KeyboardEventAction = (event: KeyboardEvent) => boolean;
export type KeyboardEventsHandlingMap = Map<string, KeyboardEventAction>;

@Injectable()
export class KeyboardListener {
  constructor(){
    this.keyboardEventsHandlingMap = new Map<string, KeyboardEventAction>()
  }

  defaultEventAction: KeyboardEventAction;
  private readonly keyboardEventsHandlingMap: KeyboardEventsHandlingMap;

  static getIdentifierFromKeyboardEvent(event: KeyboardEvent): string {
    const { ctrlKey, shiftKey, type, key } = event;

    return this.getIdentifier(key, ctrlKey, shiftKey, type);
  }

  static getIdentifier(key: string, ctrlKey: boolean = false, shiftKey: boolean = false, type: string = 'keydown'): string {
    let identifier = '';

    identifier += ctrlKey ? 'ctrl_' : '';
    identifier += shiftKey ? 'shift_' : '';
    identifier += key;
    identifier += `_${type}`;

    return identifier;
  }

  handle(event: KeyboardEvent): boolean {
    const func = this.keyboardEventsHandlingMap.get(KeyboardListener.getIdentifierFromKeyboardEvent(event));
    const success = func ? func(event) : this.defaultEventAction ? this.defaultEventAction(event) : false;

    if (success) {
      event.preventDefault();
    }
    return success;
  }

  addEvents(events: ReadonlyArray<[string, KeyboardEventAction]>): void {
    events.forEach((event) => {
      this.addEvent(event[0], event[1]);
    });
  }

  addEvent(eventIdentifier: string, action: KeyboardEventAction): void {
    this.keyboardEventsHandlingMap.set(eventIdentifier, action);
  }
}
