import Phaser from "phaser";
import { getPlayerHandStackOptions } from "./game-objects/player-hand-stack-options";
import { CardClickedParameters, Stack } from "./game-objects/stack";
import { CardModel, equalCards } from "./models/card.model";
import {
  createDeck,
  shuffleStack,
  takeFromBottom,
  takeFromTop,
} from "./utils/stack-utils";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super("test");
  }

  preload() {
    this.load.image("cardbg", "cardbackground.jpeg");
  }

  create() {
    // const card = new Card(this, 100, 100, {
    //   faceUp: false,
    //   value: "A",
    //   suit: "hearts",
    // });
    // this.add.existing(card);
    const graphics = new Phaser.GameObjects.Graphics(this, {
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
    const rectX = 210;
    const rectY = 0;
    const rectWidth = 10;
    const rectHeight = 932;

    graphics.fillRect(rectX, rectY, rectWidth, rectHeight);
    graphics.strokeRect(rectX, rectY, rectWidth, rectHeight); // add this line to draw a black border

    const rectX2 = 0;
    const rectY2 = 461;
    const rectWidth2 = 430;
    const rectHeight2 = 10;

    graphics.fillRect(rectX2, rectY2, rectWidth2, rectHeight2);
    graphics.strokeRect(rectX2, rectY2, rectWidth2, rectHeight2); // add this line to draw a black border

    this.add.existing(graphics);
    let stack: CardModel[] = takeFromBottom(shuffleStack(createDeck(true)), 10);
    const stackObject = new Stack(this, 215, 466, stack, {
      ...getPlayerHandStackOptions("vertical", 90),
      maxCardsPerRow: 4,
      ySpacing: 90,
      xSpacing: 20,
    });
    let counter = 0;
    stackObject.on("cardClicked", (e: CardClickedParameters) => {
      console.log(e);
      const model = stackObject.removeCardByModel(e.cardModel);
      model?.updatePosition(100, 100 + counter * 10, 0);
      counter++;
      model?.setDepth(counter);
      console.log("len before: ", stack.length);
      stack = stack.filter((c) => !equalCards(c, e.cardModel));
      console.log("len after: ", stack.length);
      stackObject.recreateStack(stack);
    });
  }
}
