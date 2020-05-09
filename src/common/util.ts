import Phaser from 'phaser';

const DEFAULT_TILE_SIZE = 32;

enum CollisionDirection {
  Right = 'right',
  Left = 'left',
  Top = 'up',
  Bottom = 'down',
  None = 'none'
}

const getTiledObjectCoords = (
  tile: Phaser.Types.Tilemaps.TiledObject
): { x: number; y: number } => {
  return { x: tile.x! + 0.5 * tile.width!, y: tile.y! - 1.5 * tile.height! };
};

const getTiledObjectFrameId = (
  tile: Phaser.Types.Tilemaps.TiledObject,
  tileset
): number => {
  return (tile.gid ?? 0) - tileset.firstgid;
};

const checkCollisionDirection = (
  body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
  side: CollisionDirection
) => {
  body.checkCollision.left = false;
  body.checkCollision.down = false;
  body.checkCollision.right = false;
  body.checkCollision.up = false;

  body.checkCollision[side] = true;
};

export {
  getTiledObjectCoords,
  getTiledObjectFrameId,
  checkCollisionDirection,
  CollisionDirection
};
