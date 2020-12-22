import { Readable, Writable } from "stream";

import { Robot } from "../table-piece/robot";
import { OnePieceTable } from "../table/one-piece-table";
import { BaseStreamConsole } from "../ui/base-console";
import { commandLineHandler } from "../ui/cli-handler";

import { robotCommands } from "./robot-commands";

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
