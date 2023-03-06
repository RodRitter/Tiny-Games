import { System } from "../utils/pixi-ecs";
import RectComponent from "../components/RectComponent";
import { Container, Graphics } from "pixi.js";
import gridConfig from "../config/gridConfig";
import { getActualPosFromGridPos } from "../utils/gridHelper";
import PositionComponent from "../components/PositionComponent";

export default class RenderSystem extends System {
  constructor() {
    super();
    this.grid = null;
  }

  onReady() {
    // this.createGrid();
    this.createShapes();
    this.updateShapes();
  }

  update() {
    this.createShapes();
    this.updateShapes();
  }

  updateShapes() {
    const updatableEntities = this.getEntitiesWithComponents([
      PositionComponent,
      RectComponent,
    ]);

    updatableEntities.forEach((entity) => {
      const { x, y } = entity.getComponent(PositionComponent);
      const actualPos = getActualPosFromGridPos(x, y);

      const rect = entity.getComponent(RectComponent);
      rect.setPosition(actualPos.x, actualPos.y);

      if (rect.shape) {
        rect.shape.x = actualPos.x;
        rect.shape.y = actualPos.y;
        rect.shape.tint = rect.color;
        rect.shape.alpha = rect.alpha;
      }
    });
  }

  createShapes() {
    const rects = this.getComponents(RectComponent);

    if (rects?.length) {
      rects.forEach((rect) => {
        if (!rect.shape) {
          const graphics = new Graphics();
          graphics.beginFill(rect.color);
          graphics.drawRect(rect.x, rect.y, rect.w, rect.h);
          graphics.endFill();
          graphics.pivot.x = rect.w * 0.5;
          graphics.pivot.y = rect.h * 0.5;
          rect.shape = graphics;
          this.ecs.app.stage.addChild(graphics);
        }
      });
    }
  }

  createGrid() {
    if (!this.grid) {
      const canvasWidth = gridConfig.size * gridConfig.width;
      const canvasHeight = gridConfig.size * gridConfig.height;

      const graphics = new Graphics();
      graphics.lineStyle(1, 0xffffff, 0.5);

      for (let col = 0; col < gridConfig.width; col++) {
        const actualPos = gridConfig.size * col + gridConfig.size / 2;
        graphics.moveTo(actualPos, 0);
        graphics.lineTo(actualPos, canvasHeight);
      }

      for (let row = 0; row < gridConfig.height; row++) {
        const actualPos = gridConfig.size * row + gridConfig.size / 2;
        graphics.moveTo(0, actualPos);
        graphics.lineTo(canvasWidth, actualPos);
      }

      this.ecs.app.stage.addChild(graphics);
      this.grid = graphics;
    }
  }
}
