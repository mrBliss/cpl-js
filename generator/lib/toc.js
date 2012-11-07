exports.toRoman = function(n) {
    // Source: http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
    if (n <= 0)
        return n;
    else {
        var lookup = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
                      L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1},
            roman = '';
        for (var i in lookup) {
            while (n >= lookup[i]) {
                roman += i;
                n -= lookup[i];
            }
        }
        return roman;
    }
};

exports.tocTraverser = function(toc) {
    var levels = [0, 0, 0, 0, 0, 0];
    function numberString() {
        var s = exports.toRoman(levels[0]) + '.';
        for (var i = 1; i < levels.length; i++) {
            if (levels[i] == 0) break;
            s += levels[i] + '.';
        }
        return s;
    }
    return (function(elem) {
        if (elem.level) {
            levels[elem.level - 1]++;
            for (var i = elem.level; i < levels.length; i++) {
                levels[i] = 0;
            }
            elem.number = numberString();
            var key = [];
            for (var j = 0; j < levels.length; j++) {
                if (levels[j] == 0) break;
                key.push(levels[j]);
            }
            toc[key] = [elem.number, elem.text];
        }
    });
};
exports.toHTML = function(toc) {
    var html = '';
    var prevLevel = 1, level;
    for (var k in toc) {
        var t = toc[k];
        level = k.split(',').length;
        if (prevLevel < level && html != '') {
            html += '\n<ol>\n';
        } else if (prevLevel > level) {
            html += '</li>\n</ol>\n</li>\n';
            for (var i = prevLevel - level; i > 1; i--) {
                html += '</ol>\n</li>\n';
            }
        } else if (prevLevel == level && html != '') {
            html += '</li>\n';
        }
        var anchor = t[1].toLowerCase()
                .replace(/[^a-z0-9-]|\s/g, '-');
        html += '<li><a href="#' + anchor +'">' + t[1] + '</a>';
        prevLevel = level;
    };
    html += '</li>\n</ol>\n</li>\n';
    for (i = level; i > 2; i--) {
        html += '</ol>\n</li>\n';
    }
    return html;
};
