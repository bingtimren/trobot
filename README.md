![Build & Test](https://github.com/bingtimren/trobot/workflows/CI/badge.svg)

# trobot
Implementation of the toy robot code challenge.

## Design

Below is the project's dependency graph.

![](https://raw.githubusercontent.com/bingtimren/trobot/gh-pages/dependencygraph.svg)

See [DESIGN Document](https://github.com/bingtimren/trobot/blob/main/DESIGN.md) for the high-level design of this project and discussion about the design goals and some design decisions.


## API

See [API Document](https://bingtimren.github.io/trobot/) for details.
To build and browse the API document of the current code, run
```
npm run doc
```

## How To Use From Project Root Dir

After cloning this project, run

```
npm install
npm run run
```

Then follow the instructions on screen.

## How to Install CLI locally

After cloning this project, run

```
npm install
npm run install-cli
```

Then run `trobot` or `npx trobot` to launch the game console.

## How to Build
```
npm run build
```

## How to Test
```
npm run test
```
This will build and run all unit tests with calculation of coverage (requires 100% to pass), integration tests, and an end-to-end test.
```
npm run test:func
```
This will build and run functional tests (unit tests, integration and end-to-end tests).
```
npm run test:func:unit
npm run test:func:integration

```
This will run unit and integration (including e2d) tests respectively, without build.
```
npm run watch:test
```
This will invoke jest with --watchAll, run functional tests automatically when something is changed.
```
npm run cov
```
This will run all unit tests and open the coverage report page.

## How to Contribute

This project is hosted on Github to track issues, feature requests, and pull requests.

This project uses [commit-zen](https://github.com/commitizen/cz-cli) to create commit messages. To commit, use `git cz`.

## How to Release

WARNING!!! WARNING!!! WARNING!!! WARNING!!! WARNING!!!

Running `npm run prepare-release` will first hard-reset the working dir. Don't do it before committing or stashing your changes!

WARNING!!! WARNING!!! WARNING!!! WARNING!!! WARNING!!!

Before release, run all tests, and format the codes, and COMMIT the latest changes.

```
npm run test
npm run fix
git cz
```
Then run `npm run prepare-release` to prepare release. If everything is ok, follow instructions at the end of the on-screen messages to release.

## CI

On push or pull request events on the main branch, a CI workflow would be triggered. The workflow builds, and run all the tests on the following OS and Node versions:

OS: latest Ubuntu, Windows and MacOS
Node: 10.x, 12.x, 13.x

## Roadmap

- Introduce [project management](https://github.com/features/project-management/) and [Github flow](https://guides.github.com/introduction/flow/)  if the project becomes complex and team grows.
- Currently only installs locally. If will release to the public, should build a CD workflow.
- See DESIGN Document for thinking about the expansion of core API interfaces to model more complex games.


