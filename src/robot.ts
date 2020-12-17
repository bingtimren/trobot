import { v4 } from "uuid";

import { TablePiece } from "./core";

/**
 * A dumb @{link TablePiece}
 */
export class Robot implements TablePiece {
  private _id: string;
  constructor() {
    this._id = v4();
  }
  get id() {
    return this._id;
  }
}
