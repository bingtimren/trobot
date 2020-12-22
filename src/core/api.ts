/**
 * Core interfaces, see [DESIGN Document](https://github.com/bingtimren/trobot/blob/main/DESIGN.md) for details.
 * @packageDocumentation
 */

import { MapDirection } from "../core/map-direction";

/**
 * 2D coordination (x,y) plus facing orientation of type {@link MapDirection}, an value object
 */
export type Pose = {
  readonly x: number;
  readonly y: number;
  readonly facing: MapDirection;
};

/**
 * Represents a transition from one {@link Pose} to another. An value object.
 */
export type PoseMove = {
  /**
   * Change of x coordination
   */
  readonly xOffset: number;
  /**
   * Change of y coordination
   */
  readonly yOffset: number;
  /**
   * Change of facing, i.e. number of 90 degree turns, negative value represents turning left, positive value represents turning right.
   * For example, 1 means turn right, -1 means turn left, +2 or -2 means turn back, etc.
   */
  readonly turn: number;
};

/**
 * Error with a reason
 */
export interface TableError extends Error {
  /**
   * A reason code, for receiver to determine the reason of the error
   */
  reason: string;
}

/**
 * Interface of a table that can hold table-pieces of a certain type (specified by the TablePiece type parameter).
 * Table is responsible for holding table-pieces, accept requests from table-pieces, and finally determines the {@link Pose}, i.e. coordination and
 * facing orientation of the table-pieces.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface Table<TablePiece = {}> {
  /**
   * Move a table-piece relative to its current {@link Pose}
   * @param piece
   * @param move
   * @returns if success, returns the end {@link Pose} of the piece. If unsuccess according to rule of table, returns a {@link TableError}.
   */
  movePiece(piece: TablePiece, move: PoseMove): Pose | TableError;

  /**
   * Place a table-piece to a {@link Pose}
   * @param piece
   * @param pose
   * @Returns the final {@link Pose} of the table-piece after this operation. It's not guaranteed that the final Pose is the same as received in the parameter.
   * The table determines the final pose of the table-piece according to its rules.
   */
  placePiece(piece: TablePiece, pose: Pose): Pose | TableError;

  /**
   * Returns a table piece's pose. The piece must be on table already, otherwise an Error will be returned.
   * There is no guarantee that the returned pose is the same as the last returned value, if the piece itself did not trigger any movement. The table
   * finally determines the table-piece's pose, including if the table-piece is still on table.
   * @param piece
   */
  getPoseByPiece(piece: TablePiece): Pose | TableError;
}
