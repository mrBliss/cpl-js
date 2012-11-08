// Markdown like syntax, but not for lists or paragraphs.
// Currently supported:
// * `code`
// * /italic/
// * *bold*
// * 'proper quotes'
// * "proper double quotes"
// * ... (&hellip;)
// * <foot>Foo bar</foot> -- "For bar" will be a footnote
//
// Not done by `markup`, but also available:
// * > Block quoting
//   can continue over multiple lines
//
//   >[Source][url] You can also add the source of the quote.
//   > Provide a link definition for it.
//
// * <html>inline html</html> -- HTML code that will not be touched,
//                               can span multiple lines.
//
// * #[lbl] -- a reference to the title with label `lbl`
// * [text][lbl] -- a link with `text` as text to click on. The url to
// go to is determined by an accompanying link definition.
// Link definitions must be put in a separate paragraph, this
// unclutters the text and improves the reading experience.
//
// Example:
//
// Bla di bla [here][google] la. Foo [there][reddit].
//
// [here]: http://www.google.com
// [reddit]: http://www.reddit.com
//

exports.markup = function(s) {
    return s.replace(/`([^`]+)`/g, '<code>$1</code>')
        // .replace(/\*\b([^*]+)\b\*/g, '<strong>$1</strong>')
        .replace(/(?:^|(\s))\*\b([^\*]+)\b\*/g, '$1<strong>$2</strong>')
        .replace(/\*\b([^\*]+)\b\*(?:(\s)|$)/g, '<strong>$1</strong>$2')
        .replace(/(?:^|(\s))\/\b([^\/]+)\b\//g, '$1<em>$2</em>')
        .replace(/\/\b([^\/]+)\b\/(?:(\s|:)|$)/g, '<em>$1</em>$2')
        .replace(/(\w|>)'(\w)/g, '$1&rsquo;$2')
        .replace(/'\b/g, '&lsquo;')
        .replace(/'/g, '&rsquo;')
        .replace(/"\b/g, '&ldquo;')
        .replace(/"/g, '&rdquo;')
    // fix
        .replace(/<code>&rdquo;&rdquo;<\/code>/g, '<code>""</code>')
    // fix
        .replace(/<code>&rsquo;&rsquo;<\/code>/g, "<code>''</code>")
        .replace(/\.{3}/g, '&hellip;')
        .replace(/<foot>(.+?)<\/foot>/g,
                 '<span class="footnote">$1</span>');
};
