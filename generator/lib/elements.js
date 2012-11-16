function Paragraph(indent, text) {
    this.indent = indent;
    this.text = text;
}
function Title(indent, level, text, label, unnumbered) {
    this.indent = indent;
    this.level = level;
    this.text = text;
    if (label) this.label = label;
    if (unnumbered) this.unnumbered = unnumbered;
}
function CodeBlock(indent, lang, code, name, depends) {
    this.indent = indent;
    this.lang = lang;
    this.code = code;
    if (name) this.name = name;
    if (depends) this.depends = depends;
}
function ListItem(indent, text) {
    this.indent = indent;
    this.text = text;
}
function List(indent, items) {
    this.indent = indent;
    this.items = items;
    for (var i = 0; i < this.items.length; i++) {
        if (i == 0) this.items[i].indent += this.indent;
        this.items[i].indent += 2;
    }
    this.fixIndentation();
}
List.prototype.fixIndentation = function() {
    if (this.items.length > 1) {
        var prevIndent = this.items[0].indent;
        var newItems = [this.items[0]];
        for (var i = 1; i < this.items.length; i++) {
            var subList = [],
                tempIndent = this.items[i].indent,
                startI = i;
            while (i < this.items.length
                   && this.items[i].indent >= prevIndent + 2) {
                this.items[i].indent -= 2;
                subList.push(this.items[i++]);
            }
            if (subList.length > 0) {
                subList[0].indent -= this.items[startI - 1].indent;
                newItems.push(new List(tempIndent - 2, subList));
                i--;
            } else {
                newItems.push(this.items[i]);
            }
            prevIndent = tempIndent;
        }
        this.items = newItems;
    }
};
function LinkDef(label, url) {
    this.label = label;
    this.url = url;
}
function BlockQuote(indent, text, cite, ref) {
    this.indent = indent;
    this.text = text;
    if (cite) this.cite = cite;
    if (ref) this.ref = ref;
}
function HTML(indent, html) {
    this.indent = indent;
    this.html = html;
}

function Question(indent, text, name, label) {
    this.indent = indent;
    this.text = text;
    if (name && label) {
        this.name = name;
        this.label = label;
    }
}

function HasContents() {};

HasContents.prototype.fixIndentation = function() {
    // Fix things like
    // Q: ...
    // A: ...
    //    Q: ...
    //    A: ...
    //    x
    // The x will be in the nested QA, instead of the top level QA
    var newContents = [];
    for (var i = 0; i < this.contents.length; i++) {
        var elem = this.contents[i];
        newContents.push(elem);
        if (elem.answer) {
           elem.answer.fixIndentation();
            var newSubContents = [];
            for (var j = 0; j < elem.answer.contents.length; j++) {
                var subElem = elem.answer.contents[j];
                if (subElem.indent <= elem.answer.indent) {
                    newContents.push(subElem);
                } else {
                    newSubContents.push(subElem);
                }
            }
            elem.answer.contents = newSubContents;
        }
    }
    this.contents = newContents;
};

function Answer(indent, contents) {
    this.indent = indent;
    this.contents = contents;
    if (contents && contents[0]
        && contents[0].indent <= this.indent) {
        contents[0].indent += 3 + this.indent;
    }
}

Answer.prototype = new HasContents;
Answer.prototype.constructor = Answer;


function QA(indent, question, answer) {
    this.indent = indent;
    this.question = question,
    this.answer = answer;
}

function Page(contents) {
    this.contents = contents;
    this.fixIndentation();
}

Page.prototype = new HasContents;
Page.prototype.constructor = Page;

// Anchor

Title.prototype.anchor = function() {
    if (!this._anchor) {
        this._anchor = this.text.toLowerCase()
            .replace(/[^a-z0-9-]|\s/g, '-')
            .replace(/-+/g, '-');
    }
    return this._anchor;
};


// toHTML

Paragraph.prototype.toHTML = function() {
    return '<p>' + this.text + '</p>';
};

Title.prototype.toHTML = function() {
    var hLevel = this.level + 2,
        scroller = '<span class="to-top">'
            + '<a href="#top">&uarr; To top</a></span>';

    return scroller + '<h' + hLevel +' id="' + this.anchor()
        + '">' + (this.unnumbered ? '' : this.number + ' ') +
        this.text + '</h' + hLevel + '>';
};

// Source: https://github.com/janl/mustache.js
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
function escapeHTML(html) {
    return String(html).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
}

