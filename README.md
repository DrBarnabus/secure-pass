# secure-pass - Introduction

SecurePass is a module for the creation of hashes from passwords, allowing you to store passwords securely. The module also provides a facility for the generation and verification of one time use password reset tokens for use in your own password reset flows. This module is a wrapper for [libsodium]'s implementation of the [Argon2ID] password hashing algorithm.

# Features

- Uses the state of the art, secure modern password hashing algorithm [Argon2ID].
- Uses <code>Buffer</code>'s for safer memory management.
- Allows for generation of one time use password reset tokens to be used in your own password reset flow.
- Easily configurable work factors, allowing you to increase the security of your hashes over time.
- Three default difficulty configurations for password hashing, as defined in [libsodium]'s implementation.
- Simple rehashing of passwords you are already storing. Allowing you to improve the security of your hashes over time.
- The module is written in typescript and ships with a type definition by default.

# Installation

**Coming Soon**

# Usage

**Coming Soon**

# Testing

**Coming Soon**

# Credits

**Coming Soon**

# Licence
Licensed under [MIT](./LICENSE).

Copyright (C) 2018 DrBarnabus

<!-- Links -->
[libsodium]: https://download.libsodium.org/doc/
[Argon2ID]: https://en.wikipedia.org/wiki/Argon2

<!-- Badges -->
