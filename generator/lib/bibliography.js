var fs = require('fs');

var formatAuthors = function(authors) {
    return authors.map(function(author) {
        return author[0] + ', '
            + author.splice(1).map(function(name) {
                return name[0] + '.';
            }).join('');
    }).join(', & ');
};

var BibItem = function() {};
BibItem.prototype.toURL = function() {
    // this.number is filled in by makeBibIndex, which should have
    // been called by now.
    return '#bib-' + this.number;
};
BibItem.prototype.toReference = function() {
    return '<a href="' + this.toURL() + '" class="ref">'
        + '<span class="bib">' + this.number +'</span> ' + this.title + '</a>';
};

var Book = function(name, fields) {
    this.name = name;
    for (var field in fields) {
        this[field] = fields[field];
    }
};
Book.prototype = new BibItem;
Book.prototype.constructor = Book;
Book.prototype.toHTML = function() {
    var fmtAuthors = formatAuthors(this.authors);
    // We need pattern-matching
    var fmtEdition = null;
    switch (this.edition) {
    case 1: fmtEdition = '1st'; break;
    case 2: fmtEdition = '2nd'; break;
    case 3: fmtEdition = '3rd'; break;
    default: fmtEdition = this.edition + 'th';
    };
    return '<li class="book" id="bib-' + this.number + '">'
        + '<span class="author">' + fmtAuthors + '</span> '
        + '<span class="year">(' + this.year + ')</span>. '
        + '<span class="title">' + this.title + '</span>'
        + (this.edition > 1
           ? ' <span class="edition">(' + fmtEdition + ' ed.)</span>. '
           : '. ')
        + '<span class="publisher-address">' + this.address + '</span>: '
        + '<span class="publisher">' + this.publisher + '</span>.</li>';
};

var Wikipedia = function(name, fields) {
    this.name = name;
    for (var field in fields) {
        this[field] = fields[field];
    }
};
Wikipedia.prototype = new BibItem;
Wikipedia.prototype.constructor = Wikipedia;
Wikipedia.prototype.toHTML = function() {
    return '<li class="encyc" id="bib-' + this.number + '"><span class="title">'
        + this.title + '</span>. In <span class="encyc">Wikipedia</span>.'
        + ' Retrieved ' + this.retrieved + ', from <a href="' +
        this.url + '">' + this.url + '</a></li>';
};

var Website = function(name, fields) {
    this.name = name;
    for (var field in fields) {
        this[field] = fields[field];
    }
};
Website.prototype = new BibItem;
Website.prototype.constructor = Website;
Website.prototype.toHTML = function() {
    return '<li class="website" id="bib-' + this.number + '"><span class="siteName">'
        + this.siteName + '</span>. '
        + (this.year ? '(' + this.year + '). ': '')
        + '<span class="title">' + this.title + '</span>. '
        + (this.retrieved
           ? 'Retrieved ' + this.retrieved + ', from '
           : '')
        + '<a href="' + this.url + '">' + this.url + '</a></li>';
};


var Blog = function(name, fields) {
    this.name = name;
    for (var field in fields) {
        this[field] = fields[field];
    }
};
Blog.prototype = new BibItem;
Blog.prototype.constructor = Blog;
Blog.prototype.toHTML = function() {
    return '<li class="blog" id="bib-' + this.number + '"><span class="authors">'
        + formatAuthors(this.authors) + '</span> '
        + (this.published
           ? '(' + this.published + '). '
           : '')
        + '<span class="title">' + this.title + '</span>. '
        + 'Message posted to '
        + '<a href="' + this.url + '">' + this.url + '</a></li>';
};

var JournalArticle = function(name, fields) {
    this.name = name;
    for (var field in fields) {
        this[field] = fields[field];
    }
};
JournalArticle.prototype = new BibItem;
JournalArticle.prototype.constructor = JournalArticle;
JournalArticle.prototype.toHTML = function() {
    return '<li class="journal-article" id="bib-' + this.number + '">'
        + '<span class="authors">' + formatAuthors(this.authors) + '</span> '
        + '<span class="year">(' + this.year + ')</span>. '
        + '<span class="title">' + this.title + '</span>. '
        + '<span class="journal">' + this.journal + '</span>, '
        + '<span class="volume">' + this.volume + '</span>, '
        + '<span class="pages">' + this.pages + '</span>. '
        + '<span class="publisher-address">' + this.address + '</span>: '
        + '<span class="publisher">' + this.publisher + '</span>.</li>';
};

exports.makeBibliography = function() {
    // Ugly, but easy
    var entries;
    eval(fs.readFileSync('../bibliography.js',
                                        'utf8'));
    // First items with an author, sorted on the author's last name,
    // sort the other items on their title.
    return entries.sort(function(a, b) {
        // Wow, this is ugly
        if (a.authors && b.authors) {
            return (a.authors < b.authors)
                ? -1
                : (a.authors > b.authors)
                ? 1
                : 0;
        } else if (a.authors) {
            return -1;
        } else if (b.authors) {
            return 1;
        } else {
            return (a.title < b.title)
                ? -1
                : (a.title > b.title)
                ? 1
                : 0;
        }
    });
};

exports.makeBibIndex = function(bib) {
    var index = {};
    for (var i = 0; i < bib.length; i++) {
        bib[i].number = i + 1;
        index[bib[i].name] = bib[i];
    }
    return index;
};

exports.toHTML = function(bib) {
    var html = '<ol>\n';
    html += (bib).map(function(book) {
        return book.toHTML();
    }).join('\n');

    html += '</ol>';
    return html;
};
