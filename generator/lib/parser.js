// token, ch, range, whitespace, action, join_action, negate, end_p,
// nothing_p, sequence, wsequence, choice, butnot, difference, xor,
// repeat0, repeat1, optional,
var jp = require('./jsparse.js'),
    ch = jp.ch, action = jp.action, join_action = jp.join_action,
    seq = jp.sequence, token = jp.token, but = jp.negate,
    rep0 = jp.repeat0, rep1 = jp.repeat1, choice = jp.choice,
    opt = jp.optional, diff = jp.difference, and = jp.and,
    not = jp.not, ps = jp.ps,
    el = require('./elements.js');


function joined(p) {
    return join_action(p, '');
}
function ignored(p) {
    return action(p, function() {
        return null;
    });
}
function count(p) {
    return action(p, function(xs) {
        return xs.length;
    });
}
function between(startStr, p, endStr) {
    return action(seq(token(startStr), p, token(endStr)),
                  function(arr) {
                      return arr[1];
                  });
}

// Expects the parser to return a string
function trimLeft(p) {
    return action(p, function(s) {
        return s.replace(/^ +/, '');
    });
}
// Expects the parser to return a string
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
// var Paragraph = trimRight(joined(rep1(ws(WholeLine))));
var Paragraph = action(
    indented(trimRight(joined(rep1(ws(WholeLine))))),
    function(arr) {
        return new el.Paragraph(arr[0], arr[1]);
    });

var BlankLine = ignored(ws(NewLine));
var BlankLines = ignored(rep1(BlankLine));
var Title = action(
    indented(seq(
        count(rep1(ch('#'))),
        ws(trimRight(joined(rep1(but(ch('#')))))),
        ignored(rep1(ch('#'))),
        opt(between('[', joined(rep1(but(ch(']')))), ']')),
        ignored(NewLine))),
    function(arr) {
        return new el.Title(arr[0], arr[1][0], arr[1][1], arr[1][2]);
    });


var CodeBlock = action(
    seq(opt(WS),
        between('```',
                seq(TillEOL, NewLine, joined(rep1(but(token('```'))))),
                '```')),
    function(arr) {
        var indentRE = new RegExp('^' + (arr[0] ? arr[0].join('') : ''));
        var lang = arr[1][0];
        var code = arr[1][2];
        return new el.CodeBlock(
            arr[0] ? arr[0].length : 0,
            lang,
            code.split(/\r?\n/).map(function(line) {
                return line.replace(indentRE, '');
            }).join('\n').replace(/\r?\n$/, ''));
    });


var ListItem = action(
    seq(ignored(ws(ch('*'))),
        ws(WholeLine),
        rep0(ws(seq(but(choice(NewLine, ch('*'))),
                    ws(joined(seq(joined(rep0(ButNewLine)),
                                  ignored(NewLine)))))))),
    function(arr) {
        if (arr[1] && arr[1].length > 0) {
            var lines = arr[1].map(function(l) {
                return l[0] + l[1];
            });
            lines.unshift(arr[0].replace(/\s$/, ''));
            return lines.join(' ').replace(/\s+$/, '');
        } else {
            return arr[0].replace(/\s+$/, '');
        }
    });

var List = action(indented(rep1(ListItem)),
                  function(arr) {
                      return new el.List(arr[0], arr[1]);
                  });

var Question = action(
    seq(count(rep0(ch(' '))),
        ignored('Q: '),
        ws(Paragraph)),
    function(arr) {
        return new el.Question(arr[0], arr[1].text);
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
    rep1(choice(QA, Title, CodeBlock, Paragraph, BlankLines)),
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
    Question: Question,
    Answer: Answer,
    QA: QA,
    Page: Page,
    parse: parse
};

module.exports = exports;
