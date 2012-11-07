var parser = require('./parser.js'),
    markup = require('./markup.js').markup,
    toc = require('./toc.js'),
    fs = require('fs');

// console.log(parser.parse(parser.Page, fs.readFileSync('../semantics.txt', 'utf8')).ast);
// parser.parse(parser.Page, fs.readFileSync('../semantics.txt',
//                                           'utf8')).ast


var str = fs.readFileSync('../semantics.txt', 'utf8');
var parsed = parser.parse(parser.Page, str);
if (parsed) {
    var markedUp = parsed.ast.transform(markup),
        tableOfContents = {};
    markedUp.traverse(toc.tocTraverser(tableOfContents));
    var html = markedUp.toHTML();
    var template = fs.readFileSync('../template.html', 'utf8');
    fs.writeFile('../index.html', template
                 .replace('<!--BODY-->', html)
                 .replace('<!--TOC-->', toc.toHTML(tableOfContents)),
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
