class NotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotImplementedError';
    this.methodName = this.getCallerMethodName();
    this.stack = (new Error()).stack; // Сохраняем стек вызовов
  }

  getCallerMethodName() {
    const stack = (new Error()).stack;
    const stackLines = stack.split('\n');
    return stackLines[3]?.trim().match(/at (\w+)/)?.[1] || "Unknown Method";
  }

  toString() {
    return `${this.name} in ${this.methodName}: ${this.message}`;
  }
}