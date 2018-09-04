import sodium from 'sodium-native';

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
   * Default Operations Limit. 2
   * @readonly
   */
  public static readonly OpsLimitDefault: number = sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;

  /**
   * Minimum Operations Limit. 1
   * @readonly
   */
  public static readonly OpsLimitMinimum: number = sodium.crypto_pwhash_OPSLIMIT_MIN;

  /**
   * Maximum Operations Limit. 4294967295
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
        throw new Error(
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
        throw new Error(
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
}

export default SecurePass;
