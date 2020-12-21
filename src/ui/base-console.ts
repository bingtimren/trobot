import * as readline from "readline";
import { Readable, Writable } from "stream";

export type CommandLineHandler = (command: string) => string | Error;

function addNewlineToEndOfString(s: string): string {
  return s.endsWith("\n") ? s : s + "\n";
}

export class BaseStreamConsole {
  private readline: readline.Interface;
  private _inputClosed: boolean;
  private resolvers: (() => void)[] = [];
  get isInputClosed(): boolean {
    return this._inputClosed;
  }
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
