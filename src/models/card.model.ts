export type CardModel = {
  suit: CardSuitModel;
  value: CardValueModel;
  faceUp: boolean;
};

export const Suits = ["clubs", "diamonds", "spades", "hearts"] as const;
export const SuitSymbolMap = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
} as const;
export const SuitColorMap = {
  hearts: "#ff0000",
  diamonds: "#ff0000",
  clubs: "#000000",
  spades: "#000000",
} as const;

export const Values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export type CardSuitModel = (typeof Suits)[number];
export type CardValueModel = (typeof Values)[number];

export const equalCards = (card1: CardModel, card2: CardModel) =>
  card1.suit === card2.suit && card1.value === card2.value;
