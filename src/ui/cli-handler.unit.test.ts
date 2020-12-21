import { CLIDescriptor, CLIHandler } from "./cli-handler";


describe("CommandLineHandler", () => {
    let handler: CLIHandler;
    const cmdHandler = (...parameters: string[]) => {
        return `(${parameters.length})${parameters.reduce((l, r) => l + "|" + r)}`
    }
    const cmdDesc: CLIDescriptor[] = [
        {
            name: "echoTwoNumber",
            handler: cmdHandler,
            helpMessage: "echo2n",
            pattern: /^echo2n\s+([0-9]+)\s+([0-9]+)\s*$/g
        },
        {
            name: "echo",
            handler: cmdHandler,
            helpMessage: "echo",
            pattern: /^echo\s*(.*)\s*$/g
        },
        {
            name: "throw",
            handler: () => { throw new Error() },
            helpMessage: "throw",
            pattern: /^throw$/
        }

    ]
    beforeEach(() => {
        handler = new CLIHandler(cmdDesc);
    });
    test("Handler correctly parses commands and invokes handlers", () => {
        expect(handler.handle("echo")).toEqual("(1)")
        expect(handler.handle("echo2n 12 34")).toEqual("(2)12|34")
    })
    test("Handler handles help command", () => {
        expect(handler.handle("help")).toEqual("echoTwoNumber: echo2n\necho: echo\nthrow: throw")
    })
    test("Handler not handles help command", () => {
        const noHelp = handler = new CLIHandler(cmdDesc, false);
        expect(noHelp.handle("help")).toBeInstanceOf(Error)
    })

    test("Handler handles unknown command", () => {
        expect(handler.handle("unknown-command")).toBeInstanceOf(Error)
    })
    test("Handler throws out un-expected error from command", () => {
        expect(() => handler.handle("throw")).toThrowError()
    })
});

