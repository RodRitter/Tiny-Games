import { Graphics, Text } from "pixi.js";
import TextComponent from "../components/TextComponent";
import gridConfig from "../config/gridConfig";
import ScoreEntity from "../entities/ScoreEntity";
import { System } from "../utils/pixi-ecs";

export default class ScoreSystem extends System {
  constructor() {
    super();
    this.textObject = null;
    this.dividerObject = null;
    this.score = 0;
    this.isDead = false;
  }

  bumpScore() {
    this.score += 1;
  }

  createText() {
    if (!this.dividerObject) {
      // Create divider line
      const lineGraphic = new Graphics();
      const lineEdgeY = gridConfig.size * gridConfig.height;
      const lineEdgeX = gridConfig.size * gridConfig.width;
      lineGraphic.lineStyle(2, 0xffffff, 1);
      lineGraphic.moveTo(0, lineEdgeY);
      lineGraphic.lineTo(lineEdgeX, lineEdgeY);
      lineGraphic.endFill();
      this.dividerObject = lineGraphic;
      this.ecs.app.stage.addChild(lineGraphic);
    }

    if (!this.textObject) {
      const scoreEntity = this.getEntitiesByType(ScoreEntity)[0];
      const textComponent = scoreEntity.getComponent(TextComponent);
      const _textObject = new Text(textComponent.text || "");

      _textObject.style.fontSize = 18;
      _textObject.style.fontFamily = "Verdana";

      // Assign pixi text
      this.textObject = _textObject;
      this.ecs.app.stage.addChild(_textObject);
    }

    this.updateText();
  }

  updateText() {
    if (this.textObject) {
      const scoreEntity = this.getEntitiesByType(ScoreEntity)[0];
      const textComponent = scoreEntity.getComponent(TextComponent);

      this.textObject.style.fill = textComponent.color;
      this.textObject.style.align = "center";

      if (this.isDead) {
        this.textObject.style.fontSize = 14;
      } else {
        this.textObject.style.fontSize = 18;
      }

      const newScore =
        textComponent.text + this.score.toString().padStart(3, "0");
      const deathText =
        "Game Over\nScore: " + this.score + '\nPress "R" to restart';
      this.textObject.text = this.isDead ? deathText : newScore;

      // fontSize half the info panel height and centered
      const halfPanel = gridConfig.infoWindowHeight / 2;

      const offsetVertCentered =
        gridConfig.size * gridConfig.height +
        halfPanel -
        this.textObject.height / 2;

      const offsetHorCentered =
        (gridConfig.size * gridConfig.width) / 2 - this.textObject.width / 2;

      this.textObject.position.set(offsetHorCentered, offsetVertCentered);
    }
  }

  restart() {
    this.score = 0;
    this.isDead = false;
  }

  gameOver() {
    this.isDead = true;
  }

  tick() {
    this.createText();
  }
}
