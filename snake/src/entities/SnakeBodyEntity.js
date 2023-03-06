import PositionComponent from "../components/PositionComponent";
import RectComponent from "../components/RectComponent";
import gridConfig from "../config/gridConfig";
import { Entity } from "../utils/pixi-ecs";

export default class SnakeBodyEntity extends Entity {
  constructor(x, y) {
    super();
    const bodySize = gridConfig.size * 0.8;
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(
      new RectComponent(0x39c939, 0, 0, bodySize, bodySize, 0.5)
    );
  }
}
