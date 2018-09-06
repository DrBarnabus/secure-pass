import sodium from 'sodium-native';
import { GenerateOneTimeAuthResult, SecurePass, VerificationResult } from '../';
import { SecurePassError, SecurePassOptionsError } from '../error';

describe('SecurePass - Constants', () => {
  test('PasswordBytes* Constants should be defined.', () => {
    expect(SecurePass.PasswordBytesMax).toBeDefined();
    expect(SecurePass.PasswordBytesMin).toBeDefined();
  });

  test('HashBytes Constant should be defined.', () => {
    expect(SecurePass.HashBytes).toBeDefined();
  });

  test('SaltBytes Constant should be defined', () => {
    expect(SecurePass.SaltBytes).toBeDefined();
  });

  test('MemLimit* Constants should be defined.', () => {
    expect(SecurePass.MemLimitDefault).toBeDefined();
    expect(SecurePass.MemLimitInteractive).toBeDefined();
    expect(SecurePass.MemLimitModerate).toBeDefined();
    expect(SecurePass.MemLimitSensitive).toBeDefined();
    expect(SecurePass.MemLimitMinimum).toBeDefined();
    expect(SecurePass.MemLimitMaximum).toBeDefined();
  });

  test('OpsLimit* Constants should be defined.', () => {
    expect(SecurePass.OpsLimitDefault).toBeDefined();
    expect(SecurePass.OpsLimitInteractive).toBeDefined();
    expect(SecurePass.OpsLimitModerate).toBeDefined();
    expect(SecurePass.OpsLimitSensitive).toBeDefined();
    expect(SecurePass.OpsLimitMinimum).toBeDefined();
    expect(SecurePass.OpsLimitMaximum).toBeDefined();
  });

  test('VerificationResult.* Enum Constants should be defined.', () => {
    expect(VerificationResult.InvalidOrUnrecognized).toEqual(0);
    expect(VerificationResult.Invalid).toEqual(1);
    expect(VerificationResult.Valid).toEqual(2);
    expect(VerificationResult.ValidNeedsRehash).toEqual(3);
  });
});

