import { CardAnimation } from "./card-animation.models";

export type StackOptions = {
  orientation: "horizontal" | "vertical";
  xSpacing: number;
  ySpacing: number;
  rotateCardsDegrees: number;
  multiRow: boolean;
  maxCardsPerRow: number;
  enterAnimation: CardAnimation | null;
};
