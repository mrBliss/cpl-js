
Generator
=========


Summary
-------

This program will generate a HTML document based on the contents of plain-text
files written using a pseudo-Markdown syntax. A table of contents will be
generated, as well as the bibliography. References are also resolved. The
.less-file is converted to CSS, and CSS and JavaScript files are concatenated
and minimised.


Running the program
-------------------

You need to have Node.js and npm (node package manager) installed to run this
tool.

Just run the `generate` script, which will pull in the required dependencies
and generate the HTML (index.html), CSS (styles.css), and JavaScript
(scripts.js). The names of these output files can be modified in the
`generate` script.

The script will only regenerate the HTML when index.html is missing, the
bibliography.js file or any of the text files is updated. The text files are
located in the doc folder, one step up in the directory tree. The .less-file
will only be converted to CSS when it has been modified. The CSS files will
only be concatenated and minimised when the output file is missing, or one of
the CSS files (including the compiled .less-file) has been modified. The
JavaScript files will only be concatenated and minimised when the output file
is missing, or one of the JavaScript files has been modified.

An HTML template is used to generate the output HTML, it should contain the
following strings that will be replaced with the actual contents:

* `<!--PREFACE-->`, the preface
* `<!--TOC-->`, the table of contents
* `<!--BODY-->`, the actual text
* `<!--BIB-->`, the bibliography

The tests can be run with `npm test`.


About the program
-----------------

The text files are parsed using parser combinators. The pseudo-Markdown syntax
is implemented using simple regexps, as the hard work is already done by the
parser.

I am aware of the existence of tools and libraries that can convert Markdown
to HTML, but I wrote this library to have more control (Q&A, references, etc.)
and to know what it is to write an actual JavaScript (or in this case Node.js)
program.

Note: the code in this program contains many hardcoded things and leans too
much on mutable parts.