describe('SecurePass - Options', () => {
  test('Passing no configuration should create a new instance with the default options.', () => {
    const sp = new SecurePass();
    expect(sp.getMemLimit()).toEqual(sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);
    expect(sp.getOpsLimit()).toEqual(sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE);
  });

  test('Passing in an empty object should create a new instance with the default options.', () => {
    const sp = new SecurePass({});
    expect(sp.getMemLimit()).toEqual(sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);
    expect(sp.getOpsLimit()).toEqual(sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE);
  });

  test('A valid value for memLimit should be set correctly. And opsLimit should be set to the default value.', () => {
    const sp = new SecurePass({
      memLimit: 16384
    });
    expect(sp.getMemLimit()).toEqual(16384);
    expect(sp.getOpsLimit()).toEqual(sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE);
  });

  test('A valid value for opsLimit should be set correctly. And memLimit should be set to the default value.', () => {
    const sp = new SecurePass({
      opsLimit: 12
    });
    expect(sp.getMemLimit()).toEqual(sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);
    expect(sp.getOpsLimit()).toEqual(12);
  });

  test('A lower bounds value for memLimit should still be considered valid.', () => {
    const sp = new SecurePass({
      memLimit: SecurePass.MemLimitMinimum
    });
    expect(sp.getMemLimit()).toEqual(SecurePass.MemLimitMinimum);
  });

  test('An upper bounds value for memLimit should still be considered valid.', () => {
    const sp = new SecurePass({
      memLimit: SecurePass.MemLimitMaximum
    });
    expect(sp.getMemLimit()).toEqual(SecurePass.MemLimitMaximum);
  });

  test('A lower bounds value for opsLimit should still be considered valid.', () => {
    const sp = new SecurePass({
      opsLimit: SecurePass.OpsLimitMinimum
    });
    expect(sp.getOpsLimit()).toEqual(SecurePass.OpsLimitMinimum);
  });

  test('An upper bounds value for opsLimit should still be considered valid.', () => {
    const sp = new SecurePass({
      opsLimit: SecurePass.OpsLimitMaximum
    });
    expect(sp.getOpsLimit()).toEqual(SecurePass.OpsLimitMaximum);
  });

  test('An invalid value for memLimit should throw an error.', () => {
    try {
      const sp = new SecurePass({
        memLimit: 1
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e instanceof SecurePassOptionsError).toBeTruthy();
    }
  });

  test('An invalid value for opsLimit should throw an error.', () => {
    try {
      const sp = new SecurePass({
        opsLimit: SecurePass.OpsLimitMaximum + 1
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e instanceof SecurePassOptionsError).toBeTruthy();
    }
  });
});

describe('SecurePass - Static Functions', () => {
  describe('generateOneTimeAuth()', () => {
    test('Should return a mac, key and the original message.', () => {
      const message = Buffer.from('ExampleMessage');
      const result = SecurePass.generateOneTimeAuth(message);
      expect(result.mac).toBeDefined();
      expect(result.mac.length).toEqual(sodium.crypto_onetimeauth_BYTES);
      expect(result.message).toBeDefined();
      expect(result.message.compare(message)).toEqual(0);
      expect(result.key).toBeDefined();
      expect(result.key.length).toEqual(sodium.crypto_onetimeauth_KEYBYTES);
    });
  });

  describe('verifyOneTimeAuth()', () => {
    test('Should return true if the message, mac and key match.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const result = SecurePass.verifyOneTimeAuth(ota.mac, message, ota.key);
      expect(result).toBeDefined();
      expect(result).toBeTruthy();
    });

    test('Should return false if the message does not match the mac and key.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const badMessage = Buffer.from('ExampleBad');
      const result = SecurePass.verifyOneTimeAuth(ota.mac, badMessage, ota.key);
      expect(result).toBeDefined();
      expect(result).toBeFalsy();
    });

    test('Should return false if the mac does not match the message and key.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const badMac = Buffer.alloc(sodium.crypto_onetimeauth_BYTES);
      const result = SecurePass.verifyOneTimeAuth(badMac, message, ota.key);
      expect(result).toBeDefined();
      expect(result).toBeFalsy();
    });

    test('Should return false if the key does not match the message and mac.', () => {
      const message = Buffer.from('ExampleMessage');
      const ota = SecurePass.generateOneTimeAuth(message);

      const badKey = Buffer.alloc(sodium.crypto_onetimeauth_KEYBYTES);
      const result = SecurePass.verifyOneTimeAuth(ota.mac, message, badKey);
      expect(result).toBeDefined();
      expect(result).toBeFalsy();
    });
  });
});

describe('SecurePass - Functions', () => {
  describe('async/promise hashPassword()', () => {
    test('Should return a string if given a valid password buffer.', async () => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      const hash = await sp.hashPassword(password);

      expect(hash.length).toEqual(SecurePass.HashBytes);
      expect(hash.toString().length > 0).toBeTruthy();
      expect(hash.indexOf('$argon2id')).toEqual(0);
    });

    test('Should return an error if given a blank password buffer.', async () => {
      const sp = new SecurePass();

      try {
        const password = Buffer.from('');
        const hash = await sp.hashPassword(password);
      } catch (e) {
        expect(e).toBeDefined();
        expect(e instanceof SecurePassError).toBeTruthy();
      }
    });
  });

  describe('callback hashPassword()', () => {
    test('Should return a string if given a valid password buffer.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
        expect(err).toBeNull();
        expect(hash).toBeDefined();

        done();
      });
    });

    test('Should return an error if given a blank password buffer.', done => {
      const sp = new SecurePass();

      const password = Buffer.from('');
      sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
        expect(err).toBeDefined();
        expect(err instanceof SecurePassError).toBeTruthy();
        expect(hash).toBeUndefined();

        done();
      });
    });
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

      const rehashValid = await bsp.verifyHash(userPassword, weakHash);
      expect(rehashValid).toEqual(VerificationResult.ValidNeedsRehash);

      const betterHash = await bsp.hashPassword(userPassword);
      const betterValid = await bsp.verifyHash(userPassword, betterHash);
      expect(betterValid).toEqual(VerificationResult.Valid);

      const betterInvalid = await bsp.verifyHash(wrongPassword, betterHash);
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
});
