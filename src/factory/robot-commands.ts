import { Pose, Table } from "../core/api";
import { getDirectionNameFromDirection, getMapDirectionFromName } from "../core/map-direction";
import { Robot } from "../table-piece/robot";
import { CLIDescriptor } from "../ui/cli-handler";

function returnStringOrError(response: Pose | Error): string | Error {
    return response instanceof Error ? response : ""
}

export function robotCommands(robot: Robot, table: Table): CLIDescriptor[] {
    return [
        {
            name: "PLACE",
            pattern: /^PLACE\s+(\d+)\s*,\s*(\d+)\s*,\s*([A-Z]+)$/,
            helpMessage: "PLACE X,Y,F - place robot at coordination X,Y facing direction F",
            handler: (x: string, y: string, f: string) => {
                const facing = getMapDirectionFromName(f);
                const nx = Number.parseInt(x);
                const ny = Number.parseInt(y);
                if (typeof facing === "number" && nx !== undefined && ny !== undefined) {
                    return returnStringOrError(robot.placeOn(table, {
                        x: nx, y: ny, facing
                    }));
                };
                return new Error('Invalid command format.')
            }
        },
        {
            name: "MOVE",
            pattern: /^MOVE$/,
            helpMessage: "move robot forward",
            handler: () => {
                return returnStringOrError(robot.moveForward())
            }
        },
        {
            name: "LEFT",
            pattern: /^LEFT$/,
            helpMessage: "turn robot left",
            handler: () => {
                return returnStringOrError(robot.turnLeft());
            }
        },
        {
            name: "RIGHT",
            pattern: /^RIGHT$/,
            helpMessage: "turn robot right",
            handler: () => {
                return returnStringOrError(robot.turnRight());
            }
        },
        {
            name: "REPORT",
            pattern: /^REPORT$/,
            helpMessage: "report robot pose",
            handler: () => {
                const poseOrError = robot.getPose();
                return poseOrError instanceof Error ? poseOrError : `${poseOrError.x},${poseOrError.y},${getDirectionNameFromDirection(poseOrError.facing)}`
            }
        },
    ]
};


