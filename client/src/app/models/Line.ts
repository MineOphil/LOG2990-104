import { BaseShape } from './BaseShape';
import { Coordinate } from './Coordinate';

export class Line extends BaseShape {
    startCoordinate: Coordinate;
    endCoordinate: Coordinate;

    constructor() {
        super();
        this.startCoordinate = new Coordinate();
        this.endCoordinate = new Coordinate();
    }

    getCenter(): Coordinate {
        this.origin.x = (this.startCoordinate.x + this.endCoordinate.x) / 2;
        this.origin.y = (this.startCoordinate.y + this.endCoordinate.y) / 2;
        return this.origin;
    }
}
