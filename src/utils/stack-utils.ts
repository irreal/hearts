import { CardModel, Suits, Values, equalCards } from "../models/card.model";
import { StackModel } from "../models/stack.model";

export const createDeck = (faceUp = false): StackModel => {
  const deck: StackModel = [];
  for (const suit of Suits) {
    for (const value of Values) {
      deck.push({ suit, value, faceUp });
    }
  }
  return deck;
};

export const shuffleStack = (stack: StackModel): StackModel => {
  const shuffledStack = [...stack];
  for (let i = shuffledStack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledStack[i], shuffledStack[j]] = [shuffledStack[j], shuffledStack[i]];
  }
  return shuffledStack;
};

export function takeFromTop(
  stack: StackModel,
  count: number,
  faceUp: boolean | null = null
): StackModel {
  const newCards = stack.splice(0, count);
  if (faceUp === null) {
    return newCards;
  }
  for (const card of newCards) {
    card.faceUp = faceUp;
  }
  return newCards;
}

export function takeFromBottom(
  stack: StackModel,
  count: number,
  faceUp: boolean | null = null
): StackModel {
  const newCards = stack.splice(stack.length - count, count);
  if (faceUp === null) {
    return newCards;
  }
  for (const card of newCards) {
    card.faceUp = faceUp;
  }
  return newCards;
}

export function sortStack(stack: StackModel): void {
  stack.sort((a, b) => {
    if (a.suit === b.suit) {
      return Values.indexOf(a.value) - Values.indexOf(b.value);
    }
    return Suits.indexOf(a.suit) - Suits.indexOf(b.suit);
  });
}

export function takeCardByModel(stack: StackModel, card: CardModel) {
  const index = stack.findIndex((c) => equalCards(c, card));
  if (index === -1) {
    return undefined;
  }
  return stack.splice(index, 1)[0];
}
