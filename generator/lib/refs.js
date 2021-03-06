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

exports.emptyTocLevels = function () {
    return [0, 0, 0, 0, 0, 0];
}

exports.tocBuilder = function(toc, levels) {
    function numberString() {
        var s = exports.toRoman(levels[0]) + '.';
        for (var i = 1; i < levels.length; i++) {
            if (levels[i] == 0) break;
            s += levels[i] + '.';
        }
        return s;
    }
    return function(elem) {
        if (elem.level) {
            if (!elem.unnumbered) levels[elem.level - 1]++;
            for (var i = elem.level; i < levels.length; i++) {
                levels[i] = 0;
            }
            if (!elem.unnumbered) {
                elem.number = numberString();
                var key = [];
                for (var j = 0; j < levels.length; j++) {
                    if (levels[j] == 0) break;
                    key.push(levels[j]);
                }
                toc[key] = [elem.number, elem.text];
            }
        }
    };
};
exports.tocToHTML = function(toc) {
    var html = '';
    var prevLevel = 1, level;
    Object.keys(toc).sort().forEach(function(k) {
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
                .replace(/[^a-z0-9-]|\s/g, '-')
                .replace(/-+/g, '-');
        html += '<li><a href="#' + anchor +'">' + t[1].replace(/`/g, '') + '</a>';
        prevLevel = level;
    });
    html += '</li>\n';
    for (var i = level; i > 1; i--) {
        html += '</ol>\n</li>\n';
    }
    return html;
};

exports.labelCollector = function(refs, links) {
    return function(elem) {
        // Duck typing in action
        if (elem.label) {
            if (elem.url) {
                // LinkDef
                links[elem.label] = elem.url;
            } else if (elem.name) {
                // Question
                refs[elem.label] = [elem.label, elem.name];
            } else {
                // Title
                refs[elem.label] = [elem.anchor(), elem.text];
            }
        }
    };
};

exports.fillInReferences = function(refs, bibIndex) {
    return function(s) {
        // #[label]
        return s.replace(/#\[[^\]]+\]/g, function($1) {
            var m = $1.match(/#\[([^\]]+)\]/);
            if (m && m[1]) {
                var label = m[1],
                    ref = refs[label];
                if (!ref) {
                    // Not an in-document reference, maybe a
                    // bibliography reference
                    ref = bibIndex[label];
                    if (!ref) {
                        console.log('WARNING: unresolved reference: ' + label);
                        return '??';
                    } else {
                        return ref.toReference();
                    }
                } else {
                    // An in-document reference
                    return '<a href="#' + ref[0] + '" class="ref">' +
                        ref[1] + '</a>';
                }
            }
            return '';
        });
    };
};

exports.fillInLinks = function(links, refs) {
    return function(s) {
        // [text][label] or [text][url]
        return s.replace(/\[[^\]]+\]\[[^\]]+\]/g, function($1) {
            var m = $1.match(/\[([^\]]+)\]\[([^\]]+)\]/);
            if (m && m[1] && m[2]) {
                var text = m[1],
                    label = m[2],
                    isUrl = label.match(/^http/),
                    url;
                if (isUrl) {
                    url = label;
                } else {
                    url = links[label];
                    if (!url) {
                        var ref = refs[label];
                        if (ref) {
                            url = '#' + ref[0];
                        }
                    }
                }
                if (!url) {
                    console.log('WARNING: unresolved link: ' + label);
                    return '??';
                } else {
                    return '<a href="' + url + '"'
                        + (url.match(/^#/)
                           ? '>'
                           : ' target="_blank">') + text + '</a>';
                }
            }
            return '';
        });
    };
};

exports.fillInBlockQuoteRefs = function(links, bibIndex) {
    return function(elem) {
        if (elem.ref) {
            var url = links[elem.ref];
            if (!url) {
                // Not a link, maybe a bibliography reference
                var bibItem = bibIndex[elem.ref];
                if (bibItem) {
                    elem.url = bibItem.toURL();
                } else {
                    console.log('WARNING: unresolved reference: ' +
                                elem.ref);
                }
            } else {
                elem.url = url;
            }
        }
    };
};
