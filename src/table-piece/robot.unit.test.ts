import { Robot } from "./robot";
import { MapDirection } from "../core/map-direction";

describe("Robot", () => {
  let robot: Robot;
  const mockTable = {
    movePiece: jest.fn(),
    placePiece: jest.fn(),
    getPoseByPiece: jest.fn(),
  };
  const pose = {
    x: 0,
    y: 0,
    facing: MapDirection.EAST,
  };
  beforeEach(() => {
    robot = new Robot();
    jest.resetAllMocks();
  });
  test("Robot, not on table, should return error when operates, until placed on table", () => {
    expect(robot.table).toBeUndefined();
    expect(robot.getPose()).toBeInstanceOf(Error);
    expect(robot.turnLeft()).toBeInstanceOf(Error);
    expect(robot.turnRight()).toBeInstanceOf(Error);
    expect(robot.moveForward()).toBeInstanceOf(Error);
  });
  test("Robot, put on table fails, should not hold the table", () => {
    mockTable.placePiece.mockReturnValueOnce(new Error());
    expect(robot.placeOn(mockTable, pose)).toBeInstanceOf(Error);
    expect(mockTable.placePiece).toHaveBeenCalledWith(robot, pose);
    expect(robot.table).toBeUndefined();
    expect(robot.getPose()).toBeInstanceOf(Error);
  });
  test("Robot, put on table fails, then success, should hold the table", () => {
    mockTable.placePiece.mockReturnValueOnce(new Error()).mockReturnValueOnce(pose);
    expect(robot.placeOn(mockTable, pose)).toBeInstanceOf(Error);
    expect(robot.placeOn(mockTable, pose)).toEqual(pose);
    expect(mockTable.placePiece).toBeCalledTimes(2);
    expect(robot.table).toBe(mockTable);
  });
  test("Robot, put on table, then correctly calls table to turn, move, and find its pose", () => {
    mockTable.placePiece.mockReturnValueOnce(pose);
    expect(robot.placeOn(mockTable, pose)).toEqual(pose);
    // operate the robot and check the calls from the robot to the table
    robot.getPose();
    expect(mockTable.getPoseByPiece).lastCalledWith(robot);
    // check that robot calls the table to move itself forward with the correct parameters
    mockTable.getPoseByPiece
      .mockReturnValueOnce({ x: 0, y: 0, facing: MapDirection.EAST })
      .mockReturnValueOnce({ x: 0, y: 0, facing: MapDirection.SOUTH })
      .mockReturnValueOnce({ x: 0, y: 0, facing: MapDirection.WEST })
      .mockReturnValueOnce({ x: 0, y: 0, facing: MapDirection.NORTH });
    robot.moveForward();
    expect(mockTable.movePiece).lastCalledWith(robot, { xOffset: 1, yOffset: 0, turn: 0 });
    robot.moveForward();
    expect(mockTable.movePiece).lastCalledWith(robot, { xOffset: 0, yOffset: -1, turn: 0 });
    robot.moveForward();
    expect(mockTable.movePiece).lastCalledWith(robot, { xOffset: -1, yOffset: 0, turn: 0 });
    robot.moveForward();
    expect(mockTable.movePiece).lastCalledWith(robot, { xOffset: 0, yOffset: 1, turn: 0 });
    // check that robot calls the table to turn itself
    robot.turnLeft();
    expect(mockTable.movePiece).lastCalledWith(robot, { xOffset: 0, yOffset: 0, turn: -1 });
    robot.turnRight();
    expect(mockTable.movePiece).lastCalledWith(robot, { xOffset: 0, yOffset: 0, turn: 1 });
  });
  test("Robot, placed on table, but get kicked off by table, should return Error on all operations", () => {
    mockTable.placePiece.mockReturnValueOnce(pose);
    expect(robot.placeOn(mockTable, pose)).toEqual(pose);
    // now the robot is get kicked off by the table, possibly killed by another table-piece
    mockTable.getPoseByPiece.mockReturnValue(new Error());
    mockTable.movePiece.mockReturnValue(new Error());
    mockTable.placePiece.mockReturnValue(new Error());

    expect(robot.getPose()).toBeInstanceOf(Error);
    expect(robot.moveForward()).toBeInstanceOf(Error);
    expect(robot.turnLeft()).toBeInstanceOf(Error);
    expect(robot.turnRight()).toBeInstanceOf(Error);
  })
})
