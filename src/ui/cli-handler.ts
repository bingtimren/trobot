
export interface CLIDescriptor {
    name: string,
    helpMessage: string,
    pattern: RegExp,
    handler: (...parameters: string[]) => string | Error,
}
/**
 * 
 */
export class CLIHandler {
    constructor(private commands: CLIDescriptor[], private enableHelp: boolean = true) {
    }
    /**
     * 
     * @param line 
     * @returns if command is valid, returns the response from the command handler;
     *      if command does not match any command handler, an Error is returned;
     *      if command matches to a handler, however handler throws an Error (should not happen), the error is thrown
     */
    handle(line: string): string | Error {
        if (this.enableHelp && line.trim() === "help") {
            return this.commands.map((desc: CLIDescriptor) => { return desc.name + ": " + desc.helpMessage })
                .reduce((prev: string, cur: string) => { return prev + "\n" + cur });
        }
        for (const cliDesc of this.commands) {
            const match = cliDesc.pattern.exec(line)
            if (match !== null) {
                // if command handler throws an Error, which should not happen, 
                // just throw the Error out. 
                return cliDesc.handler(...(match.slice(1)))
            }
        }
        return new Error("Unknown command.")
    }
}