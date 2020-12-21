import { fork } from "child_process"
import * as readline from "readline"

const WELCOME = /^Welcome.*/;
const PROMPT = "command: ";
const BYE = /^Bye!$/;

const e2eData: { desc: string, commands: string[], outputs: RegExp[] }[] = [
  {
    desc: "greeting, help, and bye.",
    commands: ["help"],
    outputs: [WELCOME, new RegExp(`^${PROMPT}PLACE.*$`), /MOVE:.* /, /LEFT.* /, /RIGHT:.* /, /REPORT:.* /, new RegExp(`^${PROMPT}$`), BYE]
  },
  {
    desc: "a normal walk around",
    commands: [
      "PLACE 0,0,EAST",
      "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "RIGHT",
      "RIGHT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "RIGHT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "RIGHT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
      "RIGHT", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT",
    ],
    outputs: [WELCOME,
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}4,0,EAST$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}4,4,NORTH$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,4,WEST$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,0,SOUTH$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,4,NORTH$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}4,4,EAST$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}4,0,SOUTH$`),
      new RegExp(`^^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,0,WEST$`),
      new RegExp(`^^${PROMPT}$`),
      BYE
    ]
  },
  {
    desc: "bumble around",
    commands: [
      "MOVE", "REPORT", // bumble at left bottom corner
      "LEFT", "REPORT",
      "RIGHT", "REPORT",
      "PLACE 0,0,WEST",
      "MOVE", "REPORT",
      "LEFT", "MOVE", "REPORT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT", // bumble to right bottom
      "MOVE", "REPORT",
      "PLACE 10,10,NORTH", "REPORT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT", // to top-right
      "RIGHT", "MOVE", "REPORT",
      "LEFT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT", // bumble to top-left
      "RIGHT", "MOVE", "REPORT",
      "LEFT",
      "LEFT", "MOVE", "MOVE", "MOVE", "MOVE", "MOVE", "REPORT", // bumble to 0,0

    ],
    outputs: [
      WELCOME,
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,0,WEST$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}0,0,SOUTH$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}4,0,EAST$`), // to right bottom
      new RegExp(`^${PROMPT}${PROMPT}4,0,EAST$`),
      new RegExp(`^${PROMPT}${PROMPT}4,0,EAST$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}4,4,NORTH$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}4,4,EAST$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,4,WEST$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}0,4,NORTH$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,0,SOUTH$`),
      new RegExp(`^${PROMPT}$`),
      BYE
    ]
  },
  {
    desc: "various valid command formats",
    commands: [
      "PLACE 0, 0, WEST", " REPORT",
      "PLACE 0 ,0 , EAST", "REPORT   ",
      "PLACE 0 ,0 ,SOUTH", " REPORT   ",
      "PLACE 0, 0, NORTH", "\tREPORT\t",
      " MOVE", "MOVE ", "  MOVE   ", "\tMOVE   ", "REPORT",
      " LEFT", "LEFT ", "  LEFT   ", "\tLEFT   ", "REPORT",
      " RIGHT", "RIGHT ", "  RIGHT   ", "\tRIGHT   ", "REPORT",
    ],
    outputs: [
      WELCOME,
      new RegExp(`^${PROMPT}${PROMPT}0,0,WEST$`),
      new RegExp(`^${PROMPT}${PROMPT}0,0,EAST$`),
      new RegExp(`^${PROMPT}${PROMPT}0,0,SOUTH$`),
      new RegExp(`^${PROMPT}${PROMPT}0,0,NORTH$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,4,NORTH$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,4,NORTH$`),
      new RegExp(`^${PROMPT}${PROMPT}${PROMPT}${PROMPT}${PROMPT}0,4,NORTH$`),
      new RegExp(`^${PROMPT}$`),
      BYE
    ]
  },
  {
    desc: "various invalid command formats",
    commands: [
      "PLACE -0,0,WEST", "REPORT",
      "PLACE 0,5,EAST", "REPORT",
      "PLACE 0,0,SAUCE", "REPORT!",
      "PLACE 5,0,NORTH", "REPORT",
      "PLACE 0,4,NORTH", // place on table
      "MVE", "MOV", "NOVE", "tMOVE", "REPORT!",
      " LEFT ALONE", "LEFT HOME", "TURN  LEFT   ", "left   ", "?REPORT",
      " GO RIGHT", "right ", "  RIGHT!   ", "tRIGHT   ", "REPORT",
    ],
    outputs: [
      WELCOME,
      new RegExp(`^${PROMPT.repeat(24)}0,4,NORTH$`),
      new RegExp(`^${PROMPT}$`),
      BYE
    ]
  },
  {
    desc: "Given example a)",
    commands: [
      "PLACE 0,0,NORTH", "MOVE", "REPORT"
    ],
    outputs: [
      WELCOME,
      new RegExp(`^${PROMPT.repeat(3)}0,1,NORTH$`),
      new RegExp(`^${PROMPT}$`),
      BYE
    ]
  },
  {
    desc: "Given example b)",
    commands: [
      "PLACE 0,0,NORTH", "LEFT", "REPORT"
    ],
    outputs: [
      WELCOME,
      new RegExp(`^${PROMPT.repeat(3)}0,0,WEST$`),
      new RegExp(`^${PROMPT}$`),
      BYE
    ]
  },
  {
    desc: "Given example c)",
    commands: [
      "PLACE 1,2,EAST", "MOVE", "MOVE", "LEFT", "MOVE", "REPORT"
    ],
    outputs: [
      WELCOME,
      new RegExp(`^${PROMPT.repeat(6)}3,3,NORTH$`),
      new RegExp(`^${PROMPT}$`),
      BYE
    ]
  },


]


async function testRun(desc: string, input: string[], expectedOutput: RegExp[]) {
  return new Promise<void>((resolve, reject) => {
    const childProcess = fork("build/main/main.js", {
      stdio: "pipe"
    })
    childProcess.on("exit", (code) => {
      expect(code).toBe(0);
      resolve();
    });
    for (const inputLine of input) {
      childProcess.stdin?.write(inputLine + "\n")
    }
    childProcess.stdin?.end();
    const report: string[] = []
    const readLineInstance = readline.createInterface(childProcess.stdout!);
    let outputLineCount: number = 0;
    readLineInstance.on("line", (line: string) => {
      const expected = (outputLineCount < expectedOutput.length) ? expectedOutput[outputLineCount] : undefined;
      if (expected && expected.test(line)) {
        report.push(`LINE ${outputLineCount}: ${line} (ok)`);
      } else {
        const message = `LINE ${outputLineCount}: ${line} (ERROR: not match ${expected ? expected.source : "UNEXPECTED"})`
        report.push(message);
        reject(new Error(message));
      }
      outputLineCount++
    })
    readLineInstance.on("close", () => {
      expect(outputLineCount === expectedOutput.length);
      console.log(`E2E Test ${desc}\n${report.reduce((l, r) => l + "\n" + r)}`);
      resolve();
    })
  })
}

describe("End to end integration test", () => {
  test("All e2e cases", async (done) => {
    for (const { desc, commands, outputs } of e2eData) {
      await testRun(desc, commands, outputs)
    }
    done();
  });
});
