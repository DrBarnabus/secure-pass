/**
 * This error is thrown if the supplied options are invalid during creation of an instance of SecurePass.
 */
export class SecurePassOptionsError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, SecurePassOptionsError.prototype);
  }
}
