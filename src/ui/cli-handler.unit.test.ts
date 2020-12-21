import { CLIDescriptor, commandLineHandler } from "./cli-handler";

describe("CommandLineHandler", () => {
  let handler: (s: string) => string | Error;
  const cmdHandler = (...parameters: string[]) => {
    return `(${parameters.length})${parameters.reduce((l, r) => l + "|" + r)}`;
  };
  const cmdDesc: CLIDescriptor[] = [
    {
      name: "echoTwoNumber",
      handler: cmdHandler,
      helpMessage: "echo2n",
      pattern: /^echo2n\s+([0-9]+)\s+([0-9]+)\s*$/g,
    },
    {
      name: "echo",
      handler: cmdHandler,
      helpMessage: "echo",
      pattern: /^echo\s*(.*)\s*$/g,
    },
    {
      name: "throw",
      handler: () => {
        throw new Error();
      },
      helpMessage: "throw",
      pattern: /^throw$/,
    },
  ];
  beforeEach(() => {
    handler = commandLineHandler(cmdDesc);
  });
  test("Handler correctly parses commands and invokes handlers", () => {
    expect(handler("echo")).toEqual("(1)");
    expect(handler("echo2n 12 34")).toEqual("(2)12|34");
  });
  test("Handler handles help command", () => {
    expect(handler("help")).toEqual(
      "echoTwoNumber: echo2n\necho: echo\nthrow: throw"
    );
  });
  test("Handler not handles help command", () => {
    const noHelp = (handler = commandLineHandler(cmdDesc, false));
    expect(noHelp("help")).toBeInstanceOf(Error);
  });

  test("Handler handles unknown command", () => {
    expect(handler("unknown-command")).toBeInstanceOf(Error);
  });
  test("Handler throws out un-expected error from command", () => {
    expect(() => handler("throw")).toThrowError();
  });
});
