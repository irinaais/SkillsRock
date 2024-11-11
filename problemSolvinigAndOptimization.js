function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFunction = debounce(() => {
  console.log('Вызвана функция с задержкой');
}, 2000);

debouncedFunction();
debouncedFunction(); // Этот вызов должен сбросить таймер и предотвратить мгновенный вызов функции.

// Глубокое клонирование объекта
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Примитивы возвращаем без изменений
  }

  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

const original = {
  name: 'John',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

const copy = deepClone(original);
copy.address.city = 'Los Angeles';
console.log(original.address.city); // New York (оригинальный объект не должен измениться)
console.log(copy.address.city);     // Los Angeles
