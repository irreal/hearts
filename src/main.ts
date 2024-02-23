import Phaser from "phaser";

import HelloWorldScene from "./HelloWorldScene";
import "./config";
import TestScene from "./TestScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  height: 932,
  width: 430,
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
