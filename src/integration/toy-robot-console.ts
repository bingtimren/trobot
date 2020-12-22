/**
 * Integration codes that glue everything together to build a game console. 
 * @packageDocumentation
 */

import { Readable, Writable } from "stream";

import { Robot } from "../table-piece/robot";
import { OnePieceTable } from "../table/one-piece-table";
import { BaseStreamConsole } from "../ui/base-console";
import { commandLineHandler } from "../ui/cli-handler";

import { robotCommands } from "./robot-commands";

/**
 * Builds a game console for the toy robot challenge. This function
 * integrates a robot, a table, a CLI handler, and a console together, 
 * provides game play through an input stream, an output stream, and an error
 * stream. 
 * 
 * @param input input stream, e.g. process.stdin
 * @param output output stream, e.g. process.stdout
 * @param error error output stream, e.g. process.stderr
 * @param width width of the table
 * @param height height of the table
 */
export function buildToyRobotConsole(
  input: Readable,
  output: Writable,
  error: Writable,
  width: number,
  height: number
) {
  const robot = new Robot();
  const table = new OnePieceTable(width, height);
  const commands = robotCommands(robot, table);
  const cliHandler = commandLineHandler(commands, true);

  return new BaseStreamConsole(input, output, error, cliHandler, {
    greetingMessage:
      "Welcome! For help of commands, type 'help'. To exit, press 'ctrl+c' or 'ctrl+d'.",
    farewellMessage: "Bye!",
    prompt: "command: ",
  });
}
