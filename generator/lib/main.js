var parser = require('./parser.js'),
    markup = require('./markup.js').markup,
    refs = require('./refs.js'),
    bib = require('./bibliography.js'),
    fs = require('fs');

function processPage(name, tableOfContents, tocLevels, references, links, bibIndex) {
    var contents = fs.readFileSync('../' + name + '.txt', 'utf8');
    var parsed = parser.parse(parser.Page, contents);
    if (parsed) {
        var ast = parsed.ast;
        // Add the titles to the table of contents
        ast.traverse(refs.tocBuilder(tableOfContents, tocLevels));
        // Add the labels (from links and titles) to the list of references
        ast.traverse(refs.labelCollector(references, links));
        // Convert pseudo-markdown to HTML
        var markedUp = ast.transform(markup);
        // Fill in the references
        var withRefs = markedUp.transform(refs.fillInReferences(references, bibIndex));
        // Fill in the links
        var withLinks = withRefs.transform(refs.fillInLinks(links));
        // Fill in the block quotes
        withLinks.traverse(refs.fillInBlockQuoteRefs(links, bibIndex));
        // Convert to HTML
        return withLinks.toHTML();
    } else {
        console.log('ERROR: Couldn\'t parse the ' + name);
        return '';
    }
}

var pages = ['qa-semantics', 'qa-pragmatics'],
    tableOfContents = {},
    tocLevels = refs.emptyTocLevels(),
    references = {},
    links = {},
    bibliography = bib.makeBibliography(),
    bibIndex = bib.makeBibIndex(bibliography),
    template = fs.readFileSync('../template.html', 'utf8'),
    html = pages.map(function(page) {
        return processPage(page, tableOfContents, tocLevels,
                           references, links, bibIndex);
        }).join('\n');

fs.writeFile('../index.html', template
             .replace('<!--BODY-->', html)
             .replace('<!--TOC-->', refs.tocToHTML(tableOfContents))
             .replace('<!--BIB-->', bib.toHTML(bibliography)),
             function(err) {
                 if (err) {
                     console.log(err);
                 } else {
                     console.log('File saved');
                 }
             });
