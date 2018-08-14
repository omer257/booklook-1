let datax;//could find a better name
let items;
let item;
let BOARDER10 = 10;
//This is not needed - its comes as 10 please do a search in the api page of 10//
var source = document.getElementById("entry-template").innerHTML;
//Mixed vanilla and jq
var template = Handlebars.compile(source);
// The code order is very signifact to understand it
//DRY principe is good to rememeber


//Ux remark - user should be able to submit with enter - just change the button to input type submit-
//Where the click is invoked use event.preventDefault(); (dont forget to pass the event)


//UX II - move the res so the user can see them!!!!

var fetchByISBN = function(isbn) {
    let baseurl ="https://www.googleapis.com/books/v1/volumes?q=";
    //if then or something similar in order to create a dynamic string
    let adittionUrl = "isbn:' + isbn;
    $.ajax({
        method: "GET",
        url: baseurl+adittionUrl,//Notice the change here
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

let render = function() {
    $('.books').empty();
    $('.books').append("<h3 class='loading'>" + "Loading..." + "</h3>");
    //$('.books').html("<h3 class='loading'>" + "Loading..." + "</h3>");

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
        //Try when you have the chance ternary (short if then)
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
    $('.books').empty();// remove ??
    var context = context;// please remove or remember  - remove??
    var html = template(context);
    $('.books').html(html);
}

$('.form-isbn').on('click', '.search-btn', function() {
    let isbn = $('.form-isbn').find('#book-isbn').val();
    //also get the select button results
    //send something to the ajax
    //let it decide alone what is the query
    fetchByISBN(isbn);
});

$('.form-title').on('click', '.search-btn', function() {
    let title = $('.form-title').find('#book-title').val();
    fetchByTitle(title);
});

$('.form-author').on('click', '.search-btn', function() {
    let author = $('.form-author').find('#book-author').val();
    fetchByAuthor(author);
});

$('.books').on('click', '.img-btn', function() {
    //This refactor to a function - keep on the same code style
    //Just take the id and re apply the data from the array we wrote it.
    let title = ($(this).closest(".book").children('h3').text());
    let authors = ($(this).closest(".book").children('h4').text().replace('Written By:', ''));
    let description = ($(this).closest(".book").children('p').text());
    let image = ($(this).css("background-image").replace('url', '').replace('(', '').replace(')', ''));
    let context = { title: title, description: description, authors: authors, image: image };
    renderSpecificBook(context);
});
