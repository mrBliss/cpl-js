var parser = require('./parser.js'),
    markup = require('./markup.js').markup,
    toc = require('./toc.js'),
    bib = require('./bibliography.js'),
    fs = require('fs');

// console.log(parser.parse(parser.Page, fs.readFileSync('../semantics.txt', 'utf8')).ast);
// parser.parse(parser.Page, fs.readFileSync('../semantics.txt',
//                                           'utf8')).ast

var bibliography = bib.makeBibliography();
var str = fs.readFileSync('../semantics.txt', 'utf8');
var parsed = parser.parse(parser.Page, str);
if (parsed) {
    var ast = parsed.ast,
        tableOfContents = {},
        labels = {};
    ast.traverse(toc.tocBuilder(tableOfContents));
    ast.traverse(toc.labelCollector(labels));
    var markedUp = ast.transform(markup);
    var withRefs = markedUp.transform(toc.fillInReferences(labels));
    var html = withRefs.toHTML();
    var template = fs.readFileSync('../template.html', 'utf8');
    fs.writeFile('../index.html', template
                 .replace('<!--BODY-->', html)
                 .replace('<!--TOC-->', toc.toHTML(tableOfContents))
                 .replace('<!--BIB-->', bibliography),
                 function(err) {
                     if (err) {
                         console.log(err);
                     } else {
                         console.log('File saved');
                         }
                 });
} else {
    console.log('Parse error');
}

// console.log(parser.parse(parser.Page, fs.readFileSync('test.txt', 'utf8')).ast.toHTML());
