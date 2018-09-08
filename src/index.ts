/**
 * @module SecurePass
 */

import sodium from 'sodium-native';
import { bufferFromSafeBase64, bufferToSafeBase64 } from './base64';
import { SecurePassError, SecurePassOptionsError } from './error';

export { SecurePassError, SecurePassOptionsError } from './error';
export { bufferFromSafeBase64, bufferToSafeBase64 } from './base64';

/** A set of configuration options used to configure a new instance of SecurePass */
export interface SecurePassOptions {
  /**
   * Configures the memory limit of Argon2ID. This value is in bytes.
   * The default value is 64MB.
   */
  memLimit?: number;

  /**
   * Configures the operation limit of Argon2ID.
   * The default value is 2.
   */
  opsLimit?: number;
}

/** The callback function signature when hashPassword is used with a callback. */
export type HashPasswordCallback = (err: SecurePassError | null, hash?: Buffer) => void;

/** The callback function signature when verifyHash is used with a callback. */
export type VerifyHashCallback = (err: SecurePassError | null, result?: VerificationResult) => void;

export enum VerificationResult {
  /** Returned if the hash is in an invalid format or wasn't created by SecurePass. */
  InvalidOrUnrecognized,
  /** Returned if the hash doesn't match the supplied plaintext password. */
  Invalid,
  /** Returned if the hash is valid and matches the supplied plaintext password. */
  Valid,
  /** Returned if the hash is valid, but could be improved with the currently set difficulty options. */
  ValidNeedsRehash
}

/** Used to return a One Time Authentication mac and key as well as the message it was derrived from. */
export interface GenerateOneTimeAuthResult {
  /** One Time Authentication mac. */
  mac: Buffer;
  /** One Time Authentication message. */
  message: Buffer;
  /** One Time Authentication randomly generated key. This value should be kept secret. */
  key: Buffer;
}

/** Used to return a One Time Authentication Code and randomly generated key. */
export interface GenerateOneTimeAuthCodeResult {
  /** One Time Authentication mac and message stored as a specifically formatted base64 string. */
  code: string;
  /** One Time Authentication randomly generated key. This value should be kept secret. */
  key: Buffer;
}

export class SecurePass {
  /**
   * Minimum Length for the Password input buffer.
   * @readonly
   */
  public static readonly PasswordBytesMin: number = 1;

  /**
   * Maxium Length for the Password input buffer.
   * @readonly
   */
  public static readonly PasswordBytesMax: number = 4294967295;

  /**
   * Length of the Password Hash output buffer.
   * @readonly
   */
  public static readonly HashBytes: number = 128;

  /**
   * Length of the Salt buffer.
   * @readonly
   */
  public static readonly SaltBytes: number = 16;

  /**
   * Length of the Mac buffer returned by generateOneTimeAuth.
   * @readonly
   */
  public static readonly MacBytes: number = 16;

  /**
   * Length of the secret Key buffer returned by generateOneTimeAuth and generateOneTimeAuthCode.
   * @readonly
   */
  public static readonly KeyBytes: number = 32;

  /**
   * Default Memory Limit. 64MB.
   * @readonly
   */
  public static readonly MemLimitDefault: number = 67108864;

  /**
   * Interactive Memory Limit. 64MB. This value is the same as MemLimitDefault.
   * This memory limit is recommended for interactive "online" applications, when combined with OpsLimitInteractive,
   * this option requires 64 MiB of dedicated RAM and provides a baseline configuration for web app security.
   * Choosing a higher value such as MemLimitModerate, MemLimitSensitive or a custom value may improve security.
   * @readonly
   */
  public static readonly MemLimitInteractive: number = 67108864;

  /**
   * Moderate Memory Limit. 256MB.
   * This memory limit, combined with OpsLimitModerate provides a good performance and security baseline for
   * applications that require higher security than the default/interactive preset.
   * Use of this option requires a minimum of 256 MiB of dedicated RAM.
   * @readonly
   */
  public static readonly MemLimitModerate: number = 268435456;

  /**
   * Sensitive Memory Limit. 1GB.
   * This memory limit, combined with OpsLimitSensitive, is recommended for highly sensitive data
   * and non-interactive operations.
   * Use of this option requires a minimum of 1024 MiB of dedicated RAM.
   */
  public static readonly MemLimitSensitive: number = 1073741824;

