/**
 * A reusable command line console, responsible for reading in and handling the commands one line at a time.
 * 
 * The console delegates handlement of the commands to a {@link CommandLineHandler}, which must be provided upon construction.
 * @packageDocumentation
 */

import * as readline from "readline";
import { Readable, Writable } from "stream";
/**
 * A command line handler that accepts a command line once a time, and returns a string feedback 
 * if command is executed successfully, or an Error if not.
 */
export type CommandLineHandler = (command: string) => string | Error;


/**
 * A console that reads one line a time from an input stream, executes the line as a command by invoking a {@link CommandLineHandler}, and outputs
 * the feedback to an output stream. If command handler returns an Error, outputs the error message to an error stream. 
 * 
 * The console can optionally be provided a prompt, a greeting message, and a good bye message. If absent, prompt will be the default 
 * [readline prompt](https://nodejs.org/api/readline.html#readline_rl_prompt_preservecursor), which is '> '.
 * 
 * A Promise can be obtained from method {@link promiseInputClose}. The Promise resolves after the input stream is closed, i.e. the console is no 
 * longer used. Then a main process decide to exit.
 */
export class BaseStreamConsole {
  private readline: readline.Interface;
  private _inputClosed: boolean;
  private resolvers: (() => void)[] = [];
  get isInputClosed(): boolean {
    return this._inputClosed;
  }
  /**
   * A Promise that resolves after the input stream is closed.
   */
  promiseInputClose(): Promise<void> {
    return new Promise((resolve) => {
      if (this._inputClosed) {
        resolve();
      } else {
        this.resolvers.push(resolve);
      }
    });
  }
  constructor(
    input: Readable,
    output: Writable,
    error: Writable,
    private handler: CommandLineHandler,
    options: {
      prompt?: string;
      greetingMessage?: string;
      farewellMessage?: string;
    } = {}
  ) {
    this.readline = readline.createInterface({
      input,
      output,
      prompt: options.prompt,
    });
    if (options.greetingMessage) {
      output.write(addNewlineToEndOfString(options.greetingMessage));
    }
    this.readline.on("line", (line) => {
      const response = this.handler(line.trim());
      if (response instanceof Error) {
        error.write(addNewlineToEndOfString(response.message));
      } else if (response.length > 0) {
        output.write(addNewlineToEndOfString(response));
      }
      this.readline.prompt();
    });
    this._inputClosed = false;
    this.readline.on("close", () => {
      if (options.farewellMessage) {
        output.write(addNewlineToEndOfString("\n" + options.farewellMessage));
      }
      this._inputClosed = true;
      // resolve all promises
      for (const resolve of this.resolvers) {
        resolve();
      }
    });
    this.readline.prompt();
  }
}

/**
 * Adds a new-line to received string if it does not already ended with one
 * @param s 
 */
function addNewlineToEndOfString(s: string): string {
  return s.endsWith("\n") ? s : s + "\n";
}
