import Phaser from "phaser";

export default class TestScene extends Phaser.Scene {
  constructor() {
    super("test");
  }

  preload() {
    this.load.image("cardbg", "cardbackground.jpeg");
  }

  create() {
    // const card = new Card(this, 100, 100, {
    //   faceUp: false,
    //   value: "A",
    //   suit: "hearts",
    // });
    // this.add.existing(card);
    // const stack = new Stack(
    //   this,
    //   100,
    //   100,
    //   [
    //     {
    //       faceUp: true,
    //       value: "A",
    //       suit: "hearts",
    //     },
    //   ],
    //   getPlayerHandStackOptions("horizontal", 0)
    // );
  }
}
