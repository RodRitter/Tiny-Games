import PositionComponent from "../components/PositionComponent";
import gridConfig from "../config/gridConfig";
import FoodEntity from "../entities/FoodEntity";
import SnakeEntity from "../entities/SnakeEntity";
import { System } from "../utils/pixi-ecs";

export default class FoodSystem extends System {
  constructor() {
    super();
    this.food = null;
  }

  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomXY() {
    const x = this.randomBetween(0, gridConfig.width - 1);
    const y = this.randomBetween(0, gridConfig.height - 1);
    return { x, y };
  }

  eat() {
    this.spawn();
  }

  spawn() {
    const snakeEntity = this.getEntitiesByType(SnakeEntity)[0];
    const snakePos = snakeEntity.getComponent(PositionComponent);
    const randomPos = this.randomXY();
    let overlap = true;

    let _count =
      gridConfig.width * gridConfig.height - snakeEntity.segments.length;

    while (overlap && _count) {
      _count--;

      // Check if new food position overlaps with snake HEAD
      if (snakePos.x !== randomPos.x || snakePos.y !== randomPos.y) {
        overlap = false;
      } else {
        overlap = true;
      }

      // Check if new food position overlaps with snake BODY segment
      snakeEntity.segments.forEach((segment) => {
        const segmentPos = segment.getComponent(PositionComponent);
        if (segmentPos.x !== randomPos.x || segmentPos.y !== randomPos.y) {
          overlap = false;
        } else {
          overlap = true;
        }
      });
    }

    // Is not same position
    if (this.food) {
      const foodPos = this.food.getComponent(PositionComponent);
      if (foodPos.x === randomPos.x && foodPos.y === randomPos.y) {
        overlap = true;
      }
    }

    if (!overlap) {
      if (!this.food) {
        const newFood = new FoodEntity(randomPos.x, randomPos.y);
        this.food = newFood;
        this.ecs.addEntity(newFood);
      } else {
        const foodPos = this.food.getComponent(PositionComponent);
        foodPos.x = randomPos.x;
        foodPos.y = randomPos.y;
      }
    }
  }
}
