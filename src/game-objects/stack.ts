import { CardModel, equalCards } from "../models/card.model";
import { Card } from "./card";
import { StackOptions } from "../models/stack-options.model";
import { StackModel } from "../models/stack.model";
import { getPositionAndTween } from "../utils/animation-utils";

export type CardClickedParameters = {
  objects: Card[];
  card: Card;
  index: number;
  cardModel: CardModel;
};
export class Stack extends Phaser.GameObjects.GameObject {
  options: StackOptions;
  x: number;
  y: number;
  // cards: CardModel[];
  cardObjects: Card[] = [];
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    cardModels: CardModel[],
    options: StackOptions
  ) {
    super(scene, "stack");
    this.x = x;
    this.y = y;
    this.options = options;
    const positions = this.createPositions(cardModels);

    for (let i = 0; i < cardModels.length; i++) {
      this.createCard(
        scene,
        cardModels[i],
        this.x + positions[i].x,
        this.y + positions[i].y,
        i,
        i
      );
    }
  }

  createCard(
    scene: Phaser.Scene,
    cardModel: CardModel,
    x: number,
    y: number,
    index: number,
    depth: number
  ): Card {
    const animationDetails = getPositionAndTween(
      x,
      y,
      index,
      this.options.enterAnimation
    );
    const card = new Card(
      scene,
      animationDetails.startX,
      animationDetails.startY,
      structuredClone(cardModel)
    );
    if (animationDetails.tween) {
      card.tween = scene.tweens.add({
        ...animationDetails.tween,
        targets: card,
      });
    }
    card.on("cardClicked", () => {
      this.emit("cardClicked", {
        objects: this.cardObjects,
        card,
        index,
        cardModel,
      } satisfies CardClickedParameters);
    });
    card.rotation = degToRad(this.options.rotateCardsDegrees);
    card.setDepth(depth);
    scene.add.existing(card);
    this.cardObjects.push(card);
    return card;
  }

  createPositions(stack: StackModel): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];

    let cardX = 0;
    let cardY = 0;
    for (let i = 0; i < stack.length; i++) {
      positions.push({ x: cardX, y: cardY });
      if (this.options.orientation === "horizontal") {
        cardX += this.options.xSpacing;
      }
      if (this.options.orientation === "vertical") {
        cardY += this.options.ySpacing;
      }

      if ((i + 1) % this.options.maxCardsPerRow === 0) {
        if (!this.options.multiRow) {
          break;
        }
        if (this.options.orientation === "horizontal") {
          cardY += this.options.ySpacing;
          cardX = 0;
        }
        if (this.options.orientation === "vertical") {
          cardX += this.options.xSpacing;
          cardY = 0;
        }
      }
    }
    return positions;
  }

  recreateStack(stack: StackModel) {
    const seen: Card[] = [];
    const positions = this.createPositions(stack);

    for (let i = 0; i < stack.length; i++) {
      const existing = this.cardObjects.find((card) =>
        equalCards(card.cardModel, stack[i])
      );
      if (existing) {
        existing.setDepth(i);
        seen.push(existing);
        if (existing.cardModel.faceUp !== stack[i].faceUp) {
          recreateCard(
            existing,
            stack[i],
            this.x + positions[i].x,
            this.y + positions[i].y,
            i
          );
        } else {
          existing.updatePosition(
            this.x + positions[i].x,
            this.y + positions[i].y
          );
          // console.log("setting depth", i);
        }
      } else {
        seen.push(
          this.createCard(
            this.scene,
            stack[i],
            this.x + positions[i].x,
            this.y + positions[i].y,
            i,
            i
          )
        );
      }
    }

    for (let i = 0; i < this.cardObjects.length; i++) {
      if (!seen.includes(this.cardObjects[i])) {
        this.cardObjects[i].destroy();
        this.cardObjects.splice(i, 1);
      }
    }
  }
}
function recreateCard(
  existing: Card,
  newCardModel: CardModel,
  x: number,
  y: number,
  depth: number
) {
  existing.cardModel = structuredClone(newCardModel);
  existing.x = x;
  existing.y = y;
  existing.updateTexture();
  existing.updatePosition(x, y);
  existing.setDepth(depth);
}