  /**
   * The Minimum Allowed Memory Limit. 8KB.
   * @readonly
   */
  public static readonly MemLimitMinimum: number = 8192;

  /**
   * The Maximum Allowed Memory Limit. 4TB.
   * @readonly
   */
  public static readonly MemLimitMaximum: number = 4398046510080;

  /**
   * Default Operations Limit. 2 Operations.
   * @readonly
   */
  public static readonly OpsLimitDefault: number = 2;

  /**
   * Interactive Operations Limit. 2 Operations.This value is the same as OpsLimitDefault.
   * This operations limit is recommended for interactive "online" applications, when combined with MemLimitInteractive,
   * this option provides a baseline configuration for web app security.
   * Choosing a higher value such as MemLimitModerate, MemLimitSensitive or a custom value may improve security.
   * @readonly
   */
  public static readonly OpsLimitInteractive: number = 2;

  /**
   * Moderate Operations Limit. 3 Operations.
   * This operations limit, combined with MemLimitModerate provides a good performance and security baseline for
   * applications that require higher security than the default/interactive preset.
   * Using this options takes around 0.7 seconds to derrive a hash on a 2.8Ghz Core i7 CPU.
   * @readonly
   */
  public static readonly OpsLimitModerate: number = 3;

  /**
   * Sensitive Operations Limit. 4 Operations.
   * This memory limit, combined with OpsLimitSensitive, is recommended for highly sensitive data
   * and non-interactive operations.
   * Using this option it takes around 3.5 seconds to derrive a hash on a 2.8Ghz Core i7 CPU.
   */
  public static readonly OpsLimitSensitive: number = 4;

  /**
   * The Minimum Allowed Operations Limit. 1 Operation.
   * @readonly
   */
  public static readonly OpsLimitMinimum: number = 1;

  /**
   * The Maximum Allowed Operations Limit. 4294967295 Operations.
   * @readonly
   */
  public static readonly OpsLimitMaximum: number = 4294967295;

  /**
   * Generates a random key, and then uses that key and the supplied message,
   * to generate a one time authentication mac.
   * @param message - The message to be used as the base of the one time authentication key.
   */
  public static generateOneTimeAuth(message: Buffer): GenerateOneTimeAuthResult {
    const mac = Buffer.alloc(SecurePass.MacBytes);

    const key = Buffer.alloc(SecurePass.KeyBytes);
    sodium.randombytes_buf(key);

    sodium.crypto_onetimeauth(mac, message, key);

    return { mac, message, key };
  }

  /**
   * Verifys the authenticity of the mac using the supplied message and,
   * the key returned when generating the mac.
   * @param mac - The authentication mac generated by generateOneTimeAuth.
   * @param message - The original message used to generate the mac.
   * @param key - The authentication key generated by generateOneTimeAuth.
   */
  public static verifyOneTimeAuth(mac: Buffer, message: Buffer, key: Buffer): boolean {
    return sodium.crypto_onetimeauth_verify(mac, message, key);
  }

  /**
   * Generates a random key, and then uses that key and the supplied message,
   * to generate a one time authentication code.
   * @param message - The message to be used as the base of the one time authentication code.
   */
  public static generateOneTimeAuthCode(message: Buffer): GenerateOneTimeAuthCodeResult {
    const ota = SecurePass.generateOneTimeAuth(message);

    return { code: bufferToSafeBase64(ota.message) + '~' + bufferToSafeBase64(ota.mac), key: ota.key };
  }

  /**
   * Verifys the authenticity of the supplied authentication code using the key returned when generating the code.
   * @param code - The one time authentication code generated by generateOneTimeAuthCode.
   * @param key - The authentication key generated by generateOneTimeAuthCode.
   */
  public static verifyOneTimeAuthCode(code: string, key: Buffer): boolean {
    const message = bufferFromSafeBase64(code.substr(0, code.indexOf('~')));

    const mac = bufferFromSafeBase64(code.substr(code.indexOf('~') + 1, code.length));

    return sodium.crypto_onetimeauth_verify(mac, message, key);
  }

  /**
   * Configured memory limit for Argon2ID.
   */
  private memLimit: number;

  /**
   * Configured operations limit for Argon2ID.
   */
  private opsLimit: number;

