import sodium from 'sodium-native';
import { SecurePassError, SecurePassOptionsError } from './error';

export { SecurePassError, SecurePassOptionsError };

export interface SecurePassOptions {
  /**
   * Configures the memory limit of Argon2ID.
   */
  memLimit?: number;

  /**
   * Configures the operation limit of Argon2ID.
   */
  opsLimit?: number;
}

export type HashPasswordCallback = (err: SecurePassError | null, hash?: Buffer) => void;

export class SecurePass {
  /**
   * Minimum Length for the Password input buffer.
   * @readonly
   */
  public static readonly PasswordBytesMin: number = sodium.crypto_pwhash_PASSWD_MIN;

  /**
   * Maxium Length for the Password input buffer.
   * @readonly
   */
  public static readonly PasswordBytesMax: number = sodium.crypto_pwhash_PASSWD_MAX;

  /**
   * Length of the Password Hash output buffer.
   * @readonly
   */
  public static readonly HashBytes: number = sodium.crypto_pwhash_STRBYTES;

  /**
   * Length of the Salt buffer.
   * @readonly
   */
  public static readonly SaltBytes: number = sodium.crypto_pwhash_SALTBYTES;

  /**
   * Default Memory Limit. 64MB.
   * @readonly
   */
  public static readonly MemLimitDefault: number = sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;

  /**
   * Interactive Memory Limit. 64MB. For a use case, please see the SecurePass documentation.
   * @readonly
   */
  public static readonly MemLimitInteractive: number = sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;

  /**
   * Moderate Memory Limit. 256MB. For a use case, please see the SecurePass documentation.
   * @readonly
   */
  public static readonly MemLimitModerate: number = sodium.crypto_pwhash_MEMLIMIT_MODERATE;

  /**
   * Sensitive Memory Limit. 1GB. For a use case, please see the SecurePass documentation.
   */
  public static readonly MemLimitSensitive: number = sodium.crypto_pwhash_MEMLIMIT_SENSITIVE;

  /**
   * Minimum Memory Limit. 8KB.
   * @readonly
   */
  public static readonly MemLimitMinimum: number = sodium.crypto_pwhash_MEMLIMIT_MIN;

  /**
   * Maximum Memory Limit. 4TB.
   * @readonly
   */
  public static readonly MemLimitMaximum: number = sodium.crypto_pwhash_MEMLIMIT_MAX;

  /**
   * Default Operations Limit. 2 Operations.
   * @readonly
   */
  public static readonly OpsLimitDefault: number = sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;

  /**
   * Interactive Operations Limit. 2 Operations. For a use case, please see the SecurePass documentation.
   * @readonly
   */
  public static readonly OpsLimitInteractive: number = sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;

  /**
   * Moderate Operations Limit. 3 Operations. For a use case, please see the SecurePass documentation.
   * @readonly
   */
  public static readonly OpsLimitModerate: number = sodium.crypto_pwhash_OPSLIMIT_MODERATE;

  /**
   * Sensitive Operations Limit. 4 Operations. For a use case, please see the SecurePass documentation.
   */
  public static readonly OpsLimitSensitive: number = sodium.crypto_pwhash_OPSLIMIT_SENSITIVE;

  /**
   * Minimum Operations Limit. 1 Operation.
   * @readonly
   */
  public static readonly OpsLimitMinimum: number = sodium.crypto_pwhash_OPSLIMIT_MIN;

  /**
   * Maximum Operations Limit. 4294967295 Operations.
   * @readonly
   */
  public static readonly OpsLimitMaximum: number = sodium.crypto_pwhash_OPSLIMIT_MAX;

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
        // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:max-line-length
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
  public getMemLimit(): number {
    return this.memLimit;
  }

  /**
   * Returns the currently configured Operations Limit.
   */
  public getOpsLimit(): number {
    return this.opsLimit;
  }

  public hashPassword(password: Buffer): Promise<Buffer>;
  public hashPassword(password: Buffer, callback: HashPasswordCallback): void;
  public hashPassword(password: Buffer, callback?: HashPasswordCallback): Promise<Buffer> | void {
    if (callback) {
      this.hashPasswordAsync(password).then(r => callback(null, r), e => callback(e));
    } else {
      return this.hashPasswordAsync(password);
    }
  }

  private async hashPasswordAsync(password: Buffer): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      if (!(password.length > SecurePass.PasswordBytesMin && password.length < SecurePass.PasswordBytesMax)) {
        reject(
          new SecurePassError(
            `Length of Password Buffer must be between ${SecurePass.PasswordBytesMin} and ${
              SecurePass.PasswordBytesMax
            }`
          )
        );
      } else {
        const hash = Buffer.allocUnsafe(SecurePass.HashBytes);
        sodium.crypto_pwhash_str_async(hash, password, this.opsLimit, this.memLimit, (err: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  }
}

export default SecurePass;
