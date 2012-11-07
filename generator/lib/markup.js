
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
        // .replace(/\*\b([^*]+)\b\*/g, '<strong>$1</strong>')
        .replace(/(?:^|(\s))\/\b([^\*]+)\b\*/g, '$1<strong>$2</strong>')
        .replace(/\*\b([^\*]+)\b\*(?:(\s)|$)/g, '<strong>$1</strong>$2')
        .replace(/(?:^|(\s))\/\b([^\/]+)\b\//g, '$1<emph>$2</emph>')
        .replace(/\/\b([^\/]+)\b\/(?:(\s)|$)/g, '<emph>$1</emph>$2')
        .replace(/(\w)'(\w)/g, '$1&rsquo;$2')
        .replace(/'\b/g, '&lsquo;')
        .replace(/'/g, '&rsquo;')
        .replace(/"\b/g, '&ldquo;')
        .replace(/"/g, '&rdquo;')
        .replace(/\.{3}/g, '&hellip;')
        .replace(/<foot>(.+?)<\/foot>/g, '<span class="footnote">$1</span>');
};
