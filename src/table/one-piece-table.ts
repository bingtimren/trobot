/**
 * A simple {@link Table} implementation for the code challenge
 * @packageDocumentation
 */

import { Pose, PoseMove, Table, TableError } from "../core/api";
import { MapDirection, turn90Degrees } from "../core/map-direction";

/**
 * Reason of errors, according to table's rules
 */
export const enum OnePieceTableErrorReason {
  NO_SUCH_PIECE = "NO_SUCH_PIECE",
  BEYOND_BOUNDARY = "BEYOND_BOUNDARY",
}

/**
 * Implementation of {@link TableError} according to rules of this table
 */
export class OnePieceTableError extends Error implements TableError {
  constructor(readonly reason: OnePieceTableErrorReason, message: string) {
    super(message);
  }
}

/**
 * A simple square table, which holds at most one table piece
 */

// eslint-disable-next-line @typescript-eslint/ban-types
export class OnePieceTable<TablePiece = {}> implements Table<TablePiece> {
  private piece: TablePiece | undefined;
  private piecePose: Pose;

  /**
   * Constructs the table with given dimension
   * @param width
   * @param height
   */
  constructor(private width: number, private height: number) {
    this.piece = undefined;
    this.piecePose = {
      x: 0,
      y: 0,
      facing: MapDirection.EAST,
    };
  }
  /**
   * This method is a decorator to another method-like function (given by the second parameter), to first check
   * if the given piece is the table-piece currently on this table.
   * If yes, invokes the method-like function, binding "this" to the "this" object, with arguments given by the 3rd parameter.
   * If no, returns an error.
   * @param piece
   * @param f
   * @param args
   */
  private checkPieceThen<F extends (...args: never[]) => unknown>(
    piece: TablePiece,
    f: F,
    ...args: Parameters<F>
  ): TableError | ReturnType<F> {
    if (this.piece !== undefined && this.piece === piece) {
      return f.apply(this, args) as ReturnType<F>;
    } else {
      return new OnePieceTableError(
        OnePieceTableErrorReason.NO_SUCH_PIECE,
        "Not on this table."
      );
    }
  }
  /**
   * @inheritdoc
   */
  getPoseByPiece(piece: TablePiece): Pose | TableError {
    return this.checkPieceThen(
      piece,
      (): Pose => {
        return this.piecePose;
      }
    );
  }
  /**
   * @inheritdoc
   */
  movePiece(piece: TablePiece, move: PoseMove): Pose | TableError {
    return this.checkPieceThen(
      piece,
      OnePieceTable.prototype.safeMovePiece,
      move
    );
  }
  private safeMovePiece(move: PoseMove): Pose | TableError {
    const newPose = {
      x: this.piecePose.x + move.xOffset,
      y: this.piecePose.y + move.yOffset,
      facing: turn90Degrees(this.piecePose.facing, move.turn),
    };
    if (this.isOnTable(newPose.x, newPose.y)) {
      this.piecePose = newPose;
      return this.piecePose;
    } else {
      return new OnePieceTableError(
        OnePieceTableErrorReason.BEYOND_BOUNDARY,
        "Would fall off table."
      );
    }
  }
  /**
   * @inheritdoc
   */
  placePiece(piece: TablePiece, pose: Pose): Pose | TableError {
    if (this.isOnTable(pose.x, pose.y)) {
      this.piece = piece;
      this.piecePose = pose;
      return pose;
    } else {
      return new OnePieceTableError(
        OnePieceTableErrorReason.BEYOND_BOUNDARY,
        "Beyond table boundary."
      );
    }
  }
  /**
   * Determines if a coordination is on table
   * @param x
   * @param y
   */
  isOnTable(x: number, y: number): boolean {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.width &&
      y >= 0 &&
      y < this.height
    );
  }
}
