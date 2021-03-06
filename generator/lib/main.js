var parser = require('./parser.js'),
    markup = require('./markup.js').markup,
    refs = require('./refs.js'),
    bib = require('./bibliography.js'),
    fs = require('fs');

function processChapter(name, tableOfContents, tocLevels, references, links) {
    var contents = fs.readFileSync('../doc/' + name, 'utf8');
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
function fillInRefs(chapter, references, bibIndex, links) {
    // Fill in the references
    var withRefs = chapter.transform(refs.fillInReferences(references, bibIndex));
    // Fill in the links
    var withLinks = withRefs.transform(refs.fillInLinks(links, references));
    // Fill in the block quotes
    withLinks.traverse(refs.fillInBlockQuoteRefs(links, bibIndex));
}


var chaptersNames = fs.readdirSync('../doc').sort(),
    tableOfContents = {},
    tocLevels = refs.emptyTocLevels(),
    references = {},
    links = {},
    bibliography = bib.makeBibliography(),
    bibIndex = bib.makeBibIndex(bibliography),
    template = fs.readFileSync('../template.html', 'utf8'),
    chapters = chaptersNames.map(function(chapter) {
        return processChapter(chapter, tableOfContents, tocLevels,
                           references, links);
        });

chapters.forEach(function(chapter) {
    fillInRefs(chapter, references, bibIndex, links);
});

var html = chapters.map(function(chapter, index) {
    if (index == 0) {
        return chapter.toHTML();
    } else {
        return '<div class="chapter" id="chapter-' + index + '">' +
            chapter.toHTML() + '</div>';
    }
});

fs.writeFile('../index.html', template
             .replace('<!--PREFACE-->', html[0])
             .replace('<!--BODY-->', html.slice(1).join('\n'))
             .replace('<!--TOC-->', refs.tocToHTML(tableOfContents))
             .replace('<!--BIB-->', bib.toHTML(bibliography)),
             function(err) {
                 if (err) {
                     console.log(err);
                 } else {
                     console.log('File saved');
                 }
             });
