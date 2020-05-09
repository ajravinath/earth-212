import { AssetKeys, SceneKeys } from '~/common/constants';
class Preload extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preload);
  }

  preload() {
    this.load.spritesheet(
      AssetKeys.SpriteSheetGround,
      'tiles/spritesheet_ground_extruded.png',
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 }
    );
    this.load.spritesheet(
      AssetKeys.SpriteSheetTiles,
      'tiles/spritesheet_tiles_extruded.png',
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 }
    );
    this.load.spritesheet(
      AssetKeys.SpriteSheetSimplifiedTiles,
      'tiles/spritesheet_tiles_extruded.png',
      { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2 }
    );

    this.load.tilemapTiledJSON(
      AssetKeys.PlatformerL1,
      'tiles/platformer_l1.json'
    );

    this.load.atlas(
      AssetKeys.NinjaFrog,
      'sprites/ninja_frog.png',
      'sprites/ninja_frog.json'
    );
  }

  create() {
    this.scene.start(SceneKeys.Level1);
  }
}

export default Preload;
