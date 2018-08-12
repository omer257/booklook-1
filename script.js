let datax;
let items;
let item;
let BOARDER10 = 10;

var source = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

let render = function() {
    $('.books').empty();
    $('.books').append("<h3 class='loading'>" + "Loading..." + "</h3>");
    items = datax.items;
    if (!items) {
        $('.loading').remove();
        $('.books').append("<h3 class='not found'>" + "Sorry Notihng Found..." + "</h3>");
        return;
    }
    if (items.length <= 10) {
        BOARDER10 = items.length;
    }
    for (let i = 0; i < BOARDER10; i++) {
        item = items[i].volumeInfo;
        let title = item.title;
        let description = item.description;
        let authors;
        if (!item.authors) {
            authors = '';
        } else if (item.authors.length >= 1) {
            authors = item.authors[0];
            let image;
            if (item.imageLinks) {
                image = item.imageLinks.thumbnail;
            } else
                image = '';
            var context = { title: title, description: description, authors: authors, image: image };
            var html = template(context);
            $('.loading').remove();
            $('.books').append(html);
        }
    }
}


let renderSpecificBook = function(context) {
    $('.books').empty();
    var context = context;
    var html = template(context);
    $('.books').html(html);
}


$('.form-isbn').on('click', '.search-btn', function() {
    let isbn = $('.form-isbn').find('#book-isbn').val();
    fetchByISBN(isbn);
});
var fetchByISBN = function(isbn) {
    $.ajax({
        method: "GET",
        url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn,
        success: function(data) {
            datax = data;
            render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var fetchByAuthor = function(author) {
    console.log(author);
    $.ajax({
        method: "GET",
        url: 'https://www.googleapis.com/books/v1/volumes?q=inauthor:' + author,
        success: function(data) {
            datax = data;
            render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

$('.form-title').on('click', '.search-btn', function() {
    let title = $('.form-title').find('#book-title').val();
    fetchByTitle(title);
});

$('.form-author').on('click', '.search-btn', function() {
    let author = $('.form-author').find('#book-author').val();
    fetchByAuthor(author);
});

var fetchByTitle = function(title) {
    $.ajax({
        method: "GET",
        url: 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + title,
        success: function(data) {
            datax = data;
            render();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};


$('.books').on('click', '.img-btn', function() {
    let title = ($(this).closest(".book").children('h3').text());
    let authors = ($(this).closest(".book").children('h4').text().replace('Written By:', ''));
    let description = ($(this).closest(".book").children('p').text());
    let image = ($(this).css("background-image").replace('url', '').replace('(', '').replace(')', ''));
    let context = { title: title, description: description, authors: authors, image: image };
    renderSpecificBook(context);
});