CodeBlock.prototype.toHTML = function() {
    var className = (this.lang != 'JavaScript'
                     ? ' class="' + this.lang + '"'
                     : ''),
        name = (this.name
                ? ' data-name="' + this.name + '"'
                : ''),
        depends = (this.depends
                ? ' data-depends="' + this.depends + '"'
                : '');
    return '<pre' + className + name + depends + '>' + escapeHTML(this.code) + '</pre>';
};


ListItem.prototype.toHTML = function() {
    return '<li>' + this.text + '</li>';
};

List.prototype.toHTML = function() {
    return '<ul>' + this.items.map(function(item) {
        return item.toHTML();
    }).join('') + '</ul>';
};

LinkDef.prototype.toHTML = function() {
    // No HTML representation
    return '';
};

BlockQuote.prototype.toHTML = function() {
    return '<blockquote>'
        + this.text
        + (this.url
           ? '<br><span class="cite">&mdash;<a href="' + this.url + '">'
           + this.cite + '</a></span>'
           : (this.cite
              ? '<br><span class="cite">&mdash;' + this.cite +
              '</span>'
              : ''))
        + '</blockquote>';
};

HTML.prototype.toHTML = function() {
    return this.html;
};

Question.prototype.toHTML = function() {
    return '<div class="question"' +
        (this.label
         ? ' id="' + this.label + '">'
         : '>')
         + this.text + '</div>';
};

Answer.prototype.toHTML = function() {
    return '<div class="answer">'
        + this.contents.map(function(elem) {
            return elem.toHTML();
        }).join('') + '</div>';
};

QA.prototype.toHTML = function() {
    return this.question.toHTML() + this.answer.toHTML();
};

Page.prototype.toHTML = function() {
    return this.contents.map(function(elem) {
        return elem.toHTML();
    }).join('');
};

// Transformer


Paragraph.prototype.transform = function(t) {
    this.text = t(this.text);
    return this;
};

Title.prototype.transform = function(t) {
    this.text = t(this.text);
    return this;
};

CodeBlock.prototype.transform = function(t) {
    return this;
};

ListItem.prototype.transform = function(t) {
    this.text = t(this.text);
    return this;
};

List.prototype.transform = function(t) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].transform(t);
    }
    return this;
};

LinkDef.prototype.transform = function(t) {
    return this;
};

BlockQuote.prototype.transform = function(t) {
    this.text = t(this.text);
    return this;
};

HTML.prototype.transform = function(t) {
    return this;
};

Question.prototype.transform = function(t) {
    this.text = t(this.text);
    return this;
};

Answer.prototype.transform = function(t) {
    for (var i = 0; i < this.contents.length; i++) {
        this.contents[i].transform(t);
    }
    return this;
};

QA.prototype.transform = function(t) {
    this.question.transform(t);
    this.answer.transform(t);
    return this;
};

Page.prototype.transform = function(t) {
    for (var i = 0; i < this.contents.length; i++) {
        this.contents[i].transform(t);
    }
    return this;
};

// Traversal

Paragraph.prototype.traverse = function(f) {
    f(this);
};

Title.prototype.traverse = function(f) {
    f(this);
};

CodeBlock.prototype.traverse = function(f) {
    f(this);
};

ListItem.prototype.traverse = function(f) {
    f(this);
};

List.prototype.traverse = function(f) {
    f(this);
};

LinkDef.prototype.traverse = function(f) {
    f(this);
};

BlockQuote.prototype.traverse = function(f) {
    f(this);
};

HTML.prototype.traverse = function(f) {
    f(this);
};

Question.prototype.traverse = function(f) {
    f(this);
};

Answer.prototype.traverse = function(f) {
    f(this);
    for (var i = 0; i < this.contents.length; i++) {
        this.contents[i].traverse(f);
    }
};

QA.prototype.traverse = function(f) {
    f(this);
    this.question.traverse(f);
    this.answer.traverse(f);
};

Page.prototype.traverse = function(f) {
    f(this);
    for (var i = 0; i < this.contents.length; i++) {
        this.contents[i].traverse(f);
    }
};

// Exports

exports.Paragraph = Paragraph;
exports.Title = Title;
exports.CodeBlock = CodeBlock;
exports.ListItem = ListItem;
exports.List = List;
exports.LinkDef = LinkDef;
exports.BlockQuote = BlockQuote;
exports.HTML = HTML;
exports.Question = Question;
exports.Answer = Answer;
exports.QA = QA;
exports.Page = Page;
