<p align="center"><img width=60% src="https://github.com/DrBarnabus/secure-pass/blob/master/media/logo_transparent_background.png"></p>

[![NPM Version][npm-badge]][npm-url]
[![NPM Downloads][npmd-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Test Coverage][codecov-badge]][codecov-url]
[![Dependencies][dependencies-badge]][dependencies-url]
[![devDependencies][devDependencies-badge]][devDependencies-url]
[![Known Vulnerabilities][snyk-badge]][snyk-url]
# Introduction

SecurePass is a module for the creation of hashes from passwords, allowing you to store passwords securely. The module also provides a facility for the generation and verification of one time use password reset tokens for use in your own password reset flows. This module is a wrapper for [libsodium]'s implementation of the [Argon2ID] password hashing algorithm.

# Features

- Uses the state of the art, secure modern password hashing algorithm [Argon2ID].
- Uses <code>Buffer</code>'s for safer memory management.
- Allows for generation of one time use password reset tokens to be used in your own password reset flow.
- Easily configurable work factors, allowing you to increase the security of your hashes over time.
- Three default difficulty configurations for password hashing, as defined in [libsodium]'s implementation. Allowing you to configure your security level based on some recommended predefined values.
- Simple rehashing of passwords you are already storing. Allowing you to improve the security of your hashes over time.
- The module is written in typescript and ships with a type definition file by default.

# Installation

To install the package you need to use a package manager such as npm or yarn.

```
yarn add secure-pass
npm install secure-pass
```

# Usage

**Coming Soon**

# Testing

This package is configured with [jest] tests, these tests ensure that the module is working correctly and as specified as well as generating code coverage reports.

```
yarn test
or
npm test
```

# Acknowledgements

- Special thanks to the creators of [libsodium] and [sodium-native] both of which are used extensively in this package, and without which the creation of this module wouldn't have been possible.

# Licence
Licensed under [MIT](./LICENSE).

Copyright (C) 2018 DrBarnabus

<!-- Links -->
[libsodium]: https://download.libsodium.org/doc/
[Argon2ID]: https://en.wikipedia.org/wiki/Argon2
[sodium-native]: https://github.com/sodium-friends/sodium-native

<!-- Badges -->
[npm-badge]: https://img.shields.io/npm/v/secure-pass.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/secure-pass
[npmd-badge]: https://img.shields.io/npm/dw/secure-pass.svg?style=flat-square
[travis-badge]: https://img.shields.io/travis/DrBarnabus/secure-pass/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/DrBarnabus/secure-pass
[dependencies-badge]: https://david-dm.org/drbarnabus/secure-pass.svg?style=flat-square
[codecov-badge]: https://img.shields.io/codecov/c/github/DrBarnabus/secure-pass/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/DrBarnabus/secure-pass
[dependencies-url]: https://david-dm.org/drbarnabus/secure-pass
[devDependencies-badge]: https://david-dm.org/drbarnabus/secure-pass/dev-status.svg?style=flat-square
[devDependencies-url]: https://david-dm.org/drbarnabus/secure-pass?type=dev
[snyk-badge]: https://snyk.io/test/github/DrBarnabus/secure-pass/badge.svg?targetFile=package.json&style=flat-square
[snyk-url]: https://snyk.io/test/github/DrBarnabus/secure-pass?targetFile=package.json