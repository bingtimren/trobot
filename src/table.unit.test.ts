/**
 * Integrated test for Robot and Table
 */

import { MapDirection } from "./map-direction";
import { OnePieceTable } from "./table";

const robot = {
  id: "Neo",
};

describe("Empty Table", () => {
  let table: OnePieceTable;
  beforeEach(() => {
    table = new OnePieceTable(4, 10);
  });
  test("Valid coordinations should be on-table", () => {
    expect(table.isOnTable(0, 0)).toBe(true);
    expect(table.isOnTable(3, 9)).toBe(true);
    expect(table.isOnTable(3, 0)).toBe(true);
    expect(table.isOnTable(0, 9)).toBe(true);
  });
  test("Invalid coordinations should be off-table", () => {
    const table = new OnePieceTable(4, 10);
    expect(table.isOnTable(0.5, 0)).toBe(false);
    expect(table.isOnTable(0, 0.5)).toBe(false);
    expect(table.isOnTable(-1, 0)).toBe(false);
    expect(table.isOnTable(0, -1)).toBe(false);
    expect(table.isOnTable(4, 0)).toBe(false);
    expect(table.isOnTable(0, 10)).toBe(false);
  });
  test("Any method involving a piece on table with empty table should throw Error", () => {
    expect(() => {
      table.movePieceForward(robot);
    }).toThrowError();
    expect(() => {
      table.getPoseByPieceId(robot.id);
    }).toThrowError();
    expect(() => {
      table.turnPiece90Degrees(robot, 1);
    }).toThrowError();
  });
  test("Any method involving a wrong piece should throw Error", () => {
    table.placePiece(robot, 0, 0, MapDirection.EAST);
    const smith = { id: "smith" };
    expect(() => {
      table.movePieceForward(smith);
    }).toThrowError();
    expect(() => {
      table.getPoseByPieceId(smith.id);
    }).toThrowError();
    expect(() => {
      table.turnPiece90Degrees(smith, 1);
    }).toThrowError();
  });

  test("Place robot off-table, table should remain empty", () => {
    table.placePiece(robot, 4, 10, MapDirection.EAST);
    expect((table as any).piece).toBeUndefined();
  });
  test("Place robot on table, robot should work normally", () => {
    expect(table.placePiece(robot, 2, 5, MapDirection.EAST)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.EAST,
    });
    // examine behaviors: turn
    expect(table.turnPiece90Degrees(robot, 1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.SOUTH,
    });
    expect(table.turnPiece90Degrees(robot, 1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.WEST,
    });
    expect(table.turnPiece90Degrees(robot, 1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.NORTH,
    });
    expect(table.turnPiece90Degrees(robot, -1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.WEST,
    });
    expect(table.turnPiece90Degrees(robot, -1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.SOUTH,
    });
    expect(table.turnPiece90Degrees(robot, -1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.EAST,
    });
    // move
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 3,
      y: 5,
      facing: MapDirection.EAST,
    });
  });
  test("Invalid commands shall be ignored and robot remain operable", () => {
    expect(table.placePiece(robot, 200, 500, MapDirection.EAST)).toBeInstanceOf(
      Error
    );
    expect((table as any).piece).toBe(undefined);
    // a series of illegal operations, should be ignored
    expect(() => {
      table.getPoseByPieceId(robot.id);
    }).toThrowError();
    // table still empty, these commands will throw error
    expect((table as any).piece).toBe(undefined);
    expect(() => {
      table.movePieceForward(robot);
    }).toThrowError();
    expect(() => {
      table.getPoseByPieceId(robot.id);
    }).toThrowError();
    expect(() => {
      table.turnPiece90Degrees(robot, 1);
    }).toThrowError();
    // place on table
    expect(table.placePiece(robot, 2, 5, MapDirection.EAST)).toBeUndefined();
    expect((table as any).piece).toBe(robot);
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.EAST,
    });
    // examine behaviors
    expect(table.turnPiece90Degrees(robot, 1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.SOUTH,
    });
    // forward, until fall
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 4,
      facing: MapDirection.SOUTH,
    });
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 3,
      facing: MapDirection.SOUTH,
    });
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 2,
      facing: MapDirection.SOUTH,
    });
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 1,
      facing: MapDirection.SOUTH,
    });
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 0,
      facing: MapDirection.SOUTH,
    });
    expect(table.movePieceForward(robot)).toBeInstanceOf(Error);
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 0,
      facing: MapDirection.SOUTH,
    });
    // turn back
    expect(table.turnPiece90Degrees(robot, -1)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 2,
      y: 0,
      facing: MapDirection.EAST,
    });
    // still operable
    expect(table.movePieceForward(robot)).toBeUndefined();
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 3,
      y: 0,
      facing: MapDirection.EAST,
    });
    // another invalid place-on-table command, should silently return an error and has no effect
    expect(table.placePiece(robot, 200, 500, MapDirection.EAST)).toBeInstanceOf(
      Error
    );
    expect(table.getPoseByPieceId(robot.id)).toEqual({
      x: 3,
      y: 0,
      facing: MapDirection.EAST,
    });
  });
});
