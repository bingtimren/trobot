/**
 * A simple table-piece for the code challenge
 * @packageDocumentation
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pose, Table, TableError } from "../core/api";
import { getDirectionDescFromMapDirection } from "../core/map-direction";

/**
 * A toy robot, capable of being placed on a table, then turning itself or moving forward on the table.
 */
export class Robot {
  /**
   * A decorator of a method-like function f. Check if the robot is on a table.
   * If yes, then invokes f with the provided arguments. Otherwise returns an error.
   * @param f 
   * @param args 
   */
  private checkTableThen<F extends (...args: unknown[]) => unknown>(
    f: F,
    ...args: unknown[]
  ): Error | ReturnType<F> {
    if (this._table !== undefined) {
      return f.apply(this, args) as ReturnType<F>;
    } else {
      return new Error("Robot is not placed on table.");
    }
  }
  private _table: Table<Robot> | undefined;
  /**
   * The table, if the robot is placed. Otherwise undefined.
   * Note that it's possible that although the robot holds the table, the table has taken the robot off it, if the table rules allow this.
   */
  get table(): Table | undefined {
    return this._table;
  }
  /**
   * Place the robot on the table, at given pose.
   * @param table 
   * @param pose 
   * @returns The final pose of the robot, if robot is placed on table. Otherwise, returns an error if table rules refused the placement.
   */
  placeOn(table: Table, pose: Pose): Pose | TableError {
    const result = table.placePiece(this, pose); // type Pose and DropStep are the same
    if (!(result instanceof Error)) {
      this._table = table;
    }
    return result;
  }
  /**
   * Turn the robot 90 degree left, and return the end Pose, or an Error if table refused the turn. 
   * The end Pose is ultimately determined by the table. 
   */
  turnLeft(): Pose | Error {
    return this.checkTableThen(() => {
      return this._table!.movePiece(this, { xOffset: 0, yOffset: 0, turn: -1 });
    });
  }
  /**
   * Turn the robot 90 degree right, and return the end Pose, or an Error if table refused the turn. 
   * The end Pose is ultimately determined by the table. 
   */
  turnRight(): Pose | Error {
    return this.checkTableThen(() => {
      return this._table!.movePiece(this, { xOffset: 0, yOffset: 0, turn: 1 });
    });
  }
  /**
   * Get the current pose of the robot on the table. There is no guarantee that the pose is not changed if the robot did not trigger any move. 
   * The pose, and whether or not the robot is still on table, is ultimately determined by the table.
   * @returns the pose, or an Error, in which case most likely because the robot is not on table.
   */
  getPose(): Pose | Error {
    return this.checkTableThen(() => {
      return this._table!.getPoseByPiece(this);
    });
  }
  /**
   * Moves the robot forward, and return the end Pose, or an Error if table refused the turn. 
   * The end Pose is ultimately determined by the table. 
   */
  moveForward(): Pose | Error {
    return this.checkTableThen(() => {
      const poseOrError = this.getPose();
      if (poseOrError instanceof Error) {
        // still not on table? get kicked off?
        return new Error(`Unexpected table error: ${poseOrError}.`);
      } else {
        const directionDesc = getDirectionDescFromMapDirection(
          poseOrError.facing
        );
        return this._table!.movePiece(
          this,
          Object.assign({}, directionDesc, { turn: 0 })
        );
      }
    });
  }
}
