var parser = require('./parser.js'),
    markup = require('./markup.js').markup,
    refs = require('./refs.js'),
    bib = require('./bibliography.js'),
    fs = require('fs');

function processPage(name, tableOfContents, tocLevels, references, links) {
    var contents = fs.readFileSync('../' + name + '.txt', 'utf8');
    var parsed = parser.parse(parser.Page, contents);
    if (parsed) {
        var ast = parsed.ast;
        // Add the titles to the table of contents
        ast.traverse(refs.tocBuilder(tableOfContents, tocLevels));
        // Add the labels (from links and titles) to the list of references
        ast.traverse(refs.labelCollector(references, links));
        // Convert pseudo-markdown to HTML
        return ast.transform(markup);
    } else {
        console.log('ERROR: Couldn\'t parse the ' + name);
        return '';
    }
}
function fillInRefs(page, references, bibIndex, links) {
    // Fill in the references
    var withRefs = page.transform(refs.fillInReferences(references, bibIndex));
    // Fill in the links
    var withLinks = withRefs.transform(refs.fillInLinks(links, references));
    // Fill in the block quotes
    withLinks.traverse(refs.fillInBlockQuoteRefs(links, bibIndex));
}


var pagesNames = ['qa-history', 'qa-syntax', 'qa-semantics', 'qa-pragmatics'],
    tableOfContents = {},
    tocLevels = refs.emptyTocLevels(),
    references = {},
    links = {},
    bibliography = bib.makeBibliography(),
    bibIndex = bib.makeBibIndex(bibliography),
    template = fs.readFileSync('../template.html', 'utf8'),
    pages = pagesNames.map(function(page) {
        return processPage(page, tableOfContents, tocLevels,
                           references, links);
        });

pages.forEach(function(page) {
    fillInRefs(page, references, bibIndex, links);
});


fs.writeFile('../index.html', template
             .replace('<!--BODY-->', pages.map(function(page) {
                 return page.toHTML();
             }).join('\n'))
             .replace('<!--TOC-->', refs.tocToHTML(tableOfContents))
             .replace('<!--BIB-->', bib.toHTML(bibliography)),
             function(err) {
                 if (err) {
                     console.log(err);
                 } else {
                     console.log('File saved');
                 }
             });