  /**
   * Create a new instance of SecurePass to hash passwords, verify passwords,
   * generate one time reset tokens and verify one time reset tokens.
   * @param options - SecurePassOptions to configure work settings of Argon2ID.
   * @param options.memLimit - Configures the memory limit of Argon2ID.
   * @param options.opsLimit - Configures the operations limit of Argon2ID.
   */
  constructor(options?: SecurePassOptions) {
    // If options is undefined, default to an empty object.
    options = options || {};

    // Configure Memory Limit
    if (options.memLimit == undefined) {
      this.memLimit = SecurePass.MemLimitDefault;
    } else {
      // Check configured Memory Limit is within allowed values.
      if (options.memLimit >= SecurePass.MemLimitMinimum && options.memLimit <= SecurePass.MemLimitMaximum) {
        this.memLimit = options.memLimit;
      } else {
        throw new SecurePassOptionsError(
          `SecurePass: Invalid Memory Limit Configured. Value must be between ${SecurePass.MemLimitMinimum} and ${
            SecurePass.MemLimitMaximum
          }`
        );
      }
    }

    // Configure Operations Limit.
    if (options.opsLimit == undefined) {
      this.opsLimit = SecurePass.OpsLimitDefault;
    } else {
      // Check configured Operations Limit is within allowed values.
      if (options.opsLimit >= SecurePass.OpsLimitMinimum && options.opsLimit <= SecurePass.OpsLimitMaximum) {
        this.opsLimit = options.opsLimit;
      } else {
        throw new SecurePassOptionsError(
          `Secure Pass: Invalid Operations Limit Configured. Value must be between ${SecurePass.OpsLimitMinimum} and ${
            SecurePass.OpsLimitMaximum
          }`
        );
      }
    }
  }

  /**
   * Returns the currently configured Memory Limit.
   */
  public get MemLimit(): number {
    return this.memLimit;
  }

  /**
   * Sets the Memory Limit to the new value provided.
   * @param newValue - The new Memory Limit.
   */
  public set MemLimit(newValue: number) {
    // Check configured Memory Limit is within allowed values.
    if (newValue >= SecurePass.MemLimitMinimum && newValue <= SecurePass.MemLimitMaximum) {
      this.memLimit = newValue;
    } else {
      throw new SecurePassOptionsError(
        `SecurePass: Invalid Memory Limit Configured. Value must be between ${SecurePass.MemLimitMinimum} and ${
          SecurePass.MemLimitMaximum
        }`
      );
    }
  }

  /**
   * Returns the currently configured Operations Limit.
   */
  public get OpsLimit(): number {
    return this.opsLimit;
  }

  /**
   * Sets the Operations Limit to the new value provided.
   */
  public set OpsLimit(newValue: number) {
    // Check configured Operations Limit is within allowed values.
    if (newValue >= SecurePass.OpsLimitMinimum && newValue <= SecurePass.OpsLimitMaximum) {
      this.opsLimit = newValue;
    } else {
      throw new SecurePassOptionsError(
        `Secure Pass: Invalid Operations Limit Configured. Value must be between ${SecurePass.OpsLimitMinimum} and ${
          SecurePass.OpsLimitMaximum
        }`
      );
    }
  }

  /**
   * Takes the provided password and returns the derived Argon2ID hash.
   * @param password - The password to be hashed.
   * @param callback - Optional callback function.
   */
  public hashPassword(password: Buffer): Promise<Buffer>;
  public hashPassword(password: Buffer, callback: HashPasswordCallback): void;
  public hashPassword(password: Buffer, callback?: HashPasswordCallback): Promise<Buffer> | void {
    if (callback) {
      this.hashPasswordAsync(password).then(r => callback(null, r), e => callback(e));
    } else {
      return this.hashPasswordAsync(password);
    }
  }

  /**
   * Takes the provided password and returns the derived Argon2ID hash.
   * @param password - The password to be hashed.
   */
  public hashPasswordSync(password: Buffer): Buffer {
    if (!(password.length >= SecurePass.PasswordBytesMin && password.length < SecurePass.PasswordBytesMax)) {
      throw new SecurePassError(
        `Length of Password Buffer must be between ${SecurePass.PasswordBytesMin} and ${SecurePass.PasswordBytesMax}`
      );
    }

    const hash = Buffer.allocUnsafe(SecurePass.HashBytes);
    sodium.crypto_pwhash_str(hash, password, this.opsLimit, this.memLimit);

    return hash;
  }

