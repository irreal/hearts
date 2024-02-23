import Phaser from "phaser";
import { Stack } from "./game-objects/stack";
import {
  createDeck,
  shuffleStack,
  sortStack,
  takeCardByModel,
  takeFromTop,
} from "./utils/stack-utils";
import { getPlayerHandStackOptions } from "./game-objects/player-hand-stack-options";
import { equalCards } from "./models/card.model";
import type { CardClickedParameters } from "./game-objects/stack";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("cardbg", "cardbackground.jpeg");
  }

  create() {
    const deck = shuffleStack(createDeck(true));

    const hand1 = takeFromTop(deck, 7);
    const stack = new Stack(
      this,
      215,
      850,
      hand1,
      getPlayerHandStackOptions("horizontal", 0)
    );
    this.add.existing(stack);
    let count = 0;
    stack.on("cardClicked", (e: CardClickedParameters) => {
      const target = hand1.find((c) => equalCards(c, e.cardModel));
      if (!target) {
        console.error("Card not found");
        return;
      }
      const cardModel = takeCardByModel(hand1, e.cardModel);
      if (cardModel) {
        const card = stack.removeCardByModel(e.cardModel);
        if (card) {
          card.updatePosition(215, 466 + count * 4, 0);
          card.setDepth(count);
          count++;
        }
        stack.recreateStack(hand1);
      }
      // target.faceUp = !target.faceUp;
      // stack.recreateStack(structuredClone(hand1));
    });
    setTimeout(() => {
      sortStack(hand1);
      stack.recreateStack(hand1);
    }, 2000);

    const hand2 = takeFromTop(deck, 7, false);
    sortStack(hand2);
    this.add.existing(
      new Stack(this, 0, 466, hand2, getPlayerHandStackOptions("vertical", 90))
    );
    const hand3 = takeFromTop(deck, 7, false);
    sortStack(hand3);
    this.add.existing(
      new Stack(
        this,
        215,
        50,
        hand3,
        getPlayerHandStackOptions("horizontal", 180)
      )
    );
    const hand4 = takeFromTop(deck, 7, false);
    sortStack(hand4);
    this.add.existing(
      new Stack(
        this,
        430,
        466,
        hand4,
        getPlayerHandStackOptions("vertical", 270)
      )
    );
  }
}
