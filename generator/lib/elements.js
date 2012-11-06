function Paragraph(indent, text) {
    this.indent = indent;
    this.text = text;
}
function Title(indent, level, text) {
    this.indent = indent;
    this.level = level;
    this.text = text;
}
function CodeBlock(indent, lang, code) {
    this.indent = indent;
    this.lang = lang;
    this.code = code;
}
function List(indent, items) {
    this.indent = indent;
    this.items = items;
}
function Question(indent, text) {
    this.indent = indent;
    this.text = text;
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

Answer.prototype = new HasContents();
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

Page.prototype = new HasContents();
Page.prototype.constructor = Page;


// toHTML

Paragraph.prototype.toHTML = function() {
    return '<p>' + this.text + '</p>';
};

Title.prototype.toHTML = function() {
    var hLevel = this.level + 2;
    var anchor = this.text.toLowerCase()
            .replace(/[^a-z0-9-]|\s/g, '-');
    return '<h' + hLevel +' name="' + anchor
        + '">' + this.text + '</h' + hLevel + '>';
};

CodeBlock.prototype.toHTML = function() {
    var className = (this.lang != 'JavaScript'
                     ? ' class="' + this.lang + '"'
                     : '');
    return '<pre' + className + '>' + this.code + '</pre>';
};

List.prototype.toHTML = function() {
    return '<ul>\n' + this.items.map(function(item) {
        return '<li>' + item + '</li>';
    }).join('\n') + '\n</ul>';
};

Question.prototype.toHTML = function() {
    return '<div class="question">' + this.text + '</div>';
};

Answer.prototype.toHTML = function() {
    return '<div class="answer">\n'
        + this.contents.map(function(elem) {
            return elem.toHTML();
        }).join('\n') + '</div>';
};

QA.prototype.toHTML = function() {
    return this.question.toHTML() + '\n' + this.answer.toHTML();
};

Page.prototype.toHTML = function() {
    return this.contents.map(function(elem) {
        return elem.toHTML();
    }).join('\n');
};

// Transformer - Mutable

Paragraph.prototype.transform = function(t) {
    this.text = t(this.text);
    return this;
};

Title.prototype.transform = function(t) {
    return this;
};

CodeBlock.prototype.transform = function(t) {
    return this;
};

List.prototype.transform = function(t) {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i] = t(this.items[i]);
    }
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

// Exports

exports.Paragraph = Paragraph;
exports.Title = Title;
exports.CodeBlock = CodeBlock;
exports.List = List;
exports.Question = Question;
exports.Answer = Answer;
exports.QA = QA;
exports.Page = Page;