  /**
   * Takes the provided password and the hash buffer
   * and returns the result of the verification as an enumeration value.
   * @param password - The password to be verified.
   * @param hash - The hash to be verified against.
   */
  public verifyHash(password: Buffer, hash: Buffer): Promise<VerificationResult>;
  public verifyHash(password: Buffer, hash: Buffer, callback: VerifyHashCallback): void;
  public verifyHash(password: Buffer, hash: Buffer, callback?: VerifyHashCallback): Promise<VerificationResult> | void {
    if (callback) {
      this.verifyHashAsync(password, hash).then(r => callback(null, r), e => callback(e));
    } else {
      return this.verifyHashAsync(password, hash);
    }
  }

  /**
   * Takes the provided password and the hash buffer
   * and returns the result of the verification as an enumeration value.
   * @param password - The password to be verified.
   * @param hash - The hash to be verified against.
   */
  public verifyHashSync(password: Buffer, hash: Buffer): VerificationResult {
    if (!(password.length >= SecurePass.PasswordBytesMin && password.length < SecurePass.PasswordBytesMax)) {
      throw new SecurePassError(
        `Length of Password Buffer must be between ${SecurePass.PasswordBytesMin} and ${SecurePass.PasswordBytesMax}`
      );
    }

    if (hash.length != SecurePass.HashBytes) {
      throw new SecurePassError(`Length of Hash Buffer must be between ${SecurePass.HashBytes}`);
    }

    if (!this.recognizedAlgorithm(hash)) {
      return VerificationResult.InvalidOrUnrecognized;
    }

    if (sodium.crypto_pwhash_str_verify(hash, password) == false) {
      return VerificationResult.Invalid;
    }

    if (sodium.crypto_pwhash_str_needs_rehash(hash, this.opsLimit, this.memLimit)) {
      return VerificationResult.ValidNeedsRehash;
    }

    return VerificationResult.Valid;
  }

  private async hashPasswordAsync(password: Buffer): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      if (!(password.length >= SecurePass.PasswordBytesMin && password.length < SecurePass.PasswordBytesMax)) {
        reject(
          new SecurePassError(
            `Length of Password Buffer must be between ${SecurePass.PasswordBytesMin} and ${
              SecurePass.PasswordBytesMax
            }`
          )
        );
      }

      const hash = Buffer.allocUnsafe(SecurePass.HashBytes);
      sodium.crypto_pwhash_str_async(hash, password, this.opsLimit, this.memLimit, (err: Error) => {
        /* istanbul ignore if */
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  private async verifyHashAsync(password: Buffer, hash: Buffer): Promise<VerificationResult> {
    return new Promise<VerificationResult>((resolve, reject) => {
      if (!(password.length >= SecurePass.PasswordBytesMin && password.length < SecurePass.PasswordBytesMax)) {
        reject(
          new SecurePassError(
            `Length of Password Buffer must be between ${SecurePass.PasswordBytesMin} and ${
              SecurePass.PasswordBytesMax
            }`
          )
        );
      }

      if (hash.length != SecurePass.HashBytes) {
        reject(new SecurePassError(`Length of Hash Buffer must be between ${SecurePass.HashBytes}`));
      }

      if (!this.recognizedAlgorithm(hash)) {
        resolve(VerificationResult.InvalidOrUnrecognized);
      }

      sodium.crypto_pwhash_str_verify_async(hash, password, (err: Error, result: boolean) => {
        /* istanbul ignore if */
        if (err) {
          reject(err);
        }

        if (!result) {
          resolve(VerificationResult.Invalid);
        }

        if (sodium.crypto_pwhash_str_needs_rehash(hash, this.opsLimit, this.memLimit)) {
          resolve(VerificationResult.ValidNeedsRehash);
        }

        resolve(VerificationResult.Valid);
      });
    });
  }

  private recognizedAlgorithm(hash: Buffer): boolean {
    return hash.indexOf('$argon2i$') > -1 || hash.indexOf('$argon2id$') > -1;
  }
}

export default SecurePass;
