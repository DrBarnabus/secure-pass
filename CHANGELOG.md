# Changelog
All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased - 0.1.3
### Added

- Added internal functions to convert buffers to url-safe base64 and back again.
- Added functions to generate and verify one time authentication buffers. Generates a mac from a supplied message using a random key.
- Added convenience function to generate and verify one time authentication codes, the mac and message is returned as base64 string.

### Changed

- Package npm/yarn name changed to argon2-pass as secure-pass was too close to another package name.

## 0.1.2 - 2018-09-06
### Fixed

- Moved SecurePassError and SecurePassOptionsError into a new file.

## 0.1.1 - 2018-09-06
### Fixed

- Fixed missing export SecurePassError.

## 0.1.0 - 2018-09-06
### Added

- Added constants for all recommended, minium, maxium and default configuration values.
- Added get functions for the currently configured memory limit and operations limit.
- Added a custom error class <code>SecurePassOptionsError</code> that is thrown if an error occurs during options validation.
- Added <code>hashPassword()</code> function, the function takes a password in as a buffer and provides the hashed output. The function can work with any of the following return methods; async/await, promise or callback.
- Added <code>VerificationResult</code> enumeration to serve as the response to the hash verification function.
- Added <code>verifyHash()</code> function, the function takes a password and a hash as buffers and provides a <code>VerificationResult</code> as an output. The function can work with any of the following return methods; async/await, promise or callback.

<!-- Links -->
