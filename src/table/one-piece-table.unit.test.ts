/**
 * Integrated test for Robot and Table
 */

import { MapDirection } from "../core/map-direction";
import { OnePieceTable, OnePieceTableError } from "./one-piece-table";

const robot = "Neo";

describe("Empty Table", () => {
  let table: OnePieceTable<string>;
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
    expect(table.isOnTable(0.5, 0)).toBe(false);
    expect(table.isOnTable(0, 0.5)).toBe(false);
    expect(table.isOnTable(-1, 0)).toBe(false);
    expect(table.isOnTable(0, -1)).toBe(false);
    expect(table.isOnTable(4, 0)).toBe(false);
    expect(table.isOnTable(0, 10)).toBe(false);
  });
  test("Any method involving a piece on table with empty table should return Error", () => {
    expect(
      table.movePiece(robot, { xOffset: 1, yOffset: 1, turn: 0 })
    ).toBeInstanceOf(OnePieceTableError);
    expect(table.getPoseByPiece(robot)).toBeInstanceOf(OnePieceTableError);
  });
  test("Any method involving a wrong piece should return Error", () => {
    table.placePiece(robot, { x: 0, y: 0, facing: MapDirection.EAST });
    const smith = "Smith";
    expect(
      table.movePiece(smith, { xOffset: 1, yOffset: 1, turn: 0 })
    ).toBeInstanceOf(OnePieceTableError);
    expect(table.getPoseByPiece(smith)).toBeInstanceOf(OnePieceTableError);
  });
  test("Place robot off-table, table should remain empty", () => {
    table.placePiece(robot, { x: 4, y: 10, facing: MapDirection.EAST });
    expect((table as any).piece).toBeUndefined();
  });
  test("Place robot on table, robot should work normally", () => {
    expect(
      table.placePiece(robot, { x: 2, y: 5, facing: MapDirection.EAST })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.EAST,
    });
    // examine behaviors: turn
    expect(table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: 1 })).toEqual(
      table.getPoseByPiece(robot)
    );
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.SOUTH,
    });
    expect(table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: 1 })).toEqual(
      table.getPoseByPiece(robot)
    );
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.WEST,
    });
    expect(table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: 1 })).toEqual(
      table.getPoseByPiece(robot)
    );
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.NORTH,
    });
    expect(
      table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: -1 })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.WEST,
    });
    expect(
      table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: -1 })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.SOUTH,
    });
    expect(
      table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: -1 })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 5,
      facing: MapDirection.EAST,
    });
    // move
    expect(table.movePiece(robot, { xOffset: 1, yOffset: 0, turn: 0 })).toEqual(
      table.getPoseByPiece(robot)
    );
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 3,
      y: 5,
      facing: MapDirection.EAST,
    });
  });
  test("Invalid commands shall be ignored and robot remain operable", () => {
    expect(
      table.placePiece(robot, { x: 200, y: 500, facing: MapDirection.EAST })
    ).toBeInstanceOf(Error);
    expect((table as any).piece).toBe(undefined);
    // a series of illegal operations, should be ignored
    expect(table.getPoseByPiece(robot)).toBeInstanceOf(Error);
    // table still empty, these commands will throw error
    expect((table as any).piece).toBe(undefined);
    expect(
      table.movePiece(robot, { xOffset: 1, yOffset: 0, turn: 0 })
    ).toBeInstanceOf(Error);
    expect(table.getPoseByPiece(robot)).toBeInstanceOf(Error);
    expect(
      table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: 1 })
    ).toBeInstanceOf(Error);
    // place on table
    expect(
      table.placePiece(robot, { x: 2, y: 1, facing: MapDirection.EAST })
    ).toEqual(table.getPoseByPiece(robot));
    expect((table as any).piece).toBe(robot);
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 1,
      facing: MapDirection.EAST,
    });
    // examine behaviors
    expect(table.movePiece(robot, { xOffset: 0, yOffset: 0, turn: 1 })).toEqual(
      table.getPoseByPiece(robot)
    );
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 1,
      facing: MapDirection.SOUTH,
    });
    // forward, until fall
    expect(
      table.movePiece(robot, { xOffset: 0, yOffset: -1, turn: 0 })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 0,
      facing: MapDirection.SOUTH,
    });
    expect(
      table.movePiece(robot, { xOffset: 0, yOffset: -1, turn: 0 })
    ).toBeInstanceOf(Error);
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 2,
      y: 0,
      facing: MapDirection.SOUTH,
    });
    // fancy move
    expect(
      table.movePiece(robot, { xOffset: -1, yOffset: 1, turn: -1 })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 1,
      y: 1,
      facing: MapDirection.EAST,
    });
    // still operable
    expect(
      table.movePiece(robot, { xOffset: -1, yOffset: 1, turn: -1 })
    ).toEqual(table.getPoseByPiece(robot));
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 0,
      y: 2,
      facing: MapDirection.NORTH,
    });
    // another invalid place-on-table command, should silently return an error and has no effect
    expect(
      table.placePiece(robot, { x: 200, y: 500, facing: MapDirection.EAST })
    ).toBeInstanceOf(Error);
    expect(table.getPoseByPiece(robot)).toEqual({
      x: 0,
      y: 2,
      facing: MapDirection.NORTH,
    });
  });
});
