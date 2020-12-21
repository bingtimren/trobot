import { Robot } from "../table-piece/robot";
import { robotCommands } from "./robot-commands"
import { Table } from "../core/api"

jest.mock("../table-piece/robot");

describe("Robot CLI commands", () => {

    const mockTable: Table = {
    } as Table;

    const mockRobot = new Robot();
    const cmdDesc = robotCommands(mockRobot, mockTable);

    function testExec(cmdLine: string): [string | undefined, string | Error] {
        for (const cmd of cmdDesc) {
            const patternMatch = cmd.pattern.exec(cmdLine);
            if (patternMatch !== null) {
                const resp = cmd.handler(...patternMatch.slice(1))
                return [cmd.name, resp]
            }
        }
        return [undefined, ""]
    }

    beforeEach(() => {
        jest.resetAllMocks();
        mockRobot.placeOn = jest.fn((_table, pose) => { return pose });
    })

    test("Command PLACE", () => {
        expect(testExec("PLACE 1,2,WEST")).toEqual(["PLACE", ""])
        expect(mockRobot.placeOn).toBeCalledWith(mockTable, { x: 1, y: 2, facing: 0 });
    });
    test("Command PLACE, robot return error", () => {
        (mockRobot.placeOn as any).mockReturnValueOnce(new Error())
        expect(testExec("PLACE 1,2,WEST")[1]).toBeInstanceOf(Error)
        expect(mockRobot.placeOn).toBeCalledWith(mockTable, { x: 1, y: 2, facing: 0 });
    });
    test("Command REPORT, robot return error", () => {
        (mockRobot.getPose as any).mockReturnValueOnce(new Error())
        expect(testExec("REPORT")[1]).toBeInstanceOf(Error)
        expect(mockRobot.getPose).toBeCalledWith();
    });

    test("Command PLACE, invalid direction", () => {
        expect(testExec("PLACE 1,2,UP")[0]).toEqual("PLACE")
        expect(testExec("PLACE 1,2,UP")[1]).toBeInstanceOf(Error)
        expect(mockRobot.placeOn).toBeCalledTimes(0);
    });
    test("Command PLACE, invalid coordination", () => {
        expect(testExec("PLACE 1,-2,EAST")).toEqual([undefined, ""])
        expect(mockRobot.placeOn).toBeCalledTimes(0);
    });

    test("Command MOVE", () => {
        expect(testExec("MOVE")).toEqual(["MOVE", ""])
        expect(mockRobot.moveForward).toBeCalled();
    });
    test("Command LEFT", () => {
        expect(testExec("LEFT")).toEqual(["LEFT", ""])
        expect(mockRobot.turnLeft).toBeCalled();
    });
    test("Command RIGHT", () => {
        expect(testExec("RIGHT")).toEqual(["RIGHT", ""])
        expect(mockRobot.turnRight).toBeCalled();
    });
    test("Command REPORT", () => {
        (mockRobot.getPose as any).mockReturnValue({ x: 1, y: 2, facing: 0 })
        expect(testExec("REPORT")).toEqual(["REPORT", "1,2,WEST"])
        expect(mockRobot.getPose).toBeCalled();
    });


});