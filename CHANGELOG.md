# Changelog
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2018-12-12

Updated package dependencies and re-released.

## [1.0.0] - 2018-09-19

First major release of the package. This version will receive full support if any issues are identified as it is no longer deemed to be a "development version".

### Added

- Added a check in `verifyOneTimeAuthCode()` to validate that the auth code is in the correct format before attempting to separate the code into mac and message. The function will now return false if the code doesn't pass the validation instead of attempting to verify.

## [0.2.2] - 2018-09-10
### Added

- Added convenience functions to test if a VerificationResult is a specific type. These are; `isInvalidOrUnrecognized()`, `isInvalid()`, `isValid()` and `isValidNeedsRehash()`. These functions will return true if the enumeration value matches the tested value.

## [0.2.1] - 2018-09-09
### Removed

- Removed development console.log calls from the module, these were left in after testing the changes to `static readonly` values.

## [0.2.0] - 2018-09-08
### Added

- Added JSDoc comments to all functions and important objects. This was then used with the TypeDoc module to generate a documentation site for the package.
- Added synchronous versions of hash and verify. `hashPasswordSync()` and `verifyHashSync()`.
- Added get and set functions for MemLimit. `MemLimit()` and `MemLimit(newValue)`.
- Added get and set functions for OpsLimit. `OpsLimit()` and `OpsLimit(newValue)`.

### Changed

- `static readonly` configuration default values are now set to their value manually. Previously they were just "re-exports" of sodium-native's constants.

### Removed

- **Possibly Breaking Change:** Removed `getMemLimit()` and `getOpsLimit()` functions, replaced with getters and setters as detailed above.

## [0.1.3] - 2018-09-06
### Added

- Added internal functions to convert buffers to url-safe base64 and back again.
- Added functions to generate and verify one time authentication buffers. Generates a mac from a supplied message using a random key.
- Added convenience function to generate and verify one time authentication codes, the mac and message is returned as base64 string.

### Changed

- Package npm/yarn name changed to argon2-pass as secure-pass was too close to another package name.

## [0.1.2] - 2018-09-06
### Fixed

- Moved SecurePassError and SecurePassOptionsError into a new file.

## [0.1.1] - 2018-09-06
### Fixed

- Fixed missing export SecurePassError.

## 0.1.0 - 2018-09-06
### Added

- Added constants for all recommended, minium, maxium and default configuration values.
- Added get functions for the currently configured memory limit and operations limit.
- Added a custom error class `SecurePassOptionsError` that is thrown if an error occurs during options validation.
- Added `hashPassword()` function, the function takes a password in as a buffer and provides the hashed output. The function can work with any of the following return methods; async/await, promise or callback.
- Added `VerificationResult` enumeration to serve as the response to the hash verification function.
- Added `verifyHash()` function, the function takes a password and a hash as buffers and provides a `VerificationResult` as an output. The function can work with any of the following return methods; async/await, promise or callback.

<!-- Links -->
[Unreleased]: https://github.com/DrBarnabus/secure-pass/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/DrBarnabus/secure-pass/compare/v0.2.1...v1.0.0
[0.2.1]: https://github.com/DrBarnabus/secure-pass/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/DrBarnabus/secure-pass/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/DrBarnabus/secure-pass/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/DrBarnabus/secure-pass/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/DrBarnabus/secure-pass/compare/v0.1.0...v0.1.1