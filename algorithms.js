// Проверка на палиндром
function isPalindrome(str) {
  const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

console.log(isPalindrome('А роза упала на лапу Азора'));
console.log(isPalindrome('Привет'));

// FizzBuzz
function fizzBuzz() {
  for (let i = 1; i <= 100; i++) {
    if ((i % 3 === 0) && (i % 5 === 0)) console.log('FizzBuzz');
    if (i % 3 === 0) console.log('Fizz');
    if (i % 5 === 0) console.log('Buzz');
    console.log(i);
  }
}

fizzBuzz();

// Разбиение массива на части
function chunkArray(array, size) {
  const result = [];

  for (let i = 0; i < array.length; i+= size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 2));
console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3));
