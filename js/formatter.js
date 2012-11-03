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
            var ast = parseJs.parse(sourceCode).splice(1)[0];
            var outputs = ast.map(function(astNode) {
                [astNode].unshift("toplevel");
                try {
                    return "// " + eval(process.gen_code(astNode,
                                                         false));
                } catch (err) {
                    return "// Eval error: " + err.message;
                }
            });
            return outputs.join("\n");
        } catch (err) {
            return "// Invalid input: " + err.message;
        };
    }
    $('pre').each(function(index, pre) {
        var id = 'editor' + index;
        var codeMirror = CodeMirror(function(editor) {
            var $pre = $(pre);
            var $div = $('<div class="editor" id="' + id + '"></div>');
            var $tabs = $('<ul class="tabs"><li><a href="#">Reset</a></li><li><a href="#">Evaluate</a></li></ul>');
            $div.append($tabs);
            $div.append(editor);
            $pre.replaceWith($div);
            // Store the initial contents of the pre, so we can later reset
            $div.data('initial', pre.innerHTML);
            var $links = $('a', $tabs);
            $links.first().click(function (event) {
                event.preventDefault();
                codeMirror.setValue($div.data('initial'));
            });
            $links.last().click(function (event) {
                event.preventDefault();
                var val = codeMirror.getValue();
                codeMirror.setValue(val + "\n" + evalJS(val));
            });
            return false;
        }, {
            value: pre.innerHTML,
            mode: "javascript",
            indentUnit: 4,
            lineNumbers: true,
            matchBrackets: true
        });
    });
});
