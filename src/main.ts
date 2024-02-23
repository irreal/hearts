import Phaser from "phaser";

import HelloWorldScene from "./HelloWorldScene";
import "./config";
import TestScene from "./TestScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    width: 430,
    height: 932,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "app",
  },
  backgroundColor: "#608C51",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [HelloWorldScene, TestScene],
  // scene: [TestScene, HelloWorldScene],
};

export default new Phaser.Game(config);
