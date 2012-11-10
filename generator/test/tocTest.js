var refs = require('../lib/refs.js'),
    toRoman = refs.toRoman,
    tocToHTML = refs.tocToHTML;

exports.testToRoman = function(test) {
    var nums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
                'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII',
                'XVIII', 'XIX', 'XX'];
    for (var i = 0; i < nums.length; i++) {
        test.equal(toRoman(i + 1), nums[i]);
    }
    test.done();
};

exports.testTocToHTML = function(test) {
    var toc1 = {
        '1': [ 'I.', 'Bla' ],
        '1,1': [ 'I.1.', 'Foo Bar' ],
        '1,1,1': [ 'I.1.1.', 'Baz' ],
        '1,1,2': [ 'I.1.2.', 'It\'s' ],
        '1,2': [ 'I.2.', 'Car' ],
        '1,2,1': [ 'I.2.1.', 'Foo' ],
        '1,2,1,1': [ 'I.2.1.1.', 'Bar' ],
        '1,3': [ 'I.3.', 'Bar Bar' ]
    };
    var html1 = '<li><a href="#bla">Bla</a>\n'
            + '<ol>\n'
            + '<li><a href="#foo-bar">Foo Bar</a>\n'
            + '<ol>\n'
            + '<li><a href="#baz">Baz</a></li>\n'
            + '<li><a href="#it-s">It\'s</a></li>\n'
            + '</ol>\n'
            + '</li>\n'
            + '<li><a href="#car">Car</a>\n'
            + '<ol>\n'
            + '<li><a href="#foo">Foo</a>\n'
            + '<ol>\n'
            + '<li><a href="#bar">Bar</a></li>\n'
            + '</ol>\n'
            + '</li>\n'
            + '</ol>\n'
            + '</li>\n'
            + '<li><a href="#bar-bar">Bar Bar</a></li>\n'
            + '</ol>\n'
            + '</li>\n';
    test.equal(tocToHTML(toc1), html1);

    var toc2 = {
        '1': [ 'I.', 'Bla' ],
        '1,1': [ 'I.1.', 'Foo Bar' ],
        '1,1,1': [ 'I.1.1.', 'Baz' ],
        '1,1,1,1': [ 'I.1.1.1.', 'Bar' ]
    };
    var html2 = '<li><a href="#bla">Bla</a>\n'
            + '<ol>\n'
            + '<li><a href="#foo-bar">Foo Bar</a>\n'
            + '<ol>\n'
            + '<li><a href="#baz">Baz</a>\n'
            + '<ol>\n'
            + '<li><a href="#bar">Bar</a></li>\n'
            + '</ol>\n'
            + '</li>\n'
            + '</ol>\n'
            + '</li>\n'
            + '</ol>\n'
            + '</li>\n';
    test.equal(tocToHTML(toc2), html2);
    test.done();
};
