import {
  getDirectionDescFromMapDirection,
  getMapDirectionFromIndex,
  getMapDirectionFromName,
  MapDirection,
  turn90Degrees,
} from "./map-direction";

const directions = ["WEST", "NORTH", "EAST", "SOUTH"];

describe("map-direction.HeadDirection", () => {
  test("should get MapDirection with valid names, with outwardly correct offsets", () => {
    for (let i = 0; i < directions.length; i++) {
      const head = getMapDirectionFromName(directions[i]) as MapDirection;
      const { xOffset, yOffset } = getDirectionDescFromMapDirection(head);
      expect(head).toBe(i);
      expect(xOffset === 0 || xOffset === 1 || xOffset === -1).toBe(true);
      expect(yOffset === 0 || yOffset === 1 || yOffset === -1).toBe(true);
      expect(Math.abs(xOffset + yOffset)).toBe(1);
    }
  });
  test("should construct MapDirection with valid direction indexes", () => {
    for (let i = 0; i < directions.length; i++) {
      const head = getMapDirectionFromIndex(i) as MapDirection;
      expect(head).toBe(i);
      expect(MapDirection[head]).toBe(directions[i]);
    }
  });
  test("should throw error if construct HeadDirection with invalid name or index", () => {
    expect(getMapDirectionFromName("Not a direction")).toBeInstanceOf(Error);
    expect(getMapDirectionFromIndex(-1)).toBeInstanceOf(Error);
  });
  test("should turn correctly", () => {
    let head: MapDirection = MapDirection.WEST;
    head = turn90Degrees(head, 1);
    expect(MapDirection[head]).toBe("NORTH");
    head = turn90Degrees(head, 1);
    expect(MapDirection[head]).toBe("EAST");
    head = turn90Degrees(head, 1);
    expect(MapDirection[head]).toBe("SOUTH");
    head = turn90Degrees(head, 1);
    expect(MapDirection[head]).toBe("WEST");
    head = turn90Degrees(head, -1);
    expect(MapDirection[head]).toBe("SOUTH");
    head = turn90Degrees(head, -1);
    expect(MapDirection[head]).toBe("EAST");
    head = turn90Degrees(head, -1);
    expect(MapDirection[head]).toBe("NORTH");
    head = turn90Degrees(head, -1);
    expect(MapDirection[head]).toBe("WEST");
    head = turn90Degrees(head, 9);
    expect(MapDirection[head]).toBe("NORTH");
    head = turn90Degrees(head, -14);
    expect(MapDirection[head]).toBe("SOUTH");
  });
});
