var parser = require('./parser.js'),
    markup = require('./markup.js').markup,
    toc = require('./toc.js'),
    bib = require('./bibliography.js'),
    fs = require('fs');

// console.log(parser.parse(parser.Page, fs.readFileSync('../semantics.txt', 'utf8')).ast);
// parser.parse(parser.Page, fs.readFileSync('../semantics.txt',
//                                           'utf8')).ast

var bibliography = bib.makeBibliography();
var bibIndex = bib.makeBibIndex(bibliography);
var bibHTML = bib.toHTML(bibliography);
var str = fs.readFileSync('../semantics.txt', 'utf8');
var parsed = parser.parse(parser.Page, str);
if (parsed) {
    var ast = parsed.ast,
        tableOfContents = {},
        refs = {},
        links = {};
    ast.traverse(toc.tocBuilder(tableOfContents));
    ast.traverse(toc.labelCollector(refs, links));
    var markedUp = ast.transform(markup);
    var withRefs = markedUp.transform(toc.fillInReferences(refs, bibIndex));
    var withLinks = withRefs.transform(toc.fillInLinks(links));
    withRefs.traverse(toc.fillInBlockQuoteRefs(links, bibIndex));
    var html = withLinks.toHTML();
    var template = fs.readFileSync('../template.html', 'utf8');
    fs.writeFile('../index.html', template
                 .replace('<!--BODY-->', html)
                 .replace('<!--TOC-->', toc.toHTML(tableOfContents))
                 .replace('<!--BIB-->', bibHTML),
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
