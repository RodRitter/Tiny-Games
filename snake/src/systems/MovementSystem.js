import { System } from "../utils/pixi-ecs";
import gridConfig from "../config/gridConfig";
import { getActualPosFromGridPos } from "../utils/gridHelper";
import InputManager from "../utils/inputManager";
import PositionComponent from "../components/PositionComponent";
import RectComponent from "../components/RectComponent";
import SnakeEntity from "../entities/SnakeEntity";
import FoodEntity from "../entities/FoodEntity";
import FoodSystem from "./FoodSystem";
import ScoreEntity from "../entities/ScoreEntity";
import ScoreSystem from "./ScoreSystem";

export default class MovementSystem extends System {
  constructor() {
    super();
    this.input = new InputManager();
    this.xDirection = 1;
    this.yDirection = 0;
    this.inputReady = true;
    this.active = true;
  }

  disableMovement() {
    this.active = false;
  }

  updateAllPositions() {
    const updatableEntities = this.getEntitiesWithComponents([
      PositionComponent,
      RectComponent,
    ]);

    updatableEntities.forEach((entity) => {
      const { x, y } = entity.getComponent(PositionComponent);
      const gridPos = getActualPosFromGridPos(x, y);
      const rect = entity.getComponent(RectComponent);
      rect.setPosition(gridPos.x, gridPos.y);
    });
  }

  onReady() {
    this.updateAllPositions();
  }

  update() {
    if (this.active) {
      if (this.input.keys["ArrowRight"]) {
        if (this.xDirection === 0 && this.inputReady) {
          this.inputReady = false;
          this.xDirection = 1;
          this.yDirection = 0;
        }
      }
      if (this.input.keys["ArrowLeft"]) {
        if (this.xDirection === 0 && this.inputReady) {
          this.inputReady = false;
          this.xDirection = -1;
          this.yDirection = 0;
        }
      }
      if (this.input.keys["ArrowUp"]) {
        if (this.yDirection === 0 && this.inputReady) {
          this.inputReady = false;
          this.yDirection = 1;
          this.xDirection = 0;
        }
      }
      if (this.input.keys["ArrowDown"]) {
        if (this.yDirection === 0 && this.inputReady) {
          this.inputReady = false;
          this.yDirection = -1;
          this.xDirection = 0;
        }
      }
    }

    if (this.input.keys["r"] && !this.active) {
      this.restart();
    }
  }

  moveHead() {
    const snakeEntity = this.getEntitiesByType(SnakeEntity)[0];
    const foodSystem = this.ecs.getSystem(FoodSystem);
    const scoreSystem = this.ecs.getSystem(ScoreSystem);

    if (snakeEntity) {
      const snakeEntityPos = snakeEntity.getComponent(PositionComponent);

      const targetX = snakeEntityPos.x + this.xDirection;
      const targetY = snakeEntityPos.y - this.yDirection;

      const isWithinXBound = targetX >= 0 && targetX < gridConfig.width;
      const isWithinYBound = targetY >= 0 && targetY < gridConfig.height;

      // Check if snake hit itself
      const hasCollided = snakeEntity.segments.reduce((collided, segment) => {
        if (!collided) {
          // check this segment
          const segmentPos = segment.getComponent(PositionComponent);
          return segmentPos.x === targetX && segmentPos.y === targetY;
        }
        // Already collided, continue
        return true;
      }, false);

      if (isWithinXBound && isWithinYBound && !hasCollided) {
        // Move segments
        this.moveSegments(snakeEntity, snakeEntityPos.x, snakeEntityPos.y);

        // Move head
        snakeEntityPos.x = targetX;
        snakeEntityPos.y = targetY;

        // Check if food is eaten
        if (foodSystem.food) {
          const pos = foodSystem.food.getComponent(PositionComponent);

          if (targetX === pos.x && targetY === pos.y) {
            // Eat food
            snakeEntity.addSegment();
            foodSystem.eat();
            scoreSystem.bumpScore();
          }
        }
      } else {
        // Out of bounds or hit obsticle. Die.
        this.disableMovement();
        scoreSystem.gameOver();
      }
    }
  }

  moveSegments(snakeEntity, lastHeadX, lastHeadY) {
    if (snakeEntity) {
      let lastPos = { x: lastHeadX, y: lastHeadY };

      snakeEntity.segments.forEach((segment, index) => {
        const pos = segment.getComponent(PositionComponent);

        const newPosX = lastPos.x;
        const newPosY = lastPos.y;

        lastPos = { x: pos.x, y: pos.y };

        pos.x = newPosX;
        pos.y = newPosY;
      });
    }
  }

  tick() {
    if (this.active) {
      this.moveHead();
      this.updateAllPositions();
    }

    this.inputReady = true;
  }

  restart() {
    // Reset Score
    const scoreSystem = this.ecs.getSystem(ScoreSystem);
    scoreSystem.restart();

    // Reset position
    const snakeEntity = this.getEntitiesByType(SnakeEntity)[0];
    snakeEntity.restart();

    this.xDirection = 1;
    this.yDirection = 0;
    this.active = true;
  }
}
