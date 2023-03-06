import TextComponent from "../components/TextComponent";
import { Entity } from "../utils/pixi-ecs";

export default class ScoreEntity extends Entity {
  constructor(text, x, y, color) {
    super();
    this.addComponent(new TextComponent(text, x, y, color));
  }
}
