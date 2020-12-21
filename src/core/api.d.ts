/**
 * Core interfaces
 * @packageDocumentation
 */

import { MapDirection } from "../core/map-direction";

/**
 * 2D coordination plus facing orientation
 */
export type Pose = {
  readonly x: number;
  readonly y: number;
  readonly facing: MapDirection;
};

export type PoseMove = {
  readonly xOffset: number;
  readonly yOffset: number;
  readonly turn: number;
};

export interface TableError extends Error {
  reason: string;
}

/**
 * Interface of a table that can hold a @{TablePiece} on top
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface Table<TablePiece = {}> {
  // /**
  //  * Start an atomic step
  //  */
  // startStep():void|TableError;
  // /**
  //  * finish an atomic step
  //  */
  // finishStep():void|TableError;
  /**
   * Move a piece relative to its current coordination
   * @param piece
   * @param move
   * @returns if success, returns the end {@link Pose} of the piece. If unsuccess, returns a {@link TableError}.
   */
  movePiece(piece: TablePiece, move: PoseMove): Pose | TableError;

  placePiece(piece: TablePiece, pose: Pose): Pose | TableError;

  /**
   * Returns a table piece's pose (coordination+orientation) by its ID. The piece must be on table already, otherwise an Error will be thrown.
   * @param pieceId
   */
  getPoseByPiece(piece: TablePiece): Pose | TableError;
}
