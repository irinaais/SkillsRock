class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.isAvailable = true;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
    console.log(`Вы добавили в библиотеку книгу "${book.title}".`);
  }

  borrowBook(isbn) {
    const book = this.books.find((book) => book.isbn === isbn);
    if (book && book.isAvailable) {
      book.isAvailable = false;
      console.log(`Вы взяли книгу "${book.title}".`);
    } else {
      console.log('Книга не найдена или недоступна.');
    }
  }

  returnBook(isbn) {
    const book = this.books.find((book) => book.isbn === isbn);
    if (book && !book.isAvailable) {
      book.isAvailable = true;
      console.log(`Вы вернули книгу "${book.title}".`);
    }  else {
      console.log('Книга не найдена или не была взята.');
    }
  }

  listAvailableBooks() {
    if (this.books.length === 0) {
      console.log('В библиотеке пока нет книг.');
      return;
    }

    const availableBooks = this.books.filter((book) => book.isAvailable);
    if (availableBooks.length === 0) {
      console.log('Доступных книг нет.');
    } else {
      console.log('Список доступных книг:');
      availableBooks.forEach((book) => {
        console.log(`"${book.title}" ${book.author} ISBN: ${book.isbn}`);
      })
    }
  }
}

const library = new Library();
library.listAvailableBooks();
library.addBook(new Book('Война и мир', 'Л. Н. Толстой', 12345678));
library.addBook(new Book('Преступление и наказание', 'Ф. М. Достоевский', 23456789));
library.listAvailableBooks();
library.borrowBook(12345678);
library.listAvailableBooks();
library.borrowBook(23456789);
library.listAvailableBooks();
library.returnBook(12345678);
library.listAvailableBooks();
library.borrowBook(23456789);
library.returnBook(12345678);
