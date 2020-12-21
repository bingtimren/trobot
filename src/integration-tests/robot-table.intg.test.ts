import { OnePieceTable } from "../table/one-piece-table";
import { MapDirection } from "../core/map-direction";
import { Robot } from "../table-piece/robot";
import { Table } from "../core/api";

describe("", () => {
  let robot: Robot;
  let table: Table;
  beforeEach(() => {
    robot = new Robot();
    table = new OnePieceTable(5, 3);
  });
  test("Place robot on table", () => {
    const pose = { x: 0, y: 0, facing: MapDirection.WEST };
    expect(robot.placeOn(table, pose)).toEqual(pose);
    expect(robot.getPose()).toEqual(pose);
  });
  test("Place robot on table and move around", () => {
    const pose = { x: 0, y: 0, facing: MapDirection.EAST };
    expect(robot.placeOn(table, pose)).toEqual(pose);
    expect(robot.getPose()).toEqual(pose);
    expect(robot.moveForward()).toEqual({
      x: 1,
      y: 0,
      facing: MapDirection.EAST,
    });
    expect(robot.turnLeft()).toEqual({
      x: 1,
      y: 0,
      facing: MapDirection.NORTH,
    });
    expect(robot.moveForward()).toEqual({
      x: 1,
      y: 1,
      facing: MapDirection.NORTH,
    });
    expect(robot.turnRight()).toEqual({
      x: 1,
      y: 1,
      facing: MapDirection.EAST,
    });
    expect(robot.moveForward()).toEqual({
      x: 2,
      y: 1,
      facing: MapDirection.EAST,
    });
  });
  test("Robot ignores invalid commands", () => {
    expect(
      robot.placeOn(table, { x: -1, y: -1, facing: MapDirection.EAST })
    ).toBeInstanceOf(Error);
    expect(robot.getPose()).toBeInstanceOf(Error);
    expect(robot.moveForward()).toBeInstanceOf(Error);
    expect(robot.turnRight()).toBeInstanceOf(Error);
    expect(robot.turnRight()).toBeInstanceOf(Error);
    expect(robot.table).toBeUndefined();
    const pose = { x: 0, y: 0, facing: MapDirection.WEST };
    expect(robot.placeOn(table, pose)).toEqual(pose);
    // invalid command just ignored
    expect(robot.moveForward()).toBeInstanceOf(Error);
    expect(robot.getPose()).toEqual(pose);
    expect(robot.turnLeft()).toEqual({
      x: 0,
      y: 0,
      facing: MapDirection.SOUTH,
    });
    expect(robot.moveForward()).toBeInstanceOf(Error);
    expect(robot.getPose()).toEqual({ x: 0, y: 0, facing: MapDirection.SOUTH });
    expect(robot.turnLeft()).toEqual({ x: 0, y: 0, facing: MapDirection.EAST });
    expect(robot.moveForward()).toEqual({
      x: 1,
      y: 0,
      facing: MapDirection.EAST,
    });
    expect(robot.moveForward()).toEqual({
      x: 2,
      y: 0,
      facing: MapDirection.EAST,
    });
    expect(robot.moveForward()).toEqual({
      x: 3,
      y: 0,
      facing: MapDirection.EAST,
    });
    expect(robot.moveForward()).toEqual({
      x: 4,
      y: 0,
      facing: MapDirection.EAST,
    });
    expect(robot.moveForward()).toBeInstanceOf(Error);
    expect(robot.getPose()).toEqual({ x: 4, y: 0, facing: MapDirection.EAST });
    expect(robot.turnLeft()).toEqual({
      x: 4,
      y: 0,
      facing: MapDirection.NORTH,
    });
    expect(robot.moveForward()).toEqual({
      x: 4,
      y: 1,
      facing: MapDirection.NORTH,
    });
    expect(robot.moveForward()).toEqual({
      x: 4,
      y: 2,
      facing: MapDirection.NORTH,
    });
    expect(robot.moveForward()).toBeInstanceOf(Error);
    // another place command ignored
    expect(
      robot.placeOn(table, { x: -1, y: -1, facing: MapDirection.EAST })
    ).toBeInstanceOf(Error);
    expect(robot.getPose()).toEqual({ x: 4, y: 2, facing: MapDirection.NORTH });
  });
});
