/**
 * Handler of commands according to an array of command descriptors. 
 * @packageDocumentation
 */


import { CommandLineHandler } from "./base-console"

/**
 * Description of a command line command, including a name, a help message, a RegExp pattern that matches the format of the command and extracts 
 * the parameters, and a handler.
 * 
 * The pattern should use RegExp capturing groups to capture command parameters.
 * The handler, if invoked, will accept the string parameters (captured by pattern capturing groups, starting from index 1, i.e. without the full match),
 * handles the command, and returns a string (if success) or an Error.
 */
export type CLIDescriptor = {
  readonly name: string;
  readonly helpMessage: string;
  readonly pattern: RegExp;
  readonly handler: (...parameters: string[]) => string | Error;
}
/**
 * Returns a {@link CommandLineHandler} that handles commands according to an array of {@link CLIDescriptor}. 
 * Once the pattern of a {@link CLIDescriptor} matches the command line, the corresponding handler of the {@link CLIDescriptor} will be invoked
 * to handle the command, and the result returned. If cannot find any {@link CLIDescriptor} in the array that matches the command, an error will be returned.
 * 
 * Optionally (default true), the handler handles a 'help' command that reports the usage of the commands from the array of {@link CLIDescriptor}.
 */
export function commandLineHandler(
  commands: CLIDescriptor[],
  enableHelp = true
): CommandLineHandler {
  return (line: string): string | Error => {
    if (enableHelp && line.trim() === "help") {
      return commands
        .map((desc: CLIDescriptor) => {
          return desc.name + ": " + desc.helpMessage;
        })
        .reduce((prev: string, cur: string) => {
          return prev + "\n" + cur;
        });
    }
    for (const cliDesc of commands) {
      const match = cliDesc.pattern.exec(line);
      if (match !== null) {
        // if command handler throws an Error, which should not happen,
        // just throw the Error out.
        return cliDesc.handler(...match.slice(1));
      }
    }
    return new Error("Unknown command.");
  };
}
