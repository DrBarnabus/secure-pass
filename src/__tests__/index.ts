import sodium from 'sodium-native';
import { SecurePass, VerificationResult } from '..';
import { SecurePassError, SecurePassOptionsError } from '../error';

describe('SecurePass', () => {
  test('static readonly constants should be defined.', () => {
    expect(SecurePass.PasswordBytesMin).toBeDefined();
    expect(SecurePass.PasswordBytesMax).toBeDefined();
    expect(SecurePass.HashBytes).toBeDefined();
    expect(SecurePass.SaltBytes).toBeDefined();
    expect(SecurePass.MacBytes).toBeDefined();
    expect(SecurePass.KeyBytes).toBeDefined();

    // Memory Limit Constants
    expect(SecurePass.MemLimitDefault).toBeDefined();
    expect(SecurePass.MemLimitInteractive).toBeDefined();
    expect(SecurePass.MemLimitModerate).toBeDefined();
    expect(SecurePass.MemLimitSensitive).toBeDefined();
    expect(SecurePass.MemLimitMinimum).toBeDefined();
    expect(SecurePass.MemLimitMaximum).toBeDefined();

    // Operations Limit Constants
    expect(SecurePass.OpsLimitDefault).toBeDefined();
    expect(SecurePass.OpsLimitInteractive).toBeDefined();
    expect(SecurePass.OpsLimitModerate).toBeDefined();
    expect(SecurePass.OpsLimitSensitive).toBeDefined();
    expect(SecurePass.OpsLimitMinimum).toBeDefined();
    expect(SecurePass.OpsLimitMaximum).toBeDefined();
  });

  test('static readonly constants should have the correct values.', () => {
    expect(SecurePass.PasswordBytesMin).toEqual(1);
    expect(SecurePass.PasswordBytesMax).toEqual(2147483647);
    expect(SecurePass.HashBytes).toEqual(128);
    expect(SecurePass.SaltBytes).toEqual(16);
    expect(SecurePass.MacBytes).toEqual(16);
    expect(SecurePass.KeyBytes).toEqual(32);

    // Memory Limit Constants
    expect(SecurePass.MemLimitDefault).toEqual(67108864);
    expect(SecurePass.MemLimitInteractive).toEqual(67108864);
    expect(SecurePass.MemLimitModerate).toEqual(268435456);
    expect(SecurePass.MemLimitSensitive).toEqual(1073741824);
    expect(SecurePass.MemLimitMinimum).toEqual(8192);
    expect(SecurePass.MemLimitMaximum).toEqual(4398046510080);

    // Operations Limit Constants
    expect(SecurePass.OpsLimitDefault).toEqual(2);
    expect(SecurePass.OpsLimitInteractive).toEqual(2);
    expect(SecurePass.OpsLimitModerate).toEqual(3);
    expect(SecurePass.OpsLimitSensitive).toEqual(4);
    expect(SecurePass.OpsLimitMinimum).toEqual(1);
    expect(SecurePass.OpsLimitMaximum).toEqual(4294967295);
  });

  describe('SecurePass MemLimit and OpsLimit Options', () => {
    test('Passing no configuration to SecurePass, should create a new instance with the default values', () => {
      const sp1 = new SecurePass();
      expect(sp1.MemLimit).toEqual(SecurePass.MemLimitDefault);
      expect(sp1.OpsLimit).toEqual(SecurePass.OpsLimitDefault);

      const sp2 = new SecurePass({});
      expect(sp2.MemLimit).toEqual(SecurePass.MemLimitDefault);
      expect(sp2.OpsLimit).toEqual(SecurePass.OpsLimitDefault);
    });

    test('Passing no value for memLimit, should result in the default value being set.', () => {
      const sp = new SecurePass({
        opsLimit: 6
      });
      expect(sp.MemLimit).toEqual(SecurePass.MemLimitDefault);
    });

    test('Passing no value for opsLimit, should result in the default value being set.', () => {
      const sp = new SecurePass({
        memLimit: 16 * 1024
      });
      expect(sp.OpsLimit).toEqual(SecurePass.OpsLimitDefault);
    });

    // Test Valid Values for MemLimit, Including Upper and Lower Bounds.
    describe.each([SecurePass.MemLimitInteractive, SecurePass.MemLimitMinimum, SecurePass.MemLimitMaximum])(
      'Valid and Edge Case values for MemLimit.',
      m => {
        test(`${m} should be a valid value for MemLimit, when passed in the constructor.`, () => {
          const sp = new SecurePass({
            memLimit: m
          });
          expect(sp.MemLimit).toEqual(m);
        });

        test(`${m} should be a valid value for MemLimit, when set with the accessor.`, () => {
          const sp = new SecurePass();
          sp.MemLimit = m;
          expect(sp.MemLimit).toEqual(m);
        });
      }
    );

    // Test Valid Values for OpsLimit, Including Upper and Lower Bounds.
    describe.each([SecurePass.OpsLimitInteractive, SecurePass.OpsLimitMinimum, SecurePass.OpsLimitMaximum])(
      'Valid and Edge Case values for OpsLimit.',
      o => {
        test(`${o} should be a valid value for OpsLimit, when passed in the constructor.`, () => {
          const sp = new SecurePass({
            opsLimit: o
          });
          expect(sp.OpsLimit).toEqual(o);
        });

        test(`${o} should be a valid value for OpsLimit, when set with the accessor.`, () => {
          const sp = new SecurePass();
          sp.OpsLimit = o;
          expect(sp.OpsLimit).toEqual(o);
        });
      }
    );

    // Test Invalid Values for MemLimit.
    describe.each([SecurePass.MemLimitMinimum - 1, SecurePass.MemLimitMaximum + 1])(
      'Invalid Values for MemLimit.',
      m => {
        test(`${m} should be an invalid value for MemLimit, when passed in the constructor.`, () => {
          try {
            const sp = new SecurePass({
              memLimit: m
            });

            // Makes sure that the error is thrown.
            expect(true).toBeFalsy();
          } catch (e) {
            expect(e instanceof SecurePassOptionsError).toBeTruthy();
          }
        });

        test(`${m} should be an invalid value for MemLimit, when set with the accessor.`, () => {
          try {
            const sp = new SecurePass();
            sp.MemLimit = m;

            // Makes sure that the error is thrown.
            expect(true).toBeFalsy();
          } catch (e) {
            expect(e instanceof SecurePassOptionsError).toBeTruthy();
          }
        });
      }
    );

    // Test Invalid Values for OpsLimit.
    describe.each([SecurePass.OpsLimitMinimum - 1, SecurePass.OpsLimitMaximum + 1])(
      'Invalid Values for OpsLimit.',
      o => {
        test(`${o} should be an invalid value for OpsLimit, when passed in the constructor.`, () => {
          try {
            const sp = new SecurePass({
              opsLimit: o
            });

            // Makes sure that the error is thrown.
            expect(true).toBeFalsy();
          } catch (e) {
            expect(e instanceof SecurePassOptionsError).toBeTruthy();
          }
        });

        test(`${o} should be an invalid value for OpsLimit, when set with the accessor.`, () => {
          try {
            const sp = new SecurePass();
            sp.OpsLimit = o;

            // Makes sure that the error is thrown.
            expect(true).toBeFalsy();
          } catch (e) {
            expect(e instanceof SecurePassOptionsError).toBeTruthy();
          }
        });
      }
    );
  });

  describe('generateOneTimeAuth()', () => {
    test('Should return a mac, random key and the original message.', () => {
      const message = Buffer.from('ExampleMessage');
      const result = SecurePass.generateOneTimeAuth(message);

      expect(result.mac.length).toEqual(SecurePass.MacBytes);
      expect(result.message.compare(message)).toEqual(0);
      expect(result.key.length).toEqual(SecurePass.KeyBytes);
    });
  });

  describe('verifyOneTimeAuth()', () => {
    test('Should return true if the message, mac and random key match.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const result = SecurePass.verifyOneTimeAuth(ota.mac, message, ota.key);

      expect(result).toBeTruthy();
    });

    test('Should return false if the message does not match the mac and key.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const badMessage = Buffer.from('ExampleMessageBad');
      const result = SecurePass.verifyOneTimeAuth(ota.mac, badMessage, ota.key);

      expect(result).toBeFalsy();
    });

    test('Should return false if the mac does not match the message and key.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const badMac = Buffer.alloc(SecurePass.MacBytes);
      const result = SecurePass.verifyOneTimeAuth(badMac, message, ota.key);

      expect(result).toBeFalsy();
    });

    test('Should return false if the random key does not match the message and mac.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const badKey = Buffer.alloc(SecurePass.KeyBytes);
      const result = SecurePass.verifyOneTimeAuth(ota.mac, message, badKey);

      expect(result).toBeFalsy();
    });
  });

  describe('generateOneTimeAuthCode()', () => {
    test('Should return a valid code and a key buffer.', () => {
      const message = Buffer.from('ExampleMessage');
      const otac = SecurePass.generateOneTimeAuthCode(message);

      expect(otac.code.indexOf('~')).not.toEqual(-1);
      expect(otac.key.length).toEqual(SecurePass.KeyBytes);
    });
  });

  describe('verifyOneTimeAuthCode()', () => {
    test('Should return true when called with a valid code and key.', () => {
      const message = Buffer.from('ExampleMessage');
      const otac = SecurePass.generateOneTimeAuthCode(message);

      const result = SecurePass.verifyOneTimeAuthCode(otac.code, otac.key);
      expect(result).toBeTruthy();
    });

    test('Should return false if called with an invalid key.', () => {
      const message = Buffer.from('ExampleMessage');
      const otac = SecurePass.generateOneTimeAuthCode(message);

      const badKey = Buffer.alloc(SecurePass.KeyBytes);
      const result = SecurePass.verifyOneTimeAuthCode(otac.code, badKey);
      expect(result).toBeFalsy();
    });
  });

  describe('async/promise hashPassword()', () => {
    test('Should return a hash if given a valid password.', async done => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = await sp.hashPassword(password);

      expect(hash.length).toEqual(SecurePass.HashBytes);
      expect(hash.indexOf('$argon2id')).toEqual(0);

      done();
    });

    test.each([SecurePass.PasswordBytesMin, SecurePass.PasswordBytesMax])(
      'Should return a hash if given a password buffer of length %1.',
      async (p, done) => {
        const sp = new SecurePass();
        const password = Buffer.alloc(p, 'f');
        const hash = await sp.hashPassword(password);

        expect(hash.length).toEqual(SecurePass.HashBytes);
        expect(hash.indexOf('$argon2id')).toEqual(0);

        done();
      }
    );

    test.each([SecurePass.PasswordBytesMin - 1, SecurePass.PasswordBytesMax + 1])(
      'Should throw an error if given a password buffer of length %i.',
      async (p, done) => {
        try {
          const sp = new SecurePass();
          const password = Buffer.alloc(p, 'f');
          const hash = await sp.hashPassword(password);

          expect(false).toBeTruthy();
          done();
        } catch (e) {
          expect(e).toBeDefined();
          done();
        }
      }
    );
  });

  describe('callback hashPassword()', () => {
    test('Should return a hash if given a valid password.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
        if (err || hash == undefined) {
          expect(false).toBeTruthy();
          return;
        }

        expect(hash.length).toEqual(SecurePass.HashBytes);
        expect(hash.indexOf('$argon2id')).toEqual(0);

        done();
      });
    });

    test.each([SecurePass.PasswordBytesMin, SecurePass.PasswordBytesMax])(
      'Should return a hash if given a password buffer of length %1.',
      async (p, done) => {
        const sp = new SecurePass();
        const password = Buffer.alloc(p, 'f');
        sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
          if (err || hash == undefined) {
            expect(false).toBeTruthy();
            return;
          }

          expect(hash.length).toEqual(SecurePass.HashBytes);
          expect(hash.indexOf('$argon2id')).toEqual(0);

          done();
        });
      }
    );

    test.each([SecurePass.PasswordBytesMin - 1, SecurePass.PasswordBytesMax + 1])(
      'Should throw an error if given a password buffer of length %i.',
      async (p, done) => {
        const sp = new SecurePass();

        try {
          const password = Buffer.alloc(p, 'f');

          sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
            expect(err instanceof SecurePassError).toBeTruthy();
            expect(hash).toBeUndefined();

            done();
          });
        } catch (e) {
          expect(e).toBeDefined();
          done();
        }
      }
    );
  });

  describe('hashPasswordSync()', () => {
    test('Should return a hash if given a valid password.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = sp.hashPasswordSync(password);

      expect(hash.length).toEqual(SecurePass.HashBytes);
      expect(hash.indexOf('$argon2id')).toEqual(0);

      done();
    });

    test.each([SecurePass.PasswordBytesMin, SecurePass.PasswordBytesMax])(
      'Should return a hash if given a password buffer of length %1.',
      (p, done) => {
        const sp = new SecurePass();
        const password = Buffer.alloc(p, 'f');
        const hash = sp.hashPasswordSync(password);

        expect(hash.length).toEqual(SecurePass.HashBytes);
        expect(hash.indexOf('$argon2id')).toEqual(0);

        done();
      }
    );

    test.each([SecurePass.PasswordBytesMin - 1, SecurePass.PasswordBytesMax + 1])(
      'Should throw an error if given a password buffer of length %i.',
      (p, done) => {
        try {
          const sp = new SecurePass();
          const password = Buffer.alloc(p, 'f');
          const hash = sp.hashPasswordSync(password);

          expect(false).toBeTruthy();
          done();
        } catch (e) {
          expect(e).toBeDefined();
          done();
        }
      }
    );
  });

  describe('async/promise verifyHash()', () => {
    test('Should correctly verify a valid hashed password.', async () => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = await sp.hashPassword(password);

      const result = await sp.verifyHash(password, hash);

      expect(result).toBeDefined();
      expect(result).toEqual(VerificationResult.Valid);
    });

    test('Should correctly rehash passwords.', async () => {
      const wsp = new SecurePass({
        memLimit: SecurePass.MemLimitDefault,
        opsLimit: SecurePass.OpsLimitDefault
      });

      const userPassword = Buffer.from('SecurePass');
      const wrongPassword = Buffer.from('SecurePass2');

      const weakHash = await wsp.hashPassword(userPassword);
      const weakValid = await wsp.verifyHash(userPassword, weakHash);
      expect(weakValid).toEqual(VerificationResult.Valid);

      const weakInvalid = await wsp.verifyHash(wrongPassword, weakHash);
      expect(weakInvalid).toEqual(VerificationResult.Invalid);

      const bsp = new SecurePass({
        memLimit: SecurePass.MemLimitDefault + 1024,
        opsLimit: SecurePass.OpsLimitDefault + 1
      });

      const rehashValid = bsp.verifyHashSync(userPassword, weakHash);
      expect(rehashValid).toEqual(VerificationResult.ValidNeedsRehash);

      const betterHash = await bsp.hashPassword(userPassword);
      const betterValid = bsp.verifyHashSync(userPassword, betterHash);
      expect(betterValid).toEqual(VerificationResult.Valid);

      const betterInvalid = bsp.verifyHashSync(wrongPassword, betterHash);
      expect(betterInvalid).toEqual(VerificationResult.Invalid);
    });

    test('Should return an error if given a blank password buffer.', async () => {
      const sp = new SecurePass();

      try {
        const password = Buffer.from('');
        const hash = Buffer.alloc(SecurePass.HashBytes);
        const result = await sp.verifyHash(password, hash);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e instanceof SecurePassError).toBeTruthy();
      }
    });

    test('Should return an error if given a blank hash buffer.', async () => {
      const sp = new SecurePass();

      try {
        const password = Buffer.from('SecurePass');
        const hash = Buffer.from('');
        const result = await sp.verifyHash(password, hash);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e instanceof SecurePassError).toBeTruthy();
      }
    });
  });

  describe('callback verifyHash()', () => {
    test('Should correctly verify a valid hashed password.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
        if (hash == undefined) {
          expect(hash).toBeDefined();
          return;
        }

        const passwordHash = hash;
        sp.verifyHash(password, passwordHash, (verifyError: SecurePassError | null, result?: VerificationResult) => {
          expect(verifyError).toBeNull();
          expect(result).toEqual(VerificationResult.Valid);

          done();
        });
      });
    });

    test('Should correctly rehash passwords.', done => {
      const wsp = new SecurePass({
        memLimit: SecurePass.MemLimitDefault,
        opsLimit: SecurePass.OpsLimitDefault
      });

      const bsp = new SecurePass({
        memLimit: SecurePass.MemLimitDefault + 1024,
        opsLimit: SecurePass.OpsLimitDefault + 1
      });

      const userPassword = Buffer.from('SecurePass');
      const wrongPassword = Buffer.from('SecurePass2');

      wsp.hashPassword(userPassword, (err1: SecurePassError | null, weakHash?: Buffer) => {
        if (weakHash == undefined) {
          expect(weakHash).toBeDefined();
          return;
        }

        expect(err1).toBeNull();

        wsp.verifyHash(userPassword, weakHash, (err2: SecurePassError | null, weakValid?: VerificationResult) => {
          if (weakValid == undefined) {
            expect(weakValid).toBeDefined();
            return;
          }

          expect(err2).toBeNull();
          expect(weakValid).toEqual(VerificationResult.Valid);

          wsp.verifyHash(wrongPassword, weakHash, (err3: SecurePassError | null, weakInvalid?: VerificationResult) => {
            if (weakInvalid == undefined) {
              expect(weakInvalid).toBeDefined();
              return;
            }

            expect(err3).toBeNull();
            expect(weakInvalid).toEqual(VerificationResult.Invalid);

            bsp.verifyHash(userPassword, weakHash, (err4: SecurePassError | null, rehashValid?: VerificationResult) => {
              if (rehashValid == undefined) {
                expect(rehashValid).toBeDefined();
                return;
              }

              expect(err4).toBeNull();
              expect(rehashValid).toEqual(VerificationResult.ValidNeedsRehash);

              bsp.hashPassword(userPassword, (err5: SecurePassError | null, betterHash?: Buffer) => {
                if (betterHash == undefined) {
                  expect(betterHash).toBeDefined();
                  return;
                }

                expect(err5).toBeNull();

                bsp.verifyHash(
                  userPassword,
                  betterHash,
                  (err6: SecurePassError | null, betterValid?: VerificationResult) => {
                    if (betterValid == undefined) {
                      expect(betterHash).toBeDefined();
                      return;
                    }

                    expect(err6).toBeNull();
                    expect(betterValid).toEqual(VerificationResult.Valid);

                    bsp.verifyHash(
                      wrongPassword,
                      betterHash,
                      (err7: SecurePassError | null, betterInvalid?: VerificationResult) => {
                        if (betterInvalid == undefined) {
                          expect(betterInvalid).toBeDefined();
                          return;
                        }

                        expect(err7).toBeNull();
                        expect(betterInvalid).toEqual(VerificationResult.Invalid);
                        done();
                      }
                    );
                  }
                );
              });
            });
          });
        });
      });
    });

    test('Should return an error if given a blank password buffer.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('');
      const hash = Buffer.alloc(SecurePass.HashBytes);
      sp.verifyHash(password, hash, (err: SecurePassError | null, result?: VerificationResult) => {
        expect(err).toBeDefined();
        expect(err instanceof SecurePassError).toBeTruthy();

        done();
      });
    });

    test('Should return an error if given a blank hash buffer.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = Buffer.from('');
      sp.verifyHash(password, hash, (err: SecurePassError | null, result?: VerificationResult) => {
        expect(err).toBeDefined();
        expect(err instanceof SecurePassError).toBeTruthy();

        done();
      });
    });
  });

  describe('verifyHashSync()', () => {
    test('Should correctly verify a valid hashed password.', () => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = sp.hashPasswordSync(password);

      const result = sp.verifyHashSync(password, hash);

      expect(result).toBeDefined();
      expect(result).toEqual(VerificationResult.Valid);
    });

    test('Should correctly rehash passwords.', () => {
      const wsp = new SecurePass({
        memLimit: SecurePass.MemLimitDefault,
        opsLimit: SecurePass.OpsLimitDefault
      });

      const userPassword = Buffer.from('SecurePass');
      const wrongPassword = Buffer.from('SecurePass2');

      const weakHash = wsp.hashPasswordSync(userPassword);
      const weakValid = wsp.verifyHashSync(userPassword, weakHash);
      expect(weakValid).toEqual(VerificationResult.Valid);

      const weakInvalid = wsp.verifyHashSync(wrongPassword, weakHash);
      expect(weakInvalid).toEqual(VerificationResult.Invalid);

      const bsp = new SecurePass({
        memLimit: SecurePass.MemLimitDefault + 1024,
        opsLimit: SecurePass.OpsLimitDefault + 1
      });

      const rehashValid = bsp.verifyHashSync(userPassword, weakHash);
      expect(rehashValid).toEqual(VerificationResult.ValidNeedsRehash);

      const betterHash = bsp.hashPasswordSync(userPassword);
      const betterValid = bsp.verifyHashSync(userPassword, betterHash);
      expect(betterValid).toEqual(VerificationResult.Valid);

      const betterInvalid = bsp.verifyHashSync(wrongPassword, betterHash);
      expect(betterInvalid).toEqual(VerificationResult.Invalid);
    });

    test('Should return an error if given a blank password buffer.', () => {
      const sp = new SecurePass();

      try {
        const password = Buffer.from('');
        const hash = Buffer.alloc(SecurePass.HashBytes);
        const result = sp.verifyHashSync(password, hash);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e instanceof SecurePassError).toBeTruthy();
      }
    });

    test('Should return an error if given a blank hash buffer.', () => {
      const sp = new SecurePass();

      try {
        const password = Buffer.from('SecurePass');
        const hash = Buffer.from('');
        const result = sp.verifyHashSync(password, hash);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e instanceof SecurePassError).toBeTruthy();
      }
    });

    test('Should return InvalidOrUnrecognized if given an invalid hash buffer.', () => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = Buffer.alloc(SecurePass.HashBytes, 0);

      const result = sp.verifyHashSync(password, hash);

      expect(result).toEqual(VerificationResult.InvalidOrUnrecognized);
    });
  });
});
