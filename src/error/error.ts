/**
 * Standard SecurePass module error, returned if anything goes wrong when using the module.
 */
export class SecurePassError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, SecurePassError.prototype);
  }
}
