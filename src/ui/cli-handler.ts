export interface CLIDescriptor {
  name: string;
  helpMessage: string;
  pattern: RegExp;
  handler: (...parameters: string[]) => string | Error;
}
/**
 *
 */
export function commandLineHandler(
  commands: CLIDescriptor[],
  enableHelp = true
): (line: string) => string | Error {
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
