import { HeadDirection, MapDirection } from "./map-direction";

const directions = ["WEST", "NORTH", "EAST", "SOUTH"];

describe("map-direction.HeadDirection", () => {
  test("should construct HeadDirection with valid names", () => {
    for (let i = 0; i < directions.length; i++) {
      const head = new HeadDirection(directions[i]);
      expect(head.facing).toBe(i);
      expect(
        head.desc.xOffset === 0 ||
          head.desc.xOffset === 1 ||
          head.desc.xOffset === -1
      ).toBe(true);
      expect(
        head.desc.yOffset === 0 ||
          head.desc.yOffset === 1 ||
          head.desc.yOffset === -1
      ).toBe(true);
      expect(Math.abs(head.desc.xOffset + head.desc.yOffset)).toBe(1);
    }
  });
  test("should construct HeadDirection with valid direction indexes", () => {
    for (let i = 0; i < directions.length; i++) {
      const head = new HeadDirection(i);
      expect(head.facing).toBe(i);
      expect(MapDirection[head.facing]).toBe(directions[i]);
    }
  });
  test("should throw error if construct HeadDirection with invalid name", () => {
    expect(() => {
      new HeadDirection("Not a direction");
    }).toThrowError();
  });
  test("should turn correctly", () => {
    const head = new HeadDirection("WEST");
    head.turn90Degrees(1);
    expect(MapDirection[head.facing]).toBe("NORTH");
    head.turn90Degrees(1);
    expect(MapDirection[head.facing]).toBe("EAST");
    head.turn90Degrees(1);
    expect(MapDirection[head.facing]).toBe("SOUTH");
    head.turn90Degrees(1);
    expect(MapDirection[head.facing]).toBe("WEST");
    head.turn90Degrees(-1);
    expect(MapDirection[head.facing]).toBe("SOUTH");
    head.turn90Degrees(-1);
    expect(MapDirection[head.facing]).toBe("EAST");
    head.turn90Degrees(-1);
    expect(MapDirection[head.facing]).toBe("NORTH");
    head.turn90Degrees(-1);
    expect(MapDirection[head.facing]).toBe("WEST");
    head.turn90Degrees(9);
    expect(MapDirection[head.facing]).toBe("NORTH");
    head.turn90Degrees(-14);
    expect(MapDirection[head.facing]).toBe("SOUTH");
  });
});
