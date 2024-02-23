import { CardAnimation } from "../models/card-animation.models";

export function getPositionAndTween(
  ownerX: number,
  ownerY: number,
  targetX: number,
  targetY: number,
  index: number,
  animation: CardAnimation | null
): {
  startX: number;
  startY: number;
  tween:
    | Phaser.Types.Tweens.TweenBuilderConfig
    | Phaser.Types.Tweens.TweenChainBuilderConfig
    | Phaser.Tweens.Tween
    | Phaser.Tweens.TweenChain
    | null;
} {
  if (!animation) {
    return { startX: targetX - ownerX, startY: targetY - ownerY, tween: null };
  }
  if (animation.type === "fly-in") {
    return {
      startX: animation.originX - ownerX,
      startY: animation.originY - ownerY,
      tween: {
        targets: null,
        x: targetX,
        y: targetY,
        duration: animation.duration * config.animationSpeedFactor,
        delay:
          animation.delay * config.animationSpeedFactor +
          index * (animation.stagger * config.animationSpeedFactor),
        ease: animation.ease,
      },
    };
  }
  return { startX: targetX, startY: targetY, tween: null };
}

export function addDelay(
  animation: CardAnimation,
  delay = config.defaultAnimationDelay
): CardAnimation {
  return { ...animation, delay: animation.delay + delay };
}
