import { Application, Ticker } from "pixi.js";
import PixiECS, { Entity, Component, System } from "./utils/pixi-ecs";
import SnakeEntity from "./entities/SnakeEntity";
import RenderSystem from "./systems/RenderSystem";
import MovementSystem from "./systems/MovementSystem";
import gridConfig from "./config/gridConfig";
import FoodSystem from "./systems/FoodSystem";
import ScoreEntity from "./entities/ScoreEntity";
import ScoreSystem from "./systems/ScoreSystem";

const GRID_WIDTH = gridConfig.size * gridConfig.width;
const GRID_HEIGHT = gridConfig.size * gridConfig.height;

// create PIXI application
const app = new Application({
  width: GRID_WIDTH,
  height: GRID_HEIGHT + gridConfig.infoWindowHeight,
  backgroundColor: 0x111111,
});

// append renderer to the DOM
document.getElementById("game").appendChild(app.view);

// ECS
let ECS = new PixiECS(app);

// Initial Systems
ECS.addSystem(new RenderSystem());
ECS.addSystem(new MovementSystem());
ECS.addSystem(new ScoreSystem());

const foodSystem = new FoodSystem();
ECS.addSystem(foodSystem);

// Initial Entities
ECS.addEntity(new SnakeEntity(gridConfig.startPos.x, gridConfig.startPos.y));
ECS.addEntity(new ScoreEntity("Score: ", 10, GRID_HEIGHT));

// Initial Spawns
foodSystem.spawn();

// Ticker
const ticker = Ticker.shared;

let lastSecond = 0;
ticker.add((delta) => {
  if (ECS.started) {
    let now = performance.now();
    ECS.update(now);

    if (now - lastSecond >= 250) {
      lastSecond = now;
      ECS.tick(now);
    }
  } else {
    ECS.onReady();
  }
});
