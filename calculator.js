class Calculator {
  constructor() {
  }

  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) return 'Произошла ошибка. Делить на ноль делить нельзя.';
    return a / b;
  }
}

const calculator = new Calculator();
console.log(calculator.add(2, 2));
console.log(calculator.subtract(2, 2));
console.log(calculator.multiply(2, 2));
console.log(calculator.divide(2, 0));
console.log(calculator.divide(2, 2));
