import Phaser from 'phaser';

import Level1 from './scenes/level1';
import Preload from './scenes/preload';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 200 }
    }
  },
  scene: [Preload, Level1]
};

export default new Phaser.Game(config);
