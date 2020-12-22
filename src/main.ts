#!/usr/bin/env node

/**
 * Entry point of the game console
 * @packageDocumentation
 */
import { buildToyRobotConsole } from "./integration/toy-robot-console";

const WIDTH = 5;
const HEIGHT = 5;

const console = buildToyRobotConsole(
  process.stdin,
  process.stdout,
  process.stderr,
  WIDTH,
  HEIGHT
);

// exit when user ends input
console.promiseInputClose().then(() => {
  process.exit(0);
});
