var parser = require('../lib/parser.js'),
    jsparse = require('../lib/jsparse.js');

function parses(test, p, input, ast) {
    var output = parser.parse(p, input);
    test.ok(output);
    test.deepEqual(output.ast, ast);
}
function doesntParse(test, p, input) {
    var output = parser.parse(p, input);
    test.equal(output, false);
}

exports.testNewLine = function(test) {
    parses(test, parser.NewLine, '\n', ' ');
    parses(test, parser.NewLine, '\r\n', ' ');
    doesntParse(test, parser.NewLine, ' ');
    doesntParse(test, parser.NewLine, 'ab');
    doesntParse(test, parser.NewLine, 'ab\n');
    test.done();
};

exports.testButNewLine = function(test) {
    parses(test, parser.ButNewLine, 'b', 'b');
    parses(test, parser.ButNewLine, 'bl', 'b');
    doesntParse(test, parser.ButNewLine, '\n');
    test.done();
};

exports.testTillEOL = function(test) {
    parses(test, parser.TillEOL, 'bla', 'bla');
    parses(test, parser.TillEOL, 'bla\n', 'bla');
    parses(test,
           jsparse.sequence(parser.TillEOL, parser.NewLine),
           'bla\n', ['bla', ' ']);
    doesntParse(test, parser.TillEOL, '\n');
    test.done();
};

exports.testWholeLine = function(test) {
    parses(test, parser.WholeLine, 'bla\n', 'bla ');
    doesntParse(test, parser.WholeLine, 'bla');
    doesntParse(test, parser.WholeLine, '\n');
    test.done();
};

exports.testParagraph = function(test) {
    parses(test, parser.Paragraph, 'bla\ndi\nbla\n',
           {indent: 0, text: 'bla di bla'});
    parses(test, parser.Paragraph,
           '1 bla di\n2 di bla\n3 bla di\n',
           {indent: 0, text: '1 bla di 2 di bla 3 bla di'});
    doesntParse(test, parser.Paragraph, 'bla di bla');
    doesntParse(test, parser.Paragraph, '\n');
    test.done();
};

exports.testBlankLine = function(test) {
    parses(test, parser.BlankLine, '\n', null);
    parses(test, parser.BlankLine, '   \n', null);
    doesntParse(test, parser.BlankLine, '  ');
    doesntParse(test, parser.BlankLine, 'bla\n');
    test.done();
};

exports.testBlankLines = function(test) {
    parses(test, parser.BlankLines, '\n', null);
    parses(test, parser.BlankLines, '   \n', null);
    parses(test, parser.BlankLines, '  \n  \n\n', null);
    doesntParse(test, parser.BlankLines, 'bla');
    test.done();
};

exports.testTitle = function(test) {
    parses(test, parser.Title, '# Bla #\n',
           {indent: 0, level: 1, text:'Bla'});
    parses(test, parser.Title, '# Bla #[bla]\n',
           {indent: 0, level: 1, text:'Bla',
            label: 'bla'});
    parses(test, parser.Title, '     # Bla #\n',
           {indent: 5, level: 1, text: 'Bla'});
    parses(test, parser.Title, '## Bla di ##\n',
           {indent: 0, level: 2, text: 'Bla di'});
    parses(test, parser.Title, '# Bla di ##\n',
           {indent: 0, level: 1, text: 'Bla di'});
    parses(test, jsparse.sequence(parser.Title, parser.Title),
           '# Bla #\n  ## Di ##\n',
           [{indent: 0, level: 1, text: 'Bla'},
            {indent: 2, level: 2, text: 'Di'}]);
    parses(test, jsparse.sequence(parser.Title, parser.Title),
           '# Bla #[a]\n  ## Di ##[b]\n',
           [{indent: 0, level: 1, text: 'Bla', label: 'a'},
            {indent: 2, level: 2, text: 'Di', label: 'b'}]);
    doesntParse(test, parser.Title, '# Bla\n');
    doesntParse(test, parser.Title, '# Bla #');
    doesntParse(test, parser.Title, '# Bla\nDi #');
    doesntParse(test, parser.Title, 'Bla #\n');
    doesntParse(test, parser.Title, 'bla');
    doesntParse(test, parser.Title, '\n');
    test.done();
};

exports.testCodeBlock = function(test) {
    parses(test, parser.CodeBlock,
           '```JavaScript\nBla di bla\n```',
           {indent: 0, lang: 'JavaScript',
            code: 'Bla di bla'});
    var code1 = '    ```JavaScript\n'
            + '    function(x) {\n'
            + '        return x;\n'
            + '    }\n'
            + '    ```';
    var ast1 = {indent: 4,
                lang: 'JavaScript',
                code:
                'function(x) {\n'
                + '    return x;\n'
                + '}'};
    parses(test, parser.CodeBlock, code1, ast1);
    parses(test, parser.CodeBlock, '```JavaScript\nBla```',
           {indent: 0, lang: 'JavaScript', code: 'Bla'});
    doesntParse(test, parser.CodeBlock, '```JavaScript\nBla');
    doesntParse(test, parser.CodeBlock, '```\nBla\n```');
    test.done();
};


exports.testListItem = function(test) {
    parses(test, parser.ListItem, '* Alpha Beta Gamma\n',
           'Alpha Beta Gamma');
    parses(test, parser.ListItem, '* Alpha\nBeta\n',
           'Alpha Beta');
    parses(test, parser.ListItem, '* Alpha\n  Beta\n',
           'Alpha Beta');
    parses(test, parser.ListItem, '  * Alpha\n  Beta\n',
           'Alpha Beta');
    parses(test, parser.ListItem, '  * Alpha\n    Beta\n',
           'Alpha Beta');
    parses(test, parser.ListItem, '  * A\n  B\n  C\n  D\n',
           'A B C D');
    parses(test, parser.ListItem, '* A\n B\n\n C\n',
           'A B');
    doesntParse(test, parser.ListItem, '*\n');
    doesntParse(test, parser.ListItem, 'bla * di');
    doesntParse(test, parser.ListItem, 'bla\n');
    test.done();
};


