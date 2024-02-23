import { StackOptions } from "../models/stack-options.model";

export function getPlayerHandStackOptions(
  orientation: "horizontal" | "vertical",
  rotation = 0,
  animationDelay = 0
): StackOptions {
  return {
    orientation,
    xSpacing: 59,
    ySpacing: 59,
    rotateCardsDegrees: rotation,
    multiRow: true,
    maxCardsPerRow: 7,
    enterAnimation: {
      type: "fly-in",
      originX: 215,
      originY: 466,
      delay: animationDelay,
      duration: config.defaultAnimationDuration,
      stagger: config.defaultAnimationStagger,
      ease: "Power2",
    },
  };
}
