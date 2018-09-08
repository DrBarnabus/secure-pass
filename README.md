<p align="center"><a href="https://drbarnabus.github.io/secure-pass/"><img width="60%" src="https://raw.github.com/DrBarnabus/secure-pass/master/media/logo_transparent_background.png"></a></p>

[![NPM Version][npm-badge]][npm-url]
[![NPM Downloads][npmd-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Test Coverage][codecov-badge]][codecov-url]
[![Dependencies][dependencies-badge]][dependencies-url]
[![devDependencies][devDependencies-badge]][devDependencies-url]
[![Known Vulnerabilities][snyk-badge]][snyk-url]
[![Code Quality][codacy-badge]][codacy-url]
# Introduction

SecurePass (argon2-pass) is a module for the creation of hashes from passwords, allowing you to store passwords securely. The module also provides a facility for the generation and verification of one time authentication tokens for use in your own password reset flows. This module is a wrapper for [libsodium]'s implementation of the [Argon2ID] password hashing algorithm and Poly1305.

# Features

- Uses the state of the art, secure modern password hashing algorithm [Argon2ID].
- Uses Buffer's for safer memory management.
- Uses static functions for basic operations, so you don't have to create a new instance every time.
- asynchronous functions are defined to work with async/await, promises and callbacks. Synchronous versions are also available just in-case you don't want your hashing and verification to be  asynchronous.
- Allows for generation of one time use authentication tokens to be used in your own password reset flow.
- Easily configurable work factors, allowing you to increase the security of your hashes over time.
- Three default difficulty configurations for password hashing, as defined in [libsodium]'s implementation. Allowing you to configure your security level based on some recommended predefined values.
- Simple rehashing of passwords you are already storing. Allowing you to improve the security of your hashes over time.
- The module is written in typescript and ships with a type definition file by default.

# Installation

Install argon2-pass using [`yarn`](https://yarnpkg.com/en/package/argon2-pass):

```bash
yarn add argon2-pass
```

Or via [`npm`](https://www.npmjs.com/package/argon2-pass):

```bash
npm install argon2-pass
```

# Usage

Basic Usage Information:

```typescript
import { SecurePass, VerificationResult } from 'argon2-pass';

async function main() {
  // Create a new instance of SecurePass. Optional difficulty configurations can be passed in here.
  const sp = new SecurePass();
  
  // Passwords and Hashes are stored as buffers internally.
  const password = Buffer.from('SamplePassword');
  const hash = await sp.hashPassword(password);

  // Hash Verification returns an enumerator for easy validation of passwords against hashes.
  const result = await sp.verifyHash(password, hash);
  if (result == VerificationResult.InvalidOrUnrecognised) { 
    console.log('Hash not created by SecurePass or invalid');
  } else if (result == VerificationResult.Invalid) {
    console.log('Password not valid when compared with supplied hash');
  } else if (result == VerificationResult.Valid) {
    console.log('Password and Hash are a match');
  } else if (result == VerificationResult.ValidNeedsRehash) {
    console.log('Password and Hash are a match, but the security of the hash could be improved by rehashing.');
  }
}

// Call the async function defined above to run the example.
main();
```

For full documentation, please refer to the full [documentation site](https://drbarnabus.github.io/secure-pass/globals.html). The documentation was generated automaticaly with [TypeDoc].

# Testing

This package is configured with [jest] tests, these tests ensure that the module is working correctly and as specified as well as generating code coverage reports to ensure every line of code is covered by a unit test.

To run the jest tests manualy run the test script defined in package.json:

```bash
yarn test
```

This module also has the following automated testing:

- CI Builds on [Travis].
- Code Coverage Reports on [CodeCov].
- Dependency Update Checks on [david-dm].
- Dependency Vulnerabilities Checks on [snyk].
- Automated Code Review and Quality Report on [codacy].

# Acknowledgements

- Special thanks to the creators of [libsodium] and [sodium-native] both of which are used extensively in this package, and without which the creation of this module wouldn't have been possible.

# Licence
Licensed under [MIT](https://raw.github.com/DrBarnabus/secure-pass/master/LICENSE).

Copyright (C) 2018 DrBarnabus

<!-- Links -->
[libsodium]: https://download.libsodium.org/doc/
[Argon2ID]: https://en.wikipedia.org/wiki/Argon2
[sodium-native]: https://github.com/sodium-friends/sodium-native
[jest]: https://github.com/facebook/jest
[Travis]: https://travis-ci.org/DrBarnabus/secure-pass
[CodeCov]: https://codecov.io/gh/DrBarnabus/secure-pass
[david-dm]: https://david-dm.org/drbarnabus/secure-pass
[snyk]: https://snyk.io/test/github/DrBarnabus/secure-pass?targetFile=package.json
[codacy]: https://www.codacy.com/app/DrBarnabus/secure-pass?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DrBarnabus/secure-pass&amp;utm_campaign=Badge_Grade
[TypeDoc]: https://github.com/TypeStrong/typedoc

<!-- Badges -->
[npm-badge]: https://img.shields.io/npm/v/argon2-pass.svg
[npm-url]: https://www.npmjs.com/package/argon2-pass
[npmd-badge]: https://img.shields.io/npm/dw/argon2-pass.svg
[travis-badge]: https://travis-ci.org/DrBarnabus/secure-pass.svg?branch=master
[travis-url]: https://travis-ci.org/DrBarnabus/secure-pass
[codecov-badge]: https://codecov.io/gh/DrBarnabus/secure-pass/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/DrBarnabus/secure-pass
[dependencies-badge]: https://david-dm.org/drbarnabus/secure-pass.svg
[dependencies-url]: https://david-dm.org/drbarnabus/secure-pass
[devDependencies-badge]: https://david-dm.org/drbarnabus/secure-pass/dev-status.svg
[devDependencies-url]: https://david-dm.org/drbarnabus/secure-pass?type=dev
[snyk-badge]: https://snyk.io/test/github/DrBarnabus/secure-pass/badge.svg?targetFile=package.json
[snyk-url]: https://snyk.io/test/github/DrBarnabus/secure-pass?targetFile=package.json
[codacy-badge]: https://api.codacy.com/project/badge/Grade/86e94a6a25c44d7bb7e514e7e2747e24
[codacy-url]: https://www.codacy.com/app/DrBarnabus/secure-pass?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DrBarnabus/secure-pass&amp;utm_campaign=Badge_Grade