const UNCOMPLETED_LIST_BOOK_ID = "unread";
const COMPLETED_LIST_BOOK_ID = "read";
const BOOK_ITEM_ID = "itemId";

function addBook() {
  const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;

  const book = makeBook(inputTitle, inputAuthor, inputYear);
  const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false);

  book[BOOK_ITEM_ID] = bookObject.id;
  books.push(bookObject);

  bookUncompleted.append(book);
  updateDataToStorage();
}

function makeBook(title, author, year, isCompleted) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("small");
  textYear.innerText = year;

  const detailBook = document.createElement("article");
  detailBook.classList.add("book-detail");
  detailBook.append(textTitle, textAuthor, textYear);

  const detailItem = document.createElement("div");
  detailItem.classList.add("book-item");
  detailItem.append(detailBook);

  if (isCompleted) {
    detailItem.append(createUnreadButton(), createTrashButton());
  } else {
    detailItem.append(createReadButton(), createTrashButton());
  }

  return detailItem;
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });

  if (buttonTypeClass === "trash-button") {
    button.setAttribute("onclick", "customDeleteDialog()");
  }

  return button;
}

function createReadButton() {
  return createButton("read-button", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
}

function addBookToCompleted(bookElement) {
  const bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

  const textTitle = bookElement.querySelector(".book-detail > h3").innerText;
  const textAuthor = bookElement.querySelector(".book-detail > p").innerText;
  const textYear = bookElement.querySelector(".book-detail > small").innerText;

  const newBook = makeBook(textTitle, textAuthor, textYear, true);
  const book = findBook(bookElement[BOOK_ITEM_ID]);
  book.isCompleted = true;
  newBook[BOOK_ITEM_ID] = book.id;

  bookCompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEM_ID]);
  const cancel = document.querySelector(".cancel");
  const remove = document.querySelector(".remove");
  const modal = document.querySelector(".delete-dialog");

  remove.addEventListener("click", function () {
    books.splice(bookPosition, 1);
    bookElement.remove();
    modal.style.visibility = "hidden";

    updateDataToStorage();
  });

  cancel.addEventListener("click", function () {
    modal.style.visibility = "hidden";
  });
}

function customDeleteDialog() {
  const modal = document.querySelector(".delete-dialog");
  modal.style.visibility = "visible";
}

function createTrashButton() {
  return createButton("trash-button", function (event) {
    removeBookFromCompleted(event.target.parentElement);
  });
}

function undoBookFromCompleted(bookElement) {
  const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

  const textTitle = bookElement.querySelector(".book-detail > h3").innerText;
  const textAuthor = bookElement.querySelector(".book-detail > p").innerText;
  const textYear = bookElement.querySelector(".book-detail > small").innerText;

  const newBook = makeBook(textTitle, textAuthor, textYear, false);
  const book = findBook(bookElement[BOOK_ITEM_ID]);
  book.isCompleted = false;
  newBook[BOOK_ITEM_ID] = book.id;

  bookUncompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function createUnreadButton() {
  return createButton("unread-button", function (event) {
    undoBookFromCompleted(event.target.parentElement);
  });
}

function booksLength() {
  const jumlahBuku = document.getElementById("jumlahBuku");
  jumlahBuku.innerText = books.length;
}

const searchBook = document.getElementById("searchSubmit");
searchBook.addEventListener("click", (event) => {
  event.preventDefault();

  const textSearch = document.getElementById("searchBookTitle").value.toLowerCase();
  const books = document.querySelectorAll(".book-item");

  for (book of books) {
    const title = book.firstElementChild.textContent.toLowerCase();

    if (title.indexOf(textSearch) != -1) {
      book.style.display = "flex";
      console.log(title);
    } else {
      book.style.display = "none";
    }
  }
});
