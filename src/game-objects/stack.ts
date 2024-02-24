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

    const cardsPerRow = Math.min(stack.length, this.options.maxCardsPerRow);

    if (this.options.orientation === "horizontal") {
      const initialCardX =
        (((cardsPerRow - 1) * this.options.xSpacing) / 2) * -1;
      let cardX = initialCardX;
      let cardY = 0;

      for (let i = 0; i < stack.length; i++) {
        positions.push({ x: cardX, y: cardY });

        const isEndOfRow = i % cardsPerRow === cardsPerRow - 1;
        if (isEndOfRow) {
          // Move to the next row
          cardY += this.options.ySpacing;
          cardX = initialCardX;
        } else {
          // Move to the next card in the same row
          cardX += this.options.xSpacing;
        }
      }
    } else if (this.options.orientation === "vertical") {
      const initialCardY =
        (((cardsPerRow - 1) * this.options.ySpacing) / 2) * -1;
      let cardY = initialCardY;
      let cardX = 0;

      for (let i = 0; i < stack.length; i++) {
        positions.push({ x: cardX, y: cardY });

        const isEndOfColumn = i % cardsPerRow === cardsPerRow - 1;
        if (isEndOfColumn) {
          // Move to the next column
          cardX += this.options.xSpacing;
          cardY = initialCardY;
        } else {
          // Move to the next card in the same column
          cardY += this.options.ySpacing;
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
            i,
            this.options.rotateCardsDegrees
          );
        } else {
          existing.updatePosition(
            this.x + positions[i].x,
            this.y + positions[i].y,
            this.options.rotateCardsDegrees
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

  removeCardByModel(card: CardModel): Card | undefined {
    const existing = this.cardObjects.find((c) =>
      equalCards(c.cardModel, card)
    );
    if (existing) {
      this.cardObjects = this.cardObjects.filter((c) => c !== existing);
      return existing;
    }
    return undefined;
  }
}
function recreateCard(
  existing: Card,
  newCardModel: CardModel,
  x: number,
  y: number,
  depth: number,
  rotation: number
) {
  existing.cardModel = structuredClone(newCardModel);
  existing.x = x;
  existing.y = y;
  existing.updateTexture();
  existing.updatePosition(x, y, rotation);
  existing.setDepth(depth);
}
