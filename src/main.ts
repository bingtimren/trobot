import { robotCommands } from "./factory/robot-commands";
import { Robot } from "./table-piece/robot";
import { OnePieceTable } from "./table/one-piece-table";
import { BaseStreamConsole } from "./ui/base-console";
import { CLIHandler } from "./ui/cli-handler";

const WIDTH = 5;
const HEIGHT = 5;

export const robot = new Robot();
export const table = new OnePieceTable(WIDTH, HEIGHT);
export const commands = robotCommands(robot, table);
export const cliHandler = new CLIHandler(commands, true);
const console = new BaseStreamConsole(
  process.stdin,
  process.stdout,
  process.stdout,
  cliHandler.handle.bind(cliHandler),
  {
    greetingMessage:
      "Welcome! For help of commands, type 'help'. To exit, press 'ctrl+c' or 'ctrl+d'.",
    farewellMessage: "Bye!",
    prompt: "command: ",
  }
);
console.promiseInputClose().then(() => {
  process.exit(0);
});
