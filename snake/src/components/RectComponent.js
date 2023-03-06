import { Component } from "../utils/pixi-ecs";

export default class ShapeComponent extends Component {
  constructor(color = 0xffffff, x = 0, y = 0, w = 10, h = 10, alpha = 1) {
    super();
    this.shape = null;
    this.color = color;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.alpha = alpha;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setColor(color) {
    this.color = color;
  }

  onDestroy() {
    if (this.shape) {
      this.shape.destroy();
      this.shape = null;
    }
  }
}
