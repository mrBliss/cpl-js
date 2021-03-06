/**
 Markdown like syntax, but not for lists or paragraphs.
 Currently supported:

   * `code`
   * /italic/
   * *bold*
   * 'proper quotes'
   * "proper double quotes"
   * ... (&hellip;)
   * <foot>Foo bar</foot> -- "For bar" will be a footnote
   * C~Compiler -- a non-breaking space

 Not done by `markup`, but also available:

   * > Block quoting
     can continue over multiple lines

     >[Source][lbl] You can also add the source of the quote.
     > Provide a link definition for it.

   * <html>inline html</html> -- HTML code that will not be touched,
                                 can span multiple lines.

   * #[lbl] -- a reference to the title with label `lbl` or to a
     bibliography item.
   * [text][lbl] -- a link with `text` as text to click on. The url to
     go to is determined by an accompanying link definition. Link
     definitions must be put in a separate paragraph, this unclutters
     the text and improves the reading experience. Instead of
     providing a label, you can also put the URL between the second
     pair of brackets: [text][http://...] When the contents of the
     second start with 'http', it will be treated as a URL, otherwise
     it will be treated as a label.

     Example:

     Bla di bla [here][google] la. Foo [there][reddit].

     [here]: http://www.google.com
     [reddit]: http://www.reddit.com

*/

exports.markup = function(s) {
    return s.replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/(?:^|(\s))\*\b([^\*]+)\b\*/g, '$1<strong>$2</strong>')
        .replace(/\*\b([^\*]+)\b\*(?:(\s)|$)/g, '<strong>$1</strong>$2')
        .replace(/(?:^|(\s))\/\b([^\/]+)\b\//g, '$1<em>$2</em>')
        .replace(/\/\b([^\/]+)\b\/(?:(\s|:)|$)/g, '<em>$1</em>$2')
        .replace(/(\w|>|\+)'(\w)/g, '$1&rsquo;$2')
        .replace(/'\b/g, '&lsquo;')
        .replace(/'/g, '&rsquo;')
        .replace(/"\b/g, '&ldquo;')
        .replace(/"/g, '&rdquo;')
    // a fix
        .replace(/&lsquo;([0-9]0s)/, '&rsquo;$1')
    // a fix
        .replace(/<code>&rdquo;&rdquo;<\/code>/g, '<code>""</code>')
    // a fix
        .replace(/<code>&rsquo;&rsquo;<\/code>/g, "<code>''</code>")
        .replace(/\.{3}/g, '&hellip;')
        .replace(/~/g, '&nbsp;')
        .replace(/<foot>(.+?)<\/foot>/g,
                 '<span class="footnote">$1</span>');
};