exports.testList = function(test) {
    parses(test, parser.List, ' * Alpha\n * Beta\n * Gamma\n',
           {indent: 1, items: ['Alpha', 'Beta', 'Gamma']});
    parses(test, parser.List,
           '* Alpha\n  Golf\n* Beta\n  Delta\n Echo\n',
           {indent: 0, items: ['Alpha Golf', 'Beta Delta Echo']});
    doesntParse(test, parser.List, '*\n');
    doesntParse(test, parser.List, 'bla * di');
    doesntParse(test, parser.List, 'bla\n');
    test.done();
};

exports.testLinkDef = function(test) {
    parses(test, parser.LinkDef,
           '[lisp2]: '
           + 'http://the.url/Lisp-1_vs._Lisp-2\n',
           {label: 'lisp2',
            url: 'http://the.url/Lisp-1_vs._Lisp-2'});
    parses(test, parser.LinkDef,
           '     [foobar]: '
           + 'http://the.url/Lisp-1_vs._Lisp-2\n',
           {label: 'foobar',
            url: 'http://the.url/Lisp-1_vs._Lisp-2'});
    doesntParse(test, parser.LinkDef, '[foobar]:\n');
    doesntParse(test, parser.LinkDef, '[foobar]:  \n');
    doesntParse(test, parser.LinkDef, '[foobar]:  bla\n');
    test.done();
}

exports.testQuestion = function(test) {
    parses(test, parser.Question, 'Q: Bladibla\n',
           {indent: 0, text: 'Bladibla'});
    parses(test, parser.Question,
           'Q: Bladibla\nJos\n',
           {indent: 0, text: 'Bladibla Jos'});
    parses(test, parser.Question,
           ' Q: Bladibla\nJos\n',
           {indent: 1, text: 'Bladibla Jos'});
    parses(test, parser.Question,
           '     Q: Bladibla\nJos\n',
           {indent: 5, text: 'Bladibla Jos'});
    doesntParse(test, parser.Question, 'Q: Foo');
    doesntParse(test, parser.Question, 'Q:Foo');
    test.done();
};



exports.testAnswer = function(test) {
    parses(test, parser.Answer, 'A: Bladibla\n',
           {indent: 0,
            contents: [{indent: 3, text: 'Bladibla'}]});
    parses(test, parser.Answer,
           'A: Foo\n   Foo\n\n   Bar\n',
           {indent: 0,
            contents: [{indent: 3, text: 'Foo Foo'},
                       {indent: 3, text: 'Bar'}]});
    parses(test, parser.Answer,
           'A: # Bla #\n\n   Foo\n   Bar\n',
           {indent: 0,
            contents: [{indent: 3, level: 1, text: 'Bla'},
                       {indent: 3, text: 'Foo Bar'}]});
    parses(test, parser.Answer,
           '   A: # Bla #\n\n'
           + '      Foo\n\n      * Bar\n      * Baz\n\n',
           {indent: 3,
            contents: [{indent: 6, level: 1, text: 'Bla'},
                       {indent: 6, text: 'Foo'},
                       {indent: 6, items:
                        ['Bar', 'Baz']}]});
    var answ1 = 'A: Alpha\n'
            + '   Beta\n'
            + '   Gamma\n'
            + '\n'
            + '   Q: Delta?\n'
            + '\n'
            + '   A: Foo\n'
            + '      Bar\n'
            + '\n'
            + '   Bravo'
            + '\n';
    parses(test, parser.Answer,
           answ1,
           {indent: 0,
            contents:
            [{indent: 3, text: 'Alpha Beta Gamma'},
             {indent: 3,
              question: {indent: 3, text: 'Delta?'},
              answer: {indent: 3,
                       contents:
                       [{indent: 6, text: 'Foo Bar'},
                       {indent: 3, text: 'Bravo'}]}}]});
    doesntParse(test, parser.Answer, 'A: Foo');
    doesntParse(test, parser.Answer, 'A:Foo\n');
    test.done();
};

exports.testPage = function(test) {
    parses(test, parser.Page,
           '# Bla #\n\nBla\nDi\n\nQ: Bladibla\n\nA: Bla\n\n',
           {contents:
            [{indent: 0, level: 1, text: 'Bla'},
             {indent: 0, text: 'Bla Di'},
             {indent: 0,
              question:
              {indent: 0, text: 'Bladibla'},
              answer:
              {indent: 0,
               contents: [{indent: 3, text: 'Bla'}]}}]});
    parses(test, parser.Page,
           'Q: Q1\n\nA: A1\n\n   Q: Q1a\n\n   A: A1a\n\nQ: Q2\n\nA:'
           + ' A2\n\n',
           {contents:
            [{indent: 0,
              question: {indent: 0, text: 'Q1'},
              answer: {indent: 0,
                       contents: [{indent: 3, text: 'A1'},
                                  {indent: 3,
                                   question: {indent: 3, text: 'Q1a'},
                                   answer: {indent: 3,
                                            contents: [{indent: 6,
                                                        text:
                                                        'A1a'}]}}]}},
             {indent: 0,
              question: {indent: 0, text: 'Q2'},
              answer: {indent: 0, contents: [{indent: 3, text: 'A2'}]}}]});
    test.done();
};
