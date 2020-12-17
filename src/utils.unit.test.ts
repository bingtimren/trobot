import { methodWrapperDecorator } from "./utils";

const yesToNo = methodWrapperDecorator(
  (thisArg: Greet, originalMethod: (s: string) => string, ...args): string => {
    const s = args[0];
    if (s === "yes") {
      return thisArg.greeting + " " + "no";
    } else if (s === "throw") {
      throw new Error();
    } else {
      return originalMethod.apply(thisArg, args);
    }
  }
);

class Greet {
  constructor(public greeting: string) {}
  @yesToNo
  greet(name: string): string {
    return this.greeting + " " + name;
  }
}

describe("MethodPreprocessor", () => {
  test("MethodPreprocessor should work as expected, both pre-processor and original method can access 'this'", () => {
    const g = new Greet("Hi,");
    expect(g.greet("Peter")).toBe("Hi, Peter");
    expect(g.greet("yes")).toBe("Hi, no");
    expect(() => {
      g.greet("throw");
    }).toThrowError();
  });
});
