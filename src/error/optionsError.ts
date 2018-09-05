export class SecurePassOptionsError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, SecurePassOptionsError.prototype);
  }
}
