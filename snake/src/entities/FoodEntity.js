import { Entity } from "../utils/pixi-ecs";
import RectComponent from "../components/RectComponent";
import PositionComponent from "../components/PositionComponent";
import gridConfig from "../config/gridConfig";

export default class FoodEntity extends Entity {
  constructor(x, y) {
    super();
    const foodSize = gridConfig.size * 0.5;
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new RectComponent(0xff3b3b, 0, 0, foodSize, foodSize));
  }
  1;
}
