import { Entity } from "../utils/pixi-ecs";
import SnakeBodyEntity from "./SnakeBodyEntity";
import RectComponent from "../components/RectComponent";
import PositionComponent from "../components/PositionComponent";
import gridConfig from "../config/gridConfig";

export default class SnakeEntity extends Entity {
  constructor(x, y) {
    super();
    this.segments = [];
    const snakeSize = gridConfig.size * 0.8;
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new RectComponent(0x39c939, 0, 0, snakeSize, snakeSize));
  }

  addSegment() {
    let snakePos = this.getComponent(PositionComponent);
    let newSegment = new SnakeBodyEntity(snakePos.x, snakePos.y);
    const segmentPos = newSegment.getComponent(PositionComponent);

    if (this.segments.length) {
      // Use last segment as position
      const lastSegment = this.segments[this.segments.length - 1];
      const lastSegmentPos = lastSegment.getComponent(PositionComponent);
      segmentPos.x = lastSegmentPos.x;
      segmentPos.y = lastSegmentPos.y;
    } else {
      // Use snake body position
      segmentPos.x = snakePos.x;
      segmentPos.y = snakePos.y;
    }

    this.segments.push(newSegment);
    this.ecs.addEntity(newSegment);
  }

  restart() {
    const snakePos = this.getComponent(PositionComponent);
    snakePos.setPosition(gridConfig.startPos.x, gridConfig.startPos.y);

    this.segments.forEach((segment) => {
      segment.destroy();
    });

    this.segments = [];
  }
}
