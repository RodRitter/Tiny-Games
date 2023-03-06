import { Component } from "../utils/pixi-ecs";

export default class TextComponent extends Component {
  constructor(text, x, y, color) {
    super();
    this.x = x;
    this.y = y;
    this.color = color || 0xffffff;
    this.text = text || "";
  }
}
