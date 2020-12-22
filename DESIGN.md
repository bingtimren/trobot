# Design Document

This document discusses the high-level goals, designs, and some design decisions of this project.

## Goals

The goals of the design are:
- Achieve the specified functionality of this code challenge
- Programming for interface: design a set of core interfaces (API) that set out the main entities, their behaviors and interactions. Implementations should depend on these core interfaces, not the implementations, whenever possible.
- Encapsulate future changes: The API design should consider future changes in the game. The core interfaces can be expanded when the game becomes more sophisticated, but the existing API should be stable. Evolution of the game should not require frequent breaking-changes of the core interfaces. However, this should not add too much work to the implementation of the current functionality.
- Modular: the entities should have clearly separated responsibilities, can be developed and tested independently, with knowledge of the other associated entities only from the core interfaces. Development of one entity should not depend on the concrete implementations of the associated entities, when possible. 
- Don't repeat yourself. Write reusable codes.

## Basic API

The core interfaces models a general-purpose 2D check-board game, in which a Table and some Table-pieces interplay together. 

In this model, a Table-piece can be placed on a Table. Table-piece and Table have a many-to-one association. Table-piece is responsible for modelling the behavior of a type (for example the king in the chess game) of table-piece, including its properties (such as black or white), and behavior (capability of certain moves). Table is responsible for holding the table-pieces, enforcing the table's rules (for example, at any time only one table-piece can occupy a position), and ultimately determines a table-piece's status on the table.

The Table interface specifies how table-pieces can interact with a Table. The Table interface is aimed to be very flexible to allow various table-pieces to communicate with the Table to indicate their intended moves.

## Table Piece and its Pose

At the current design, there is no specification of the base type of Table-pieces. The Table interface can accept a type parameter to specify the type of acceptable table-pieces.

When placed on a Table, a Table-piece has a coordination and faces a direction, represented by a value type "Pose". The Table, not Table-pieces, maintains the coordination of the Table-pieces on the Table. This allows the Table has the final say about any Table-piece's Pose, therefore allows the Table to enforce its rules, and to implement some sophisticated mechanisms (e.g. walls, portals, conveyor belts, worm-holes, etc.). A Table-piece should always enquiry the Table for its Pose, and should not assume its Pose stays the same if the Table-piece does not take any action (e.g. when the Table-piece sits on a conveyor belt, or is killed by an opponent Table-piece).

## Table and Table-piece Interaction

As mentioned, a Table is responsible for:
- expose methods for a table-piece to interact with
- maintain table state, including all table-pieces' Poses
- enforce table rules

Table-piece is responsible for:
- implement its own movements by invoking the table's methods
- maintains its own status

Table piece's movement and end Pose is the result of the interaction of both the table-piece and the table. Table-piece has certain capabilities, exposed by its own methods. For example, a king in the chess game can move one step at a time, while a queen can move multiple steps at a time. Table-piece communicates with the Table to indicate its intended move, and the Table responds with the result of the move. The Table has the final decision about the Table-piece's Pose.

Currently, the Table interface exposes two methods for a table-piece to indicate its move:

- `movePiece` : allows a table-piece that is on the table to indicate its relative movement
- `placePiece` : allows a table-piece to place (or replace) itself on the table at an absolute Pose

These two methods allow indication of some sophisticated movements in common games. For example, a `movePiece` invocation can represent a move to an adjacent position, or a jump to a remote position (when x and/or y offset >1). A `placePiece` invocation by a table-piece with an existing coordination can represent a "teleportation".

## Potential Expansion for Future Changes

Should the project will evolve into a more sophisticated game like chess in the future, the Table interface can expand to include two more methods:

```
  /**
   * Start an atomic step
   */
  startStep():void|TableError;
  /**
   * finish an atomic step
   */
  finishStep():void|TableError;
```

This would allow indication of an atomic step that involves multiple pieces and multiple moves. An atomic step either succeeds or fails altogether. A queen walks through multiple positions in one step, or the castling step which involves the move of both the king and a castle, are examples of some sophisticated steps.

## Conclusion

The fundamental design and project structure should be stable enough to encapsulate future changes. Since the Table has the final say of table-pieces' position, some fancy table behaviors can be modelled, such as walls, portals, worm-holes, conveyor belts. The methods exposed by the Table interface allows table-piece to indicate various moves, such as walks and jumps. With the expansion, the interface can model chess-like games without breaking changes.
