import { BaseStreamConsole } from "./base-console"
import { WritableStream } from "memory-streams"
import { Readable } from "stream"

describe("BaseStreamConsole", () => {
    const echoHandler = (s: string) => { return s === "ERROR" ? new Error(s) : s };
    let output: WritableStream;
    let error: WritableStream;

    beforeEach(() => {
        output = new WritableStream();
        error = new WritableStream();
    })

    test("Console with greeting and prompt, should handles two lines", async (done) => {
        const lines = "line1\nline2\n\nERROR\n";
        const input = Readable.from(lines);
        const console = new BaseStreamConsole(
            input,
            output,
            error,
            echoHandler,
            { prompt: "", greetingMessage: "Hi!\n", farewellMessage: "Bye!" }
        );
        // allow console to process input
        await console.promiseInputClose();
        expect(output.toString()).toEqual("Hi!\nline1\nline2\n\nBye!\n");
        expect(error.toString()).toEqual("ERROR\n");
        done();
    })

    test("Console should handle a closed input", async (done) => {
        const input = Readable.from([]);
        input.read(); // deplete the input
        input.emit("close");
        // expect(input.readableEnded).toBe(true);
        const console = new BaseStreamConsole(
            input,
            output,
            error,
            echoHandler
        );
        setTimeout(() => {
            expect(output.toString()).toEqual("> "); // prompt
            expect(console.isInputClosed).toEqual(true);
            const promiseClose = console.promiseInputClose();
            expect(promiseClose).resolves;
            done();
        })
    })


})


