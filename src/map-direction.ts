/**
 * Direction descriptor, provides the X and Y offsets of a {@link MapDirection}
 */
export interface DirectionDesc {
  xOffset: number;
  yOffset: number;
}

/**
 * A numeric enum of map directions, i.e. WEST, NORTH, EAST and SOUTH, maps to index 0-3
 */
export enum MapDirection {
  WEST = 0,
  NORTH = 1,
  EAST = 2,
  SOUTH = 3,
}

const mapDirs: DirectionDesc[] = [
  {
    xOffset: -1,
    yOffset: 0,
  },
  {
    xOffset: 0,
    yOffset: 1,
  },
  {
    xOffset: 1,
    yOffset: 0,
  },
  {
    xOffset: 0,
    yOffset: -1,
  },
];

/**
 * Return the {@link DescriptionDesc} from a {@link MapDirection}
 * @param direction
 */
export function getDirectionDescFromMapDirection(
  direction: MapDirection
): Readonly<DirectionDesc> {
  return mapDirs[direction];
}

/**
 * This class keeps the head direction as a {@link Direction}, and provides method to
 * obtain the {@link DirectionDesc} and turn the head direction by multiple number
 * of 90 degrees, either to the left or right.
 */
export class HeadDirection {
  private direction: MapDirection;
  /**
   * constructs a HeadDirection instance from a name or number, throw an Error if the name
   * or number does not belong to the index of the enum {@link MapDirection}
   *
   * @param direction name or number belong to the index of the numeric enum {@link MapDirection},
   * e.g. "WEST", 0, 1, 2, 3.
   */
  constructor(direction: string | number) {
    const dirLookedUp = MapDirection[direction as keyof typeof MapDirection];
    if (dirLookedUp === undefined) {
      throw new Error(
        `Unknown direction name or index out of bound: ${direction}`
      );
    } else {
      this.direction = (typeof direction === "string"
        ? dirLookedUp
        : direction) as MapDirection;
    }
  }
  /**
   * The {@link MapDirection} that the head is facing
   */
  get facing(): MapDirection {
    return this.direction;
  }
  /**
   * The {@link DirectionDesc} of the current head facing direction
   */
  get desc(): DirectionDesc {
    return getDirectionDescFromMapDirection(this.direction);
  }
  /**
   * Turn the head a number of 90 degrees,
   * @param n number of 90 degrees to turn, positive to turn right, negative to turn left
   */
  public turn90Degrees(n: number) {
    this.direction =
      (((this.direction + n) % mapDirs.length) + mapDirs.length) %
      mapDirs.length;
  }
}
