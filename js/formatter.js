$(document).ready(function () {

    // TODO snippets relying on previous definitions don't work
    function evalJS(sourceCode, callback) {
        /*
         Why not just eval(sourceCode)? Because sourceCode can be a
         string containing multiple expressions and/or statements, but
         eval will only return the final return value. In order to not
         lose the other return values, we have to do a lot more work.

         First we parse the JavaScript sourceCode to get an AST. Next
         we convert every top-level AST node back to a string
         representation, i.e. source code. Instead of one big string
         containig all expressions and/or statements, we now have an
         array of expressions and/or statements. Finally, we evaluate
         every string and collect the results, so we can show all
         return values. These results are then concatenated into a big
         string, whereby each result is commented out and separated by
         the previous result by a newline character.

         If an error is thrown during parsing, code generation, or
         evaluation, the corresponding result will contain the error
         message instead of the return value.
         */
        try {
            var ast = parseJs.parse(sourceCode).splice(1)[0],
                exprs = ast.map(function(astNode) {
                    [astNode].unshift("toplevel");
                    return process.gen_code(astNode, false);
                }),
                output = '';
            // Is sometimes used in code samples
            function println(x) {
                output += x + '\n';
            }
            // We can't use map for this, as the anonymous function causes
            // every expression to be executed in a separate scope,
            // preventing the use of previous definitions.
            while (exprs.length > 0) {
                try {
                    var evaluated = eval(exprs.shift());
                    // Don't print out full functions
                    if (evaluated && evaluated.toString().match(/function\s/)) {
                        evaluated = evaluated.toString().split('\n')[0] + ' ..';
                    }
                    output += evaluated + '\n';
                } catch (err) {
                    output += err.name + ': ' + err.message + '\n';
                }
            }
            // Comment out each line
            return output.split(/\n/g).map(function(line) {
                return '// ' + line;
            }).join('\n');

        } catch (err) {
            return '// Invalid input: ' + err.message + '\n';
        };
    }
    function fixEncoding(cm, text) {
        text = text || cm.getValue();
        var decoded = $('<div/>').html(text).text();
        cm.setValue(decoded);
    }
    function modeName(className) {
        switch (className) {
        case 'Java':
            return 'text/x-java';
        case 'Scheme':
            return 'scheme';
        case undefined:
        case 'NodeJS':
        default:
            return 'javascript';
        }
    }
    $('pre').each(function(index, pre) {
        var id = 'editor' + index;
        var codeMirror = CodeMirror(function(editor) {
            var $pre = $(pre);
            var $div = $('<div class="editor" id="' + id + '"></div>');
            var $tabs = $('<ul class="tabs">'
                          + '<li>' + (pre.className || 'JavaScript') + '</li>'
                          + (!pre.className ?
                             '<li><a href="#eval">Evaluate</a></li>'
                             : '')
                          + '<li><a href="#reset">Reset</a></li>'
                          + '</ul>');
            $div.append($tabs);
            $div.append(editor);
            $pre.replaceWith($div);
            // Store the initial contents of the pre, so we can later reset
            $div.data('initial', pre.innerHTML);
            // $('a.ref[href^="#bib-"]')
            $('a[href="#eval"]', $tabs).click(function(event) {
                event.preventDefault();
                var val = codeMirror.getValue();
                codeMirror.setValue(val + "\n\n// ########\n" + evalJS(val));
                fixEncoding(codeMirror);
            });
            $('a[href="#reset"]', $tabs).click(function(event) {
                event.preventDefault();
                fixEncoding(codeMirror, $div.data('initial'));
            });
        }, {
            value: pre.innerHTML,
            mode: modeName(pre.className),
            indentUnit: 4,
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: {
                "Ctrl-R": function () { $("div#" + id + " a[href='#reset']").click(); },
                "Ctrl-E": (!pre.className
                           ? function () {
                               $("div#" + id + ""
                                 + " a[href='#eval']").click();
                           } : undefined)
            }
        });
        fixEncoding(codeMirror);
    });

    // Popup footnotes
    $('span.footnote').each(function(index, elem) {
        var link = $('<a href="#" class="footnote">[' + (index + 1)
                     + ']</a>');
        var $elem = $(elem);
        $elem.before(link);
        $(link).click(function(e) {
            e.preventDefault();
            // Don't make the popup if it's already present
            if ($('div#footnote' + (index + 1)).length > 0) return;
            var popup = $('<div id="footnote' + (index + 1) + '" class="footnote">' + $elem.html() +
                          '</div>');
            var $window = $(window);
            popup.css({left: Math.max(20, e.pageX - $window.width() * 0.2) + 'px',
                       top: (e.pageY + 10) + 'px'});
            $elem.after(popup);
            popup.click(function(e) {
                popup.remove();
            });
        });
    });

    // When clicking on a link to a bibliography item, highlight the
    // item
    $('a.ref[href^="#bib-"]').click(function(e) {
        var li = $('li#' + this.href.split('#')[1]);
        // Lower the opacity
        li.css({opacity: 0.1});
        // Bring it back to normal
        li.animate({opacity: 1}, 1000);
        // TODO doesn't work inside a footnote
    });

    // Equality tables
    // Adapted from https://github.com/dorey/JavaScript-Equality-Table
    function makeEqualityTable(cmpStr, table) {
        var comparisons = [true, false, 1, 0, -1, '1', '0', '-1', '', null,
                           undefined, [], {}, [[]], [0], [1],
                           parseFloat('nan')];
        function map(f, x) {
            var result = [];
            for (var i = 0; i < x.length; i += 1)
                result.push(f(x[i]));
            return result;
        }

        function repr(x) {
            if (typeof(x) === 'string') return '"' + x.replace('"', '\\"') + '"';
            if (x && x.constructor === Array) return '[' + map(repr, x).join(', ') + ']';
            if (x && typeof(x) === 'object') return '{}';
            return String(x);
        }

        var curRow = $('<tr />').html('<td />'),
            representations = [],
            tVal, i, j, result, elem;

        $.each(comparisons, function(i) {
            tVal = repr(comparisons[i]);
            curRow.append($('<td />', {'class':'col header'}).html($('<span />').html(tVal)));
            representations.push(tVal);
        });
        table.append(curRow);

        for (i = 0; i < comparisons.length; i += 1) {
            curRow = $("<tr />");
            curRow.append($("<td />", {'class':'row header'}).html(representations[i]));

            for (j = 0; j < comparisons.length; j += 1) {
                elem = $("<td />", {'class': 'cell'}).html("<div />");
                if (cmpStr === "===") {
                    if (comparisons[i] === comparisons[j]) {
                        elem.addClass('green');
                        elem.attr('title', "" + representations[i] + "===" + representations[j] + "  » true ");
                    } else {
                        elem.addClass('red');
                        elem.attr('title', "" + representations[i] + "===" + representations[j] + "  » false ");
                    }
                } else if (cmpStr === "==") {
                    if (comparisons[i] == comparisons[j]) {
                        elem.addClass('green');
                        elem.attr('title', "" + representations[i] + "==" + representations[j] + "  » true ");
                    } else {
                        elem.addClass('red');
                        elem.attr('title', "" + representations[i] + "==" + representations[j] + "  » false ");
                    }
                }
                curRow.append(elem);
            }
            table.append(curRow);
        }
    }

    makeEqualityTable('===', $('table#strict-equality-table'));
    makeEqualityTable('==', $('table#equality-table'));
});
