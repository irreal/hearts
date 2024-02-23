globalThis.config = {
  cardWidth: 65,
  cardHeight: 117,
  cardTextSize: "42px",
  animationSpeedFactor: 1,
  defaultAnimationDelay: 500,
  defaultAnimationDuration: 300,
  defaultAnimationStagger: 100,
};
globalThis.degToRad = function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
};
