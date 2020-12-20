/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Pose, Table, TableError } from "../core/api";
import { getDirectionDescFromMapDirection } from "../core/map-direction";

/**
 *
 */
export class Robot {
  constructor() {
    return
  }
  private checkTableThen<F extends ((...args: unknown[]) => unknown)>(f: F, ...args: unknown[]): Error | ReturnType<F> {
    if (this._table !== undefined) {
      return f.apply(this, args) as ReturnType<F>;
    } else {
      return new Error('Robot is not placed on table.');
    }
  }
  private _table: Table<Robot> | undefined;
  get table(): Table | undefined {
    return this._table;
  };
  placeOn(table: Table, pose: Pose): Pose | TableError {
    const result = table.placePiece(this, pose); // type Pose and DropStep are the same
    if (!(result instanceof Error)) {
      this._table = table;
    }
    return result
  };
  turnLeft(): Pose | Error {
    return this.checkTableThen(() => {
      return this._table!.movePiece(this, { xOffset: 0, yOffset: 0, turn: -1 });
    });
  }
  turnRight(): Pose | Error {
    return this.checkTableThen(() => {
      return this._table!.movePiece(this, { xOffset: 0, yOffset: 0, turn: 1 });
    })

  }

  getPose(): Pose | Error {
    return this.checkTableThen(() => {
      return this._table!.getPoseByPiece(this);
    });
  }

  moveForward(): Pose | Error {
    return this.checkTableThen(() => {
      const poseOrError = this.getPose();
      if (poseOrError instanceof Error) {
        // still not on table? get kicked off?
        return new Error(`Unexpected table error: ${poseOrError}.`);
      } else {
        const directionDesc = getDirectionDescFromMapDirection(poseOrError.facing);
        return this._table!.movePiece(
          this,
          Object.assign({}, directionDesc, { turn: 0 })
        );
      }

    });
  };
}
