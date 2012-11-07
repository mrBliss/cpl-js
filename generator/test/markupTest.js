var m = require('../lib/markup.js').markup;


exports.testMarkup = function(test) {
    test.equal(m('`code`'), '<code>code</code>');
    test.equal(m('/italic/'), '<emph>italic</emph>');
    test.equal(m('foo and/or bla di or/and bar'),
               'foo and/or bla di or/and bar');
    test.equal(m('*bold*'), '<strong>bold</strong>');
    test.equal(m('5*3 + 2*1 = 3'), '5*3 + 2*1 = 3');
    test.equal(m("'proper quotes'"), '&lsquo;proper quotes&rsquo;');
    test.equal(m("it's today"), 'it&rsquo;s today');
    test.equal(m("chris' bday"), 'chris&rsquo; bday');
    test.equal(m('"proper double quotes"'), '&ldquo;proper double quotes&rdquo;');
    test.equal(m('...'), '&hellip;');
    test.equal(m('Bla <foot>Bar Baz</foot>'),
               'Bla <span class="footnote">Bar Baz</span>');
    test.done();
};
