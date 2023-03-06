import { Component } from "../utils/pixi-ecs";

export default class PositionComponent extends Component {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
