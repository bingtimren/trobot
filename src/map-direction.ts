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
 * Return numeric enum {@link MapDirection} mapped from name, throw Error if name not found
 * @param direction : name of direction, e.g. WEST
 */
export function getMapDirectionFromName(direction: string): MapDirection {
  const dirLookedUp = MapDirection[direction as keyof typeof MapDirection];
  if (typeof dirLookedUp !== "number") {
    throw new Error(`Unknown direction name: ${direction}`);
  } else {
    return dirLookedUp;
  }
}

/**
 * Return numeric enum {@link MapDirection} from numeric index, throw Error if index out of bound
 * @param direction : numeric enum index, e.g. 0 for WEST
 */

export function getMapDirectionFromIndex(direction: number) {
  const dirLookedUp = MapDirection[direction];
  if (typeof dirLookedUp !== "string") {
    throw new Error(`Direction index out of bound: ${direction}`);
  } else {
    return direction;
  }
}

/**
 * Turn a {@link MapDirection} left or right multiple (n) of 90 degrees
 * @param direction
 * @param n number of 90 degrees to turn, positive to turn right, negative to turn left
 */
export function turn90Degrees(
  direction: MapDirection,
  n: number
): MapDirection {
  return (((direction + n) % mapDirs.length) + mapDirs.length) % mapDirs.length;
}
