var jp = require('./jsparse.js'),
    ch = jp.ch, action = jp.action, join_action = jp.join_action,
    seq = jp.sequence, token = jp.token, but = jp.negate,
    rep0 = jp.repeat0, rep1 = jp.repeat1, choice = jp.choice,
    opt = jp.optional, diff = jp.difference, and = jp.and,
    not = jp.not, ps = jp.ps,
    el = require('./elements.js');

// Expects p to return an array of strings and joins the strings
// together.
function joined(p) {
    return join_action(p, '');
}
// Matches p and returns null.
function ignored(p) {
    return action(p, function() {
        return null;
    });
}
// Returns the length of the string matched by p.
function count(p) {
    return action(p, function(xs) {
        return xs.length;
    });
}
// Matches startStr (a string), then parser p, then endStr (also a
// string), returns the result of p. The parser p should not match
// endStr.
function between(startStr, p, endStr) {
    return action(seq(token(startStr), p, token(endStr)),
                  function(arr) {
                      return arr[1];
                  });
}

// Expects the parser to return a string and returns the parsed string
// with all whitespace removed from the left side.
function trimLeft(p) {
    return action(p, function(s) {
        return s.replace(/^ +/, '');
    });
}
// Expects the parser to return a string and returns the parsed string
// with all whitespace removed from the right side.
function trimRight(p) {
    return action(p, function(s) {
        return s.replace(/ +$/, '');
    });
}
// Like jsparse.whitespace, but only matches spaces
function ws(p) {
    return action(seq(opt(WS), p), function(x) {
        return x[1];
    });
}
// Matches zero or more spaces, and then p. Returns an array of the
// number of spaces and the result of p.
function indented(p) {
    return action(
        seq(rep0(ch(' ')), p),
        function(arr) {
            return [arr[0].length, arr[1]];
        });
}

var NewLine = action(seq(opt(ch('\r')), ch('\n')),
                     function() { return ' ';});
var ButNewLine = but(NewLine);
var TillEOL = joined(rep1(ButNewLine));
var WholeLine = joined(seq(TillEOL, NewLine));
var WS = rep1(ch(' '));
var Paragraph = action(
    indented(trimRight(joined(rep1(ws(WholeLine))))),
    function(arr) {
        return new el.Paragraph(arr[0], arr[1]);
    });

var BlankLine = ignored(ws(NewLine));
var BlankLines = ignored(rep1(BlankLine));

var Bracketed = between('[', joined(rep1(but(ch(']')))), ']');

var Title = action(
    indented(seq(
        count(rep1(ch('#'))),
        opt(ch('-')),
        ws(trimRight(joined(rep1(but(ch('#')))))),
        ignored(rep1(ch('#'))),
        opt(Bracketed),
        ignored(NewLine))),
    function(arr) {
        return new el.Title(arr[0], arr[1][0], arr[1][2], arr[1][3],
                            arr[1][1] ? true : false);
    });

var CodeBlock = action(
    seq(opt(WS),
        between('```',
                seq(joined(rep1(but(choice(NewLine, '[')))),
                    opt(Bracketed),
                    opt(Bracketed),
                    NewLine,
                    joined(rep1(but(token('```'))))),
                '```')),
    function(arr) {
        var indentRE = new RegExp('^' + (arr[0] ? arr[0].join('') : ''));
        var lang = arr[1][0];
        var name = arr[1][1];
        var depends = arr[1][2];
        var code = arr[1][4];
        return new el.CodeBlock(
            arr[0] ? arr[0].length : 0,
            lang,
            code.split(/\r?\n/).map(function(line) {
                return line.replace(indentRE, '');
            }).join('\n').replace(/\r?\n$/, ''),
            name,
            depends);
    });


var ListItem = action(
    seq(indented(ignored(ch('*'))),
        ws(WholeLine),
        rep0(ws(seq(but(choice(NewLine, ch('*'))),
                    ws(joined(seq(joined(rep0(ButNewLine)),
                                  ignored(NewLine)))))))),
    function(arr) {
        if (arr[2] && arr[2].length > 0) {
            var lines = arr[2].map(function(l) {
                return l[0] + l[1];
            });
            lines.unshift(arr[1].replace(/\s$/, ''));
            return new el.ListItem(arr[0][0], lines.join(' ').replace(/\s+$/, ''));
        } else {
            return new el.ListItem(arr[0][0], arr[1].replace(/\s+$/, ''));
        }
    });

var List = action(indented(rep1(ListItem)),
                  function(arr) {
                      return new el.List(arr[0], arr[1]);
                  });

var LinkDef = action(
    seq(ws(Bracketed),
        ch(':'),
        ws(joined(seq(token("http"), TillEOL, ignored(NewLine))))),
    function(arr) {
        return new el.LinkDef(arr[0], arr[2]);
    });

var BlockQuote = action(
    indented(seq(ch('>'),
                 choice(seq(Bracketed, opt(Bracketed)),
                        WS),
                 trimRight(joined(rep1(ws(WholeLine)))))),
    function(arr) {
        var cite = arr[1][1][0],
            ref = arr[1][1][1];
        if (cite) cite = cite.trim();
        if (ref) ref = ref.trim();
        return new el.BlockQuote(arr[0], arr[1][2],
                                 cite, ref);
    });

var HTML = action(indented(seq(between('<html>',
                                       joined(rep0(but(token('</html>')))),
                                       '</html>'),
                               opt(NewLine))),
                  function(arr) {
                      return new el.HTML(arr[0], arr[1][0]);
                  });


var Question = action(
    seq(count(rep0(ch(' '))),
        ignored('Q'),
        opt(seq(Bracketed, Bracketed)),
        ignored(': '),
        ws(Paragraph)),
    function(arr) {
        return new el.Question(arr[0], arr[2].text, arr[1][0], arr[1][1]);
    });

var Answer = action(
    indented(
        seq(ignored('A: '),
            action(rep1(choice(Title,
                               CodeBlock,
                               List,
                               BlankLine,
                               function(p) {
                                   // To break to recursion
                                   return QA(p);
                               },
                               LinkDef,
                               BlockQuote,
                               HTML,
                               Paragraph)),
                   function(arr) {
                       return filter(arr, function(x) {
                           return x !== null;
                       });
                   }))),
    function(arr) {
        return new el.Answer(arr[0], arr[1][0]);
    });

function filter(arr, pred) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        var elem = arr[i];
        if (pred(elem)) newArr.push(elem);
    }
    return newArr;
}

var QA = action(seq(Question,
                    BlankLines,
                    Answer),
                function(arr) {
                    return new el.QA(arr[0].indent, arr[0], arr[1]);
                });

var Page = action(
    rep1(choice(QA, Title, CodeBlock, List, BlankLines, LinkDef,
                BlockQuote, HTML, Paragraph)),
    function(arr) {
        return new el.Page(filter(arr, function(x) {
            return x !== null;
        }));
    });


function parse(parser, str) {
    return parser(ps(str));
}

exports = {
    NewLine: NewLine,
    ButNewLine: ButNewLine,
    TillEOL: TillEOL,
    WholeLine: WholeLine,
    Paragraph: Paragraph,
    BlankLine: BlankLine,
    BlankLines: BlankLines,
    Title: Title,
    CodeBlock: CodeBlock,
    ListItem: ListItem,
    List: List,
    LinkDef: LinkDef,
    BlockQuote: BlockQuote,
    HTML: HTML,
    Question: Question,
    Answer: Answer,
    QA: QA,
    Page: Page,
    parse: parse
};

module.exports = exports;
