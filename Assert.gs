class Assert {
  static _throwError(condition, defaultMessage, message) {
    if (condition) {
      throw new Error(defaultMessage + (message ? ` - ${message}` : ""));
    }
  }

  static equal(actual, expected, message = "") {
    this._throwError(
      actual != expected,
      `Assertion failed: expected ${expected}, but got ${actual}`,
      message
    );
  }

  static isTrue(value, message = "") {
    this._throwError(
      !value,
      `Assertion failed: expected true, but got ${value}`,
      message
    );
  }

  static notNull(value, message = "") {
    this._throwError(
      value === null || value === undefined,
      `Assertion failed: expected not null or undefined, but got ${value}`,
      message
    );
  }
}
