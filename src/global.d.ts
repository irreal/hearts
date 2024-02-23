export {};

declare global {
  // eslint-disable-next-line no-var
  var config: {
    cardWidth: number;
    cardHeight: number;
    cardTextSize: string;
    animationSpeedFactor: number;
    defaultAnimationDelay: number;
    defaultAnimationDuration: number;
    defaultAnimationStagger: number;
  };
  // eslint-disable-next-line no-var
  var degToRad: (degrees: number) => number;
}
