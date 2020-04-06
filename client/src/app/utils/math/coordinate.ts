import { Direction } from '@utils/math/direction.enum';

export class Coordinate {
  constructor(x: number = 0.0, y: number = 0.0) {
    this.x = x;
    this.y = y;
  }

  readonly x: number;
  readonly y: number;

  static add(c1: Coordinate, c2: Coordinate): Coordinate {
    return new Coordinate(c1.x + c2.x, c1.y + c2.y);
  }

  static subtract(c1: Coordinate, c2: Coordinate): Coordinate {
    return new Coordinate(c1.x - c2.x, c1.y - c2.y);
  }
  static apply(c: Coordinate, operation: (component: number) => number): Coordinate {
    return new Coordinate(operation(c.x), operation(c.y));
  }

  static abs(c: Coordinate): Coordinate {
    return this.apply(c, Math.abs);
  }

  static copy(c: Coordinate): Coordinate {
    return new Coordinate(c.x, c.y);
  }

  static minXYCoord(c1: Coordinate, c2: Coordinate): Coordinate {
    if (!c1) {
      return c2;
    }
    if (!c2) {
      return c1;
    }
    return new Coordinate(Math.min(c1.x, c2.x), Math.min(c1.y, c2.y));
  }

  static maxXYCoord(c1: Coordinate, c2: Coordinate): Coordinate {
    if (!c1) {
      return c2;
    }
    if (!c2) {
      return c1;
    }
    return new Coordinate(Math.max(c1.x, c2.x), Math.max(c1.y, c2.y));
  }

  static minArrayXYCoord(array: Coordinate[]): Coordinate {
    let min = Coordinate.copy(array[0]);
    (array as Coordinate[]).forEach((c) => {
      min = this.minXYCoord(c, min);
    });
    return min;
  }

  static maxArrayXYCoord(array: Coordinate[]): Coordinate {
    let max = Coordinate.copy(array[0]);
    (array as Coordinate[]).forEach((c) => {
      max = this.maxXYCoord(c, max);
    });
    return max;
  }

  static maxXYDistance(c1: Coordinate, c2: Coordinate): number {
    return Math.max(Math.abs(c1.x - c2.x), Math.abs(c1.y - c2.y));
  }

  static minXYDistance(c1: Coordinate, c2: Coordinate): number {
    return Math.min(Math.abs(c1.x - c2.x), Math.abs(c1.y - c2.y));
  }

  static angle(c1: Coordinate, c2: Coordinate): number {
    return Math.atan2(c1.y - c2.y, Math.abs(c1.x - c2.x));
  }

  neighbor(direction: Direction): Coordinate {
    switch (direction) {
      case Direction.North:
        return Coordinate.add(this, new Coordinate(0, 1));
      case Direction.East:
        return Coordinate.add(this, new Coordinate(1, 0));
      case Direction.South:
        return Coordinate.add(this, new Coordinate(0, -1));
      case Direction.West:
        return Coordinate.add(this, new Coordinate(-1, 0));
    }
  }

  toString(): string {
    return `[${this.x};${this.y}]`;
  }
}
