
// Markdown like syntax, but not for lists or paragraphs.
// Currently supported:
// * `code`
// * /italic/
// * *bold*
// * 'proper quotes'
// * "proper double quotes"
// * ... (&hellip;)

exports.markup = function(s) {
    return s.replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\b([^*]+)\b\*/g, '<strong>$1</strong>')
        .replace(/\/\b([^\/]+)\b\//g, ' <emph>$1</emph> ')
        .replace(/'\b/g, '&lsquo;')
        .replace(/'/g, '&rsquo;')
        .replace(/"\b/g, '&ldquo;')
        .replace(/"/g, '&rdquo;')
        .replace(/\.{3}/g, '&hellip;');
};
