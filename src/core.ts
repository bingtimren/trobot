/**
 * Core interfaces
 * @packageDocumentation
 */

import { MapDirection } from "./map-direction";

/**
 * 2D coordination
 */
export type Coordination = {
  x: number;
  y: number;
};

/**
 * 2D coordination plus facing orientation
 */
export type Pose = Coordination & {
  facing: MapDirection;
};

/**
 * ID for a {@link TablePiece}, either a number or string
 */
export type TablePieceId = number | string;

/**
 * Type of objects that can be placed on a {@link Table}, requires an ID
 */
export type TablePiece = {
  readonly id: TablePieceId;
};

/**
 * Interface of a table that can hold a @{TablePiece} on top
 */
export interface Table {
  /**
   * Put an {@link TablePiece} at a given coordination facing a {@link MapDirection}
   * @param piece
   * @param x
   * @param y
   * @param facing
   * @returns If success, returns nothing; Otherwise returns an Error and the piece is not placed on table
   */
  placePiece(
    piece: TablePiece,
    x: number,
    y: number,
    facing: MapDirection
  ): void | Error;
  /**
   * Moves a table piece one step forward. The piece must be on table already, otherwise throws an Error.
   * @param piece an {@link TablePiece}, which must be on table
   * @returns if success, returns nothing. If unsuccess due to rules of the table, returns an Error. If the piece is not on table already, an Error will be thrown.
   */
  movePieceForward(piece: TablePiece): void | Error;
  /**
   * Turns a table piece multiple times of 90 degrees. The piece must be on table already, otherwise throws an Error.
   * @param piece an {@link TablePiece}, which must be on table
   * @param n number of 90 degrees to turn, negative value turns left, positive value turns right
   * @returns if success, returns nothing. If unsuccess due to rules of the table, returns an Error. If the piece is not on table already, an Error will be thrown.
   */
  turnPiece90Degrees(piece: TablePiece, n: number): void | Error;
  /**
   * Returns a table piece's pose (coordination+orientation) by its ID. The piece must be on table already, otherwise an Error will be thrown.
   * @param pieceId
   */
  getPoseByPieceId(pieceId: TablePieceId): Readonly<Pose>;
}
