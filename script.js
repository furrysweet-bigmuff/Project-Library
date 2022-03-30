window.addEventListener("load", function(){

const openModalBtn = document.getElementById('openModal'),
      overlay = document.getElementById('overlay'),
      modal = document.getElementById('modal'),
      closeModalBtn = document.getElementById('cancel'),
      closeEditBtn = document.getElementById('cancel-edit'),
      addToLibraryBtn = document.getElementById('add'),
      editBookBtn = document.getElementById('edit'),
      bookAuthorInput = document.getElementById('book_author'),
      bookTitleInput = document.getElementById('book_title'),
      bookPagesInput = document.getElementById('book_pages'),
      bookCoverInput = document.getElementById('book_cover'),
      booksSection = document.getElementById('books-section'),
      defaultButtons = document.getElementById('default_buttons'),
      editButtons = document.getElementById('edit_buttons'),
      inputText = document.querySelectorAll('.modal input[type=text]'),
      defaultRadio = document.querySelector('[data-radio="default"]'),
      notDefaultRadio = document.querySelector('[data-radio="not-default"]'),
      fileNameInput= document.getElementById('file-name'),
      clearBtn = document.getElementById('clear'),
      booksAmount = document.getElementById('books_amount'),
      booksCompleted = document.getElementById('books_completed');
let myLibrary = [],
    bookId = 1,
    book = null,
    imageUrl = null,
    validateFlag = true,
    currentBook = null,
    bookReadValue = null,
    editBtn = document.querySelectorAll('.edit'),
    deleteBtn = document.querySelectorAll('.delete'),
    changeBtn = document.querySelectorAll('.change');
    
function openModal() {
    overlay.classList.add('active');
    modal.classList.add('active');
}

function closeModal() {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    setTimeout(clearModal, 500);
}

function closeEditModal() {
    closeModal();
    setTimeout(function(){
        defaultButtons.classList.remove('hidden');
        editButtons.classList.add('hidden');
    }, 500);
}

class Book {
    constructor(options) {
        this.bookId = options.bookId
        this.author = options.author
        this.title = options.title
        this.pages = options.pages
        this.read = options.read
        this.cover = options.cover
    }
    change() {
        if (this.read === 'Read') {
            this.read = 'Not read';
        } else {
            this.read = 'Read';
        }
        updateBooksAmount();
    }
}

// function Book(bookId, author, title, pages, read, cover) {
//     this.id = bookId;
//     this.author = author;
//     this.title = title;
//     this.pages = pages;
//     this.read = read;
//     this.cover = cover;
// }

// Book.prototype.change = function() {
//     if (this.read === 'Read') {
//         this.read = 'Not read';
//     } else {
//         this.read = 'Read';
//     }
//     updateBooksAmount();
// }

function createBook() {
    document.getElementsByName('radio').forEach(radio => {
        if (radio.checked) {
            bookReadValue = radio.value;
        }
    })    
    
    if (bookCoverInput.files[0]) {
        imageUrl = URL.createObjectURL(bookCoverInput.files[0]);
    } else {
        imageUrl = 'img/placeholder.png'
    }

    // let newBook = new Book(bookId, bookAuthorInput.value, bookTitleInput.value, bookPagesInput.value, bookReadValue, imageUrl);
    let newBook = new Book({
        bookId: bookId,
        author: bookAuthorInput.value,
        title: bookTitleInput.value,  
        pages: bookPagesInput.value,
        read: bookReadValue,
        cover: imageUrl
    })

    addBookToLibrary(newBook);

}

function addBookToLibrary(newBook) {

    myLibrary.push(newBook)

    book = '<div class="book" data-book="'+ newBook.bookId +'">'+
    '<img src="' + newBook.cover + '" alt="book" class="cover">'+
    '<div class="author">'+ newBook.author +'</div>'+
    '<div class="book-title">'+ newBook.title +'</div>'+
    '<div class="pages">'+ newBook.pages +' pages</div>'+
    '<div class="read">'+ newBook.read +' <span class="change">change</span></div>'+
    '<div class="book-action">'+
        '<span class="edit">Edit</span>'+
        '<span>/</span>'+
        '<span class="delete">Delete</span>'+
    '</div>'+
'</div>';
    booksSection.innerHTML += book;

    assignActions();
    updateBooksAmount();

    bookId += 1;

    closeModal();
}

function displayCoverName(event) {
    fileNameInput.innerHTML = this.files[0].name;
}

function validate() {
    validateFlag = true;
    if (!bookAuthorInput.value) {
        bookAuthorInput.classList.add('error');
        validateFlag = false;
    }
    if (!bookTitleInput.value) {
        bookTitleInput.classList.add('error');
        validateFlag = false;
    } 
    if (!bookPagesInput.value || isNaN(bookPagesInput.value)) {
        bookPagesInput.classList.add('error');
        validateFlag = false;
    } 
    if (validateFlag) {
        createBook()
    }
}

function clearModal() {
    bookAuthorInput.value = '';
    bookTitleInput.value = '';
    bookPagesInput.value = '';
    bookCoverInput.value = null;
    defaultRadio.click();
    fileNameInput.innerHTML = '';
}

function openEditModal() {
    // console.log(this.closest('.book').getAttribute('data-book'))
    let currentId = this.closest('.book').getAttribute('data-book');
    // console.log(currentId)
    currentBook = myLibrary.find( ({ bookId }) => bookId == currentId );
    console.log(currentBook)
    bookAuthorInput.value = currentBook.author;
    bookTitleInput.value = currentBook.title;
    bookPagesInput.value = currentBook.pages;
    currentBook.read == 'Read' ? defaultRadio.click() : notDefaultRadio.click();
    defaultButtons.classList.add('hidden');
    editButtons.classList.remove('hidden');
    editBookBtn.dataset.edit = currentId;
    openModal();
}

function editBook() {
    let thisBook = document.querySelector('[data-book="' + editBookBtn.dataset.edit + '"]')
    currentBook.author = bookAuthorInput.value;
    currentBook.title = bookTitleInput.value;
    currentBook.pages = bookPagesInput.value;
    if (fileNameInput.innerHTML) {
        currentBook.cover = fileNameInput.innerHTML;
    }
    document.getElementsByName('radio').forEach(radio => {
        if (radio.checked) {
            currentBook.read = radio.value;
            thisBook.querySelector('.read').innerHTML = radio.value + '<span class="change">change</span>';
        }
    })  
    
    thisBook.querySelector('.author').innerHTML = bookAuthorInput.value;
    thisBook.querySelector('.book-title').innerHTML = bookTitleInput.value;
    thisBook.querySelector('.pages').innerHTML = bookPagesInput.value + ' pages';
    if (bookCoverInput.files[0]) {
        thisBook.querySelector('.cover').src = URL.createObjectURL(bookCoverInput.files[0]);
    }
    closeEditModal();
}

function deleteBook() {
    let deleteId = this.closest('.book').dataset.book;
    currentBook = myLibrary.find( ({ bookId }) => bookId == deleteId );
    myLibrary.splice(myLibrary.indexOf(currentBook,0), 1);
    this.closest('.book').remove();
    updateBooksAmount();
}

function changeReadStatus() {
    let changeId = this.closest('.book').dataset.book;
    currentBook = myLibrary.find( ({ bookId }) => bookId == changeId );
    currentBook.change();
    this.closest('.read').innerHTML = currentBook.read + '<span class="change">change</span>';
    assignActions();
}

function clearBooks() {
    myLibrary = [];
    booksSection.replaceChildren();
    updateBooksAmount();
}

function updateBooksAmount() {
    booksAmount.innerHTML = myLibrary.length;

    let newArr = myLibrary.filter(obj => obj.read === 'Read');
    booksCompleted.innerHTML = newArr.length;
}


inputText.forEach(input => input.addEventListener('click', function() {
    if (this.classList.contains('error')) {
        this.classList.remove('error');
    }
}));

function assignActions() {
    editBtn = document.querySelectorAll('.edit'),
    deleteBtn = document.querySelectorAll('.delete'),
    changeBtn = document.querySelectorAll('.change');
    editBtn.forEach(btn => btn.addEventListener('click', openEditModal));
    deleteBtn.forEach(btn => btn.addEventListener('click', deleteBook));
    changeBtn.forEach(btn => btn.addEventListener('click', changeReadStatus));
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
closeEditBtn.addEventListener('click', closeEditModal);
addToLibraryBtn.addEventListener('click', validate);
editBookBtn.addEventListener('click', editBook);
bookCoverInput.addEventListener('change', displayCoverName);
clearBtn.addEventListener('click', clearBooks);

// let book1 = new Book(1, 'Rachel Hartman', 'Tess of the Road', '1032', 'Read', 'img/book1.jpeg');
// let book2 = new Book(2, 'Sophia Hill', 'The Hypocrite World', '937', 'Not Read', 'img/book2.jpg');
// let book3 = new Book(3, 'Tara Westover', 'Educated. A Memoir', '456', 'Read', 'img/book3.jpeg');


let book1 = new Book({
    bookId: 1,
    author: 'Rachel Hartman',
    title: 'Tess of the Road',  
    pages: '1032',
    read: 'Read',
    cover: 'img/book1.jpeg'
});

let book2 = new Book({
    bookId: 2,
    author: 'Sophia Hill',
    title: 'The Hypocrite World',  
    pages: '937',
    read: 'Not Read',
    cover: 'img/book2.jpg'
});

let book3 = new Book({
    bookId: 3,
    author: 'Tara Westover',
    title: 'Educated. A Memoir',  
    pages: '456',
    read: 'Read',
    cover: 'img/book3.jpeg'
});

addBookToLibrary(book1);
addBookToLibrary(book2);
addBookToLibrary(book3);
console.log(myLibrary)
});



