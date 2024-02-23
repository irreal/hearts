import { CardModel, SuitColorMap, SuitSymbolMap } from "../models/card.model";

export class Card extends Phaser.GameObjects.Container {
  cardModel: CardModel;
  scene: Phaser.Scene;
  tween: Phaser.Tweens.BaseTween | null = null;

  updatePosition(x: number, y: number, rotationDegrees: number) {
    if (this.tween) {
      this.tween.stop();
    }
    this.tween = this.scene.tweens.add({
      targets: this,
      x: x,
      y: y,
      rotation: degToRad(rotationDegrees),
      duration: config.defaultAnimationDuration * config.animationSpeedFactor, // duration of the tween in milliseconds
      ease: "Power2", // easing function to use
    });
  }

  updateTexture() {
    this.removeAll(true);
    const graphics = new Phaser.GameObjects.Graphics(this.scene, {
      fillStyle: {
        color: 0xfffffffff,
        alpha: 1,
      },
      lineStyle: {
        width: 2,
        color: 0x000000, // black color
        alpha: 1,
      },
    });
    const rectX = -config.cardWidth / 2;
    const rectY = -config.cardHeight / 2;
    const rectWidth = config.cardWidth;
    const rectHeight = config.cardHeight;

    graphics.fillRect(rectX, rectY, rectWidth, rectHeight);
    graphics.strokeRect(rectX, rectY, rectWidth, rectHeight); // add this line to draw a black border
    this.add(graphics);

    if (!this.cardModel.faceUp) {
      const image = new Phaser.GameObjects.Image(this.scene, 0, 0, "cardbg");
      image.displayWidth = config.cardWidth;
      image.displayHeight = config.cardHeight;
      image.setOrigin(0.5);
      this.add(image);
      return;
    }

    const textX = rectX + rectWidth / 2;
    const textY = rectY + rectHeight / 3; // adjust this to position the value text
    const valueText = new Phaser.GameObjects.Text(
      this.scene,
      textX,
      textY,
      `${this.cardModel.value}`,
      {
        fontSize: config.cardTextSize,
        color: SuitColorMap[this.cardModel.suit],
        align: "center",
      }
    );

    const suitTextY = textY + rectHeight / 3; // adjust this to position the suit text
    const suitText = new Phaser.GameObjects.Text(
      this.scene,
      textX,
      suitTextY,
      `${SuitSymbolMap[this.cardModel.suit]}`,
      {
        fontSize: "42px",
        color: SuitColorMap[this.cardModel.suit],
        align: "center",
      }
    );

    valueText.setOrigin(0.5); // set origin to the center of the text
    suitText.setOrigin(0.5); // set origin to the center of the text
    this.add(valueText);
    this.add(suitText);
  }
  constructor(scene: Phaser.Scene, x: number, y: number, cardModel: CardModel) {
    super(scene, x, y, []);
    this.scene = scene;
    this.cardModel = cardModel;

    this.setInteractive(
      new Phaser.Geom.Rectangle(
        -config.cardWidth / 2,
        -config.cardHeight / 2,
        config.cardWidth,
        config.cardHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );
    this.on("pointerdown", () => {
      this.emit("cardClicked");
    });

    this.updateTexture();
  }
}
