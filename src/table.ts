/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pose, Table, TablePiece, TablePieceId } from "./core";
import {
  getDirectionDescFromMapDirection,
  MapDirection,
  turn90Degrees,
} from "./map-direction";
import { methodWrapperDecorator } from "./utils";

// A decorator, wraps around a method, first examines the first parameter to be
// the piece on the table, or the piece's id. If satisfied, the original method will
// be executed. Otherwise, throws an Error
const checkFirstParameterToBePieceOnTableOrItsId = methodWrapperDecorator(
  (
    thisArg: OnePieceTable,
    originalMethod: (...args: [TablePiece | string]) => unknown,
    ...args: [TablePiece | string]
  ) => {
    const givenPieceOrId = args[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const piece: TablePiece | undefined = (thisArg as any).piece;
    if (
      piece !== undefined &&
      (givenPieceOrId === piece || givenPieceOrId === piece.id)
    ) {
      return originalMethod.apply(thisArg, args);
    } else {
      throw new Error("Wrong table-piece is provided or empty table");
    }
  }
);

/**
 * A simple square table, without walls, portals, etc., and holds at most one table piece
 */
export class OnePieceTable implements Table {
  // @ts-ignore TS6133
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
   * @inheritdoc
   */
  placePiece(
    piece: TablePiece,
    x: number,
    y: number,
    facing: MapDirection
  ): void | Error {
    if (this.isOnTable(x, y)) {
      this.piece = piece;
      this.piecePose = {
        x,
        y,
        facing,
      };
    } else {
      return new Error("Coordination off table");
    }
  }
  /**
   * @inheritdoc
   */
  @checkFirstParameterToBePieceOnTableOrItsId // @ts-ignore TS6133
  movePieceForward(piece: TablePiece): void | Error {
    const dirDesc = getDirectionDescFromMapDirection(this.piecePose.facing);
    const newPose: Pose = {
      x: this.piecePose.x + dirDesc.xOffset,
      y: this.piecePose.y + dirDesc.yOffset,
      facing: this.piecePose.facing,
    };
    if (this.isOnTable(newPose.x, newPose.y)) {
      this.piecePose = newPose;
      return undefined;
    } else {
      return new Error("Illegal move, would be off table");
    }
  }
  /**
   * @inheritdoc
   */
  @checkFirstParameterToBePieceOnTableOrItsId // @ts-ignore TS6133
  turnPiece90Degrees(piece: TablePiece, n: number): void | Error {
    this.piecePose.facing = turn90Degrees(this.piecePose.facing, n);
  }
  /**
   * @inheritdoc
   */
  @checkFirstParameterToBePieceOnTableOrItsId // @ts-ignore TS6133
  getPoseByPieceId(pieceId: TablePieceId): Readonly<Pose> {
    return this.piecePose;
  }
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
