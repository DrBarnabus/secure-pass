import sodium from 'sodium-native';
import { SecurePass } from '../';

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
    }
  });

  test('An invalid value for opsLimit should throw an error.', () => {
    try {
      const sp = new SecurePass({
        opsLimit: SecurePass.OpsLimitMaximum + 1
      });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
