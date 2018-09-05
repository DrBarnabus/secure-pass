export class SecurePassError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, SecurePassError.prototype);
  }
}
