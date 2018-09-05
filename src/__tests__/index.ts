import sodium from 'sodium-native';
import { SecurePass, SecurePassError, SecurePassOptionsError } from '../';

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
    test('Should return a string if given a valid password buffer.', () => {
      const sp = new SecurePass();

      const password = Buffer.from('SecurePass');
      sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
        expect(err).toBeNull();
        expect(hash).toBeDefined();
      });
    });

    test('Should return an error if given a blank password buffer.', () => {
      const sp = new SecurePass();

      const password = Buffer.from('');
      sp.hashPassword(password, (err: SecurePassError | null, hash?: Buffer) => {
        expect(err).toBeDefined();
        expect(err instanceof SecurePassError).toBeTruthy();
        expect(hash).toBeUndefined();
      });
    });
  });
});
