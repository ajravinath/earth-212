import Phaser, { GameObjects } from 'phaser';
import { AssetKeys, SceneKeys, Layers } from '~/common/constants';
import {
  getTiledObjectCoords,
  getTiledObjectFrameId,
  checkCollisionDirection,
  CollisionDirection
} from '../common/util';
export default class Level1 extends Phaser.Scene {
  player;
  cursors;
  boxGroup!: Phaser.Physics.Arcade.Group;

  constructor() {
    super(SceneKeys.Level1);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: AssetKeys.PlatformerL1 });

    const tilesetGround = map.addTilesetImage(
      AssetKeys.SpriteSheetGround,
      undefined,
      32,
      32,
      1,
      2
    );

    const tilesetTiles = map.addTilesetImage(
      AssetKeys.SpriteSheetTiles,
      undefined,
      32,
      32,
      1,
      2
    );

    const groundLayer = map
      .createStaticLayer(Layers.Ground, [tilesetGround, tilesetTiles], 0, -32)
      .setOrigin(0);

    const background = map
      .createStaticLayer(
        Layers.Background,
        [tilesetGround, tilesetTiles],
        0,
        -32
      )
      .setOrigin(0);

    groundLayer.setCollisionByProperty({ collides: true });

    groundLayer.setTileLocationCallback(
      23,
      18,
      1,
      1,
      sprite => {
        (sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        return false;
      },
      this
    );

    const objectTileGroup = this.physics.add.staticGroup();
    const topCollisionOnlyObjectLayer = map.getObjectLayer(
      Layers.TopCollisionOnly
    ).objects;
    topCollisionOnlyObjectLayer.map(tile => {
      const tileCoords = getTiledObjectCoords(tile);
      const frameId = getTiledObjectFrameId(
        tile,
        map.getTileset(AssetKeys.SpriteSheetGround)
      );

      const collisionTile = <Phaser.Physics.Arcade.Sprite>(
        objectTileGroup
          .create(
            tileCoords.x,
            tileCoords.y,
            AssetKeys.SpriteSheetGround,
            frameId
          )
          .setDepth(-1)
      );

      const isTopCollision: boolean = tile.properties.find(
        prop => (prop.name = 'top')
      ).value;

      if (isTopCollision) {
        checkCollisionDirection(collisionTile.body, CollisionDirection.Top);
      } else {
        checkCollisionDirection(collisionTile.body, CollisionDirection.None);
      }
    });

    this.boxGroup = this.physics.add.group({
      dragX: 10000,
      allowGravity: false
    });
    const boxes = map.getObjectLayer(Layers.Boxes).objects;

    boxes.forEach(box => {
      const tileCoords = getTiledObjectCoords(box);
      const frameId = getTiledObjectFrameId(
        box,
        map.getTileset(AssetKeys.SpriteSheetTiles)
      );

      this.boxGroup.create(
        tileCoords.x,
        tileCoords.y,
        AssetKeys.SpriteSheetTiles,
        frameId
      );
    });

    this.player = this.physics.add.sprite(
      1300,
      450,
      AssetKeys.NinjaFrog,
      'nf_fall.png'
    );

    this.physics.world.setBounds(0, 0, groundLayer.width, this.scale.height);
    this.player.setCollideWorldBounds(true);
    this.physics.world.checkCollision.down = false;

    this.anims.create({
      key: 'nf-jump',
      frames: [{ key: AssetKeys.NinjaFrog, frame: 'nf_jump.png' }],
      frameRate: 30
    });

    this.anims.create({
      key: 'nf-fall',
      frames: [{ key: AssetKeys.NinjaFrog, frame: 'nf_fall.png' }],
      frameRate: 30
    });

    this.anims.create({
      key: 'nf-run',
      frames: this.anims.generateFrameNames(AssetKeys.NinjaFrog, {
        start: 0,
        end: 11,
        prefix: 'nf_run-',
        suffix: '.png'
      }),
      frameRate: 30,
      repeat: -1
    });

    this.anims.create({
      key: 'nf-idle',
      frames: this.anims.generateFrameNames(AssetKeys.NinjaFrog, {
        start: 0,
        end: 10,
        prefix: 'nf_idle-',
        suffix: '.png'
      }),
      frameRate: 30
    });

    this.cameras.main.setBounds(0, 0, groundLayer.width, this.scale.height);
    this.cameras.main.setScroll(1, 0);
    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(
      this.boxGroup,
      this.boxGroup,
      this.handleBoxBoxCollision
    );
    this.physics.add.collider([this.boxGroup, this.player], [objectTileGroup]);
    this.physics.add.collider([this.player, this.boxGroup], groundLayer);
    this.physics.add.collider(this.player, this.boxGroup);
  }

  update() {
    const touchingDown =
      this.player.body.blocked.down || this.player.body.touching.down;

    if (this.cursors.left.isDown) {
      this.player.setFlipX(true);
      this.player.setVelocityX(-100);
      this.player.anims.play('nf-run', true);
    } else if (this.cursors.right.isDown) {
      this.player.setFlipX(false);
      this.player.setVelocityX(100);
      this.player.anims.play('nf-run', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('nf-idle', true);
    }
    if (this.cursors.up.isDown && touchingDown) {
      this.player.setVelocityY(-200);
    }
    if (!touchingDown) {
      if (this.player.body.velocity.y > 0) {
        this.player.anims.play('nf-fall');
      } else {
        this.player.anims.play('nf-jump');
      }
    }
  }

  handleBoxBoxCollision = (
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject
  ) => {
    const object1Body = object1.body as Phaser.Physics.Arcade.Body;
    const object2Body = object2.body as Phaser.Physics.Arcade.Body;
    object1Body.setImmovable(true).setVelocityX(0);
    object2Body.setImmovable(true).setVelocityX(0);
  };
}
