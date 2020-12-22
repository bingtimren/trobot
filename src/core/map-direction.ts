/**
 * Implements a direction system commonly used by maps. Provides a direction type (an enum), and functions for converting the direction type to
 * and from number and string, as well as for handling the directions (turning).
 * @packageDocumentation
 */

/**
 * Direction descriptor, provides the X and Y offsets of a {@link MapDirection}. NORTH corresponds
 * to x+1, EAST corresponds to y+1
 */
export interface DirectionDesc {
  xOffset: number;
  yOffset: number;
}

/**
 * A numeric enum of map directions, i.e. WEST, NORTH, EAST and SOUTH, maps to index from 0 to 3
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
 * Returns the name of a direction, e.g. WEST
 * @param direction
 */
export function getDirectionNameFromDirection(direction: MapDirection): string {
  return MapDirection[direction];
}

/**
 * Return the numeric enum {@link MapDirection} mapped from name, 
 * return Error if name not found.
 * @param direction : name of direction, e.g. WEST
 */
export function getMapDirectionFromName(
  direction: string
): MapDirection | Error {
  const dirLookedUp = MapDirection[direction as keyof typeof MapDirection];
  return typeof dirLookedUp === "number"
    ? dirLookedUp
    : new Error(`Unknown direction name: ${direction}`);
}

/**
 * Return numeric enum {@link MapDirection} from numeric index, return Error if index out of bound
 * @param direction : numeric enum index, e.g. 0 for WEST
 */

export function getMapDirectionFromIndex(
  direction: number
): MapDirection | Error {
  const dirLookedUp = MapDirection[direction];
  return typeof dirLookedUp !== "string"
    ? new Error(`Direction index out of bound: ${direction}`)
    : direction;
}

/**
 * Turn a {@link MapDirection} left or right multiple (n) of 90 degrees
 * @param direction
 * @param n number of 90 degrees to turn, positive to turn right, negative to turn left
 * @returns the result direction after the turns
 */
export function turn90Degrees(
  direction: MapDirection,
  n: number
): MapDirection {
  return (((direction + n) % mapDirs.length) + mapDirs.length) % mapDirs.length;
}
