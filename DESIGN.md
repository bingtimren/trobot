# Design Document

## Goals

The goals of the design is:
- Achieve the specified functionality of this code challenge
- Programming for interface: design a set of core interfaces (API) that set out the main entities, their behaviors and interactions. Implementations should depend on these core interfaces, not other implementations, as much as possible.
- Encapsulate future changes: The API design should consider future changes of the game. The core interfaces can be expanded when the game becomes more sophisticated, but the existing API should be stable. Evolution of the game should not require frequent breaking-changes of the core interfaces. However, this should not add too much work to the implementation of the current functionality.
- Modular: the entities should have clearly separated responsibilities, can be developed and tested independently, with knowledge of the other associated entities only from the core interfaces. Development of one entity should not depend on the concrete implementations of the associated entities, when possible. 
- Don't repeat yourself. Write reusable codes.

## Basic API

The core interfaces models a general 2D check-board game, possibly a lot more sophisticated than the current requirement, consists of a Table, one or more Table-pieces, and a Console. 

A Table-piece can be placed on a Table. Table-piece and Table has a many-to-one association. Together, they form the game's model.

A Console one-way associates to the Table-pieces and / or the Table, and is responsible for the input / output of the game. 

### Table Piece and its Pose

At the current design, there is no specification of the base type of Table-pieces. In a collection, Table-piece equality is based on the key equality of the [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object, i.e. the [sameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality) algorithm. 

When placed on a Table, a Table-piece has a coordination and faces a direction, represented by a value type "Pose". The Table, not the Table-piece, maintains the coordination of the Table-piece on the Table. This allows the Table has the final say about the Table-piece's Pose, therefore allows the Table to enforce its rules, and the ability to construct some sophisticated mechanisms on the table (e.g. walls, portals, conveyor belts, etc.). A Table-piece should always enquiry the Table for its Pose, and should not assume its Pose stays the same if the Table-piece does not take any action (e.g. when the Table-piece sits on a conveyor belt, or is killed by an opponent Table-piece).

### Move and Move Steps

  // /**
  //  * Start an atomic step
  //  */
  // startStep():void|TableError;
  // /**
  //  * finish an atomic step
  //  */
  // finishStep():void|TableError;


A Move represents an atomic move in the game. 
 Table-piece can take a move, represented in a value type Move. A Move is a list of Steps. Steps include Travel steps and Drop steps. A Move is atomic, either success or fail. If success, all Steps in the Move success. If fail, the Move takes no effect. There is no partial success of a Move. 

A Travel step applies only to a Table-piece already placed on the Table, specifies the changes of Pose (offsets) relative to the start Pose of the Table-piece. 

A Drop step applies to a Table-piece on or off the Table, specifies the end Pose of the Table-piece after the Step.

A Move can represent many common movements of a Table-piece in common 2D check-board games. For example, a Move with a single Travel step with y offset being 1 can represent the advancing of a pawn in the chess game. A Move containing a consecutive Travel steps can represent a move of a castle, bishop, queen, etc. A Move containing a Travel step with coordination offset larger than 1 can represent a "jump", possibly over another Table-piece. A Drop step of a Table-piece that is already on a Table can represent a "teleportation".


### Table

The responsibility of a Table is:
- Maintain the Pose of Table-pieces on the Table
- Accepts requests to move Table-pieces, 




