var fs = require('fs');

var formatAuthors = function(authors) {
    return authors.map(function(author) {
        return author[0] + ', '
            + author.splice(1).map(function(name) {
                return name[0] + '.';
            }).join('');
    }).join(', & ');
};


var Book = function(name, fields) {
    this.name = name;
    for (var field in fields) {
        this[field] = fields[field];
    }
};
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
    return '<li class="book">'
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
Wikipedia.prototype.toHTML = function() {
    return '<li class="encyc"><span class="title">'
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
Website.prototype.toHTML = function() {
    return '<li class="website"><span class="siteName">'
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
Blog.prototype.toHTML = function() {
    return '<li class="blog"><span class="authors">'
        + formatAuthors(this.authors) + '</span> '
        + (this.published
           ? '(' + this.published + '). '
           : '')
        + '<span class="title">' + this.title + '</span>. '
        + 'Message posted to '
        + '<a href="' + this.url + '">' + this.url + '</a></li>';
};

exports.makeBibliography = function() {
    // Ugly, but easy
    eval(fs.readFileSync('../bibliography.js', 'utf8'));

    var html = '<ol>\n';
    html += (entries.sort(function(a, b) {
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
    }).map(function(book) {
        return book.toHTML();
    }).join('\n'));

    html += '</ol>';
    return html;
};
