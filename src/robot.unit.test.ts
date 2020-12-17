import { Robot } from "./robot";

describe("Robot", () => {
  test("Robot should has an unique ID", () => {
    const idSet: Set<string> = new Set();
    for (let i = 0; i < 1000; i++) {
      const robot = new Robot();
      expect(idSet.has(robot.id)).toBe(false);
      idSet.add(robot.id);
    }
  });
});
