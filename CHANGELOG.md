# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.7](https://github.com/bingtimren/trobot/compare/v2.0.6...v2.0.7) (2020-12-22)

### [2.0.6](https://github.com/bingtimren/trobot/compare/v2.0.5...v2.0.6) (2020-12-22)

### [2.0.5](https://github.com/bingtimren/trobot/compare/v2.0.4...v2.0.5) (2020-12-22)

### [2.0.4](https://github.com/bingtimren/trobot/compare/v2.0.3...v2.0.4) (2020-12-22)

### [2.0.3](https://github.com/bingtimren/trobot/compare/v2.0.2...v2.0.3) (2020-12-22)

### [2.0.2](https://github.com/bingtimren/trobot/compare/v2.0.1...v2.0.2) (2020-12-22)

### [2.0.1](https://github.com/bingtimren/trobot/compare/v2.0.0...v2.0.1) (2020-12-22)

## 2.0.0 (2020-12-21)


### ⚠ BREAKING CHANGES

* **main function:** Refactored many times
* **core, table and robot:** Core interface change. Implementations will need to change accordingly.
* **map-direction.ts:** Return explicit Error instead of throwing Error, force user to check return type

### Features

* **e2e test completed:** all end-to-end tests passed ([a7c004e](https://github.com/bingtimren/trobot/commit/a7c004e6bc884f7c2e950f0c4906a5d1d13186dc))
* **main function:** main function done, all tests passed ([2f1d87d](https://github.com/bingtimren/trobot/commit/2f1d87d9bcf61ec29f07a8aba6126a00baca1734))
* **table and table-piece:** provided core types definition and simple implementations for the test ([6900a5c](https://github.com/bingtimren/trobot/commit/6900a5cdfc1a86bb9859c2008237670998da38c7))
* **utils:** added methodWrapperDecorator ([7a775f4](https://github.com/bingtimren/trobot/commit/7a775f41ca573ac06970bc0610c01eaa0df1f94f))


### Bug Fixes

* last commit did not include new src folders. Fixed ([84238c7](https://github.com/bingtimren/trobot/commit/84238c7ab3493bb590d9b20e00276a5daa45adbd))
* **console test case:** modified test case to be consistent with console behaviour ([7c56b67](https://github.com/bingtimren/trobot/commit/7c56b67a763cfa65a2e74cd20f45be8c00815fc4))
* **fix package.json:** fixed run-script prepare-release ([1679fee](https://github.com/bingtimren/trobot/commit/1679fee693a47ac6c579bba3683047c0ed151fc7))
* **package.json:** added a missing dependency ([1484793](https://github.com/bingtimren/trobot/commit/1484793b6497998f63126433a23db877345ba784))
* **utils:** enable experimental decorators ([b419d10](https://github.com/bingtimren/trobot/commit/b419d10ac5284e573d75c6a5634770bdcde77fbf))


* **core, table and robot:** refactored core interfaces, changed table and robot accordingly ([d67d9ea](https://github.com/bingtimren/trobot/commit/d67d9ea4c072570f72ba08b344ecedec41029bea))
* **map-direction.ts:** make map-direction more functional style ([322abe8](https://github.com/bingtimren/trobot/commit/322abe8bb86c6316a6e48226ade43cb49adc822d))
