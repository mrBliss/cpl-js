var entries = [
    new Book('Flanagan', {
        authors: [['Flanagan', 'David']],
        title: 'JavaScript: The Definitive Guide',
        year: 2011,
        edition: 6,
        publisher: "O'Reilly Media",
        address: 'Sebastopol, CA'
    }),
    new Book('Crockford', {
        authors: [['Crockford', 'Douglas']],
        title: 'JavaScript: The Good Parts',
        year: 2008,
        edition: 1,
        publisher: "O'Reilly Media",
        address: 'Sebastopol, CA'
    }),
    new Book('SICP', {
        authors: [['Abelson', 'Harold'], ['Sussman', 'Gerald', 'Jay']],
        title: 'Structure and Interpretation of Computer Programs',
        year: 1984,
        edition: 1,
        publisher: 'MIT Press',
        address: 'Cambridge, MA'
    }),
    new Book('Okasaki', {
        authors: [['Okasaki', 'Chris']],
        title: 'Purely Functional Data Structures',
        year: 1999,
        edition: 1,
        publisher: "Cambridge University Press",
        address: 'Cambridge, England'
    }),
    new Wikipedia('JSHistory', {
        title: 'JavaScript History',
        retrieved: 'November 3, 2012',
        url: 'http://en.wikipedia.org/wiki/JavaScript#History'
    }),
    new Wikipedia('ECMAScript', {
        title: 'ECMAScript',
        retrieved: 'November 3, 2012',
        url: 'http://en.wikipedia.org/wiki/ECMAScript'
    }),
    new Wikipedia('ECMAScriptSyntax', {
        title: 'ECMAScript Syntax',
        retrieved: 'November 3, 2012',
        url: 'http://en.wikipedia.org/wiki/ECMAScript_syntax'
    }),
    new Wikipedia('PrototypeBProg', {
        title: 'Prototype-based programming',
        retrieved: 'November 1, 2012',
        url: 'http://en.wikipedia.org/wiki/Prototype-based_programming'
    }),
    new Website('JSUses', {
        siteName: 'Dev.Opera',
        year: 2009,
        title: 'What can you do with JavaScript?',
        retrieved: 'November 3, 2012',
        url: 'http://dev.opera.com/articles/view/javascript-uses/'
    }),
    new Website('JSUsage', {
        siteName: 'Dev.Opera',
        year: 2008,
        title: 'MAMA: Key findings',
        retrieved: 'November 3, 2012',
        url: 'http://dev.opera.com/articles/view/mama-key-findings/'
    }),
    new Website('BriefHistoryJS', {
        siteName: 'About.com',
        year: null,
        title: 'A Brief History of Javascript',
        retrieved: 'November 3, 2012',
        url: 'http://javascript.about.com/od/reference/a/history.htm'
    }),
    new Website('JavaScriptAndJScript', {
        siteName: 'About.com',
        year: null,
        title: 'JavaScript and JScript: What\'s the Difference?',
        retrieved: 'November 3, 2012',
        url: 'http://javascript.about.com/od/reference/a/jscript.htm'
    }),
    new Blog('Misunderstood', {
        authors: [['Crockford', 'Douglas']],
        published: '2001',
        title: 'JavaScript: The World\'s Most Misunderstood Programming Language',
        url: 'http://javascript.crockford.com/javascript.html'
    }),
    new Blog('Closures', {
        authors: [['Cornford', 'Richard']],
        published: 'March, 2004',
        title: 'Javascript Closures',
        url: 'http://jibbering.com/faq/notes/closures/'
    }),
    new Blog('5UsefulFunctions', {
        authors: [['De Rosa', 'Aurelio']],
        published: 'October 15, 2012',
        title: 'Five Useful Functions Missing in JavaScript',
        url: 'http://jspro.com/raw-javascript/5-useful-functions-missing-in-javascript/'
    }),
    new Blog('CustomEvents', {
        authors: [['Buckler', 'Craig']],
        published: 'October 10, 2012',
        title: 'How to Create Custom Events in JavaScript',
        url: 'http://jspro.com/raw-javascript/how-to-create-custom-events-in-javascript/'
    }),
    new Blog('ModularDesign', {
        authors: [['Edwards', 'James']],
        published: 'October 15, 2012',
        title: 'Modular Design Patterns: Private, Privileged, and Protected Members in JavaScript',
        url: 'http://jspro.com/raw-javascript/modular-design-patterns-in-javascript/'
    }),
    new Website('JSSemantics', {
        siteName: 'WebScanNotes.com',
        year: 2012,
        title: 'Javascript Semantics for Computer Scientists',
        retrieved: 'November 3, 2012',
        url: 'http://webscannotes.com/2012/06/19/javascript-semantics-for-computer-scientists-part-1-variables-and-scope/'
    }),
    new Blog('FakeOperatorOverloading', {
        authors: [['Rauschmayer', 'Axel']],
        published: 'December 17, 2011',
        title: 'Fake operator overloading in JavaScript',
        url: 'http://www.2ality.com/2011/12/fake-operator-overloading.html'
    }),
    new Blog('LittleJSer', {
        authors: [['Crockford', 'Douglas']],
        published: null,
        title: 'The Little JavaScripter',
        url: 'http://crockford.com/javascript/little.html'
    }),
    new Blog('JSHistory2', {
        authors: [['Wilton-Jones', 'Mark']],
        published: null,
        title: 'JavaScript History',
        url: 'http://www.howtocreate.co.uk/jshistory.html'
    }),
    new Website('JSON', {
        siteName: 'JSON',
        year: null,
        title: 'Introducing JSON',
        url: 'http://www.json.org'
    }),
    new Blog('ArgsJSOddity', {
        authors: [['Tetlaw', 'Andrew']],
        published: 'November 11, 2008',
        title: 'arguments: A JavaScript Oddity',
        url: 'http://www.sitepoint.com/arguments-a-javascript-oddity/'
    }),
    new Blog('JSExecutionBrowserLimits', {
        authors: [['Buckler', 'Craig']],
        published: 'December 1, 2010',
        title: 'JavaScript Execution and Browser Limits',
        url: 'http://www.sitepoint.com/javascript-execution-browser-limits/'
    }),
    new Blog('Popularity', {
        authors: [['Eich', 'Brendan']],
        published: 'April 3, 2008',
        title: 'Popularity',
        url: 'https://brendaneich.com/2008/04/popularity/'
    }),
    new Blog('BriefHistory', {
        authors: [['Eich', 'Brendan']],
        published: 'July 21, 2010',
        title: 'A Brief History of JavaScript',
        url: 'https://brendaneich.com/2010/07/a-brief-history-of-javascript/'
    }),
    new Blog('JSTutorial', {
        authors: [['Willison', 'Simon']],
        published: 'March 7, 2006',
        title: 'A re-introduction to JavaScript (JS Tutorial)',
        url: 'https://developer.mozilla.org/en-US/docs/JavaScript/A_re-introduction_to_JavaScript'
    }),
    new Website('Arguments', {
        siteName: 'Mozilla Developer Network',
        year: 2012,
        title: 'JavaScript - Reference - Functions and function scope - arguments',
        retrieved: 'November 3, 2012',
        url: 'https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Functions_and_function_scope/arguments'
    }),
    new Website('V8Intro', {
        siteName: 'Google Developers',
        year: 2012,
        title: 'V8 Introduction',
        url: 'https://developers.google.com/v8/intro'
    }),
    new Website('V8Design', {
        siteName: 'Google Developers',
        year: 2012,
        title: 'V8 Design Elements',
        url: 'https://developers.google.com/v8/design'
    }),
    new Blog('ModulePattern', {
        authors: [['Cherry', 'Ben']],
        published: 'March 12, 2010',
        title: 'JavaScript Module Pattern: In-Depth',
        url: 'http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth'
    }),
    new Blog('JavaScriptModules', {
        authors: [['Padburry', 'David']],
        published: 'August 21, 2011',
        title: 'JavaScript Modules',
        url: 'http://blog.davidpadbury.com/2011/08/21/javascript-modules/'
    }),
    new Website('NodeJSModules', {
        siteName: 'Node.js',
        year: 2012,
        title: 'Node.js v0.8.14 Manual & Documentation - Modules',
        url: 'http://nodejs.org/api/modules.html'
    }),
    new Blog('FuncProgJS', {
        authors: [['Smith', 'Nathaniel']],
        published: 'September 14, 2012',
        title: 'Functional Programming in JavaScript',
        url: 'http://dailyjs.com/2012/09/14/functional-programming/'
    }),
    new Wikipedia('MonkeyPatch', {
        title: 'Monkey patch',
        retrieved: 'November 9, 2012',
        url: 'http://en.wikipedia.org/wiki/Monkey_patch'
    }),
    new Wikipedia('WikiJIT', {
        title: 'Just-in-time compilation',
        retrieved: 'November 10, 2012',
        url: 'http://en.wikipedia.org/wiki/Just-in-time_compilation'
    }),
    new Blog('TraceMonkeyLightspeed', {
        authors: [['Eich', 'Brendan']],
        published: 'August 23, 2008',
        title: 'TraceMonkey: JavaScript Lightspeed',
        url: 'https://brendaneich.com/2008/08/tracemonkey-javascript-lightspeed/'
    }),
    new Blog('TraceMonkey', {
        authors: [['Resig', 'John']],
        published: 'August 22, 2008',
        title: 'TraceMonkey',
        url: 'http://ejohn.org/blog/tracemonkey/'
    }),
    new Wikipedia('ECMAScriptLanguages', {
        title: 'List of ECMAScript engines',
        retrieved: 'November 10, 2012',
        url: 'http://en.wikipedia.org/wiki/List_of_ECMAScript_engines'
    }),
    new Blog('MemoryEfficientJS', {
        authors: [['Osmani', 'Addy']],
        published: 'November 5, 2012',
        title: 'Writing Fast, Memory-Efficient JavaScript',
        url: 'http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/'
    }),
    new Blog('JSConcurrency', {
        authors: [['Sofer', 'Dan']],
        published: 'May 26, 2010',
        title: 'Concurrency, JavaScript and JQuery',
        url: 'http://blog.sofer.com/tech/2010/05/26/concurrency-javascript-jquery.html'
    }),
    new Wikipedia('WikiNode.js', {
        title: 'Node.js',
        retrieved: 'November 11, 2012',
        url: 'http://en.wikipedia.org/wiki/Node.js'
    }),
    new Blog('CLJSMacros', {
        authors: [['McKenna', 'Brian']],
        published: 'July 24, 2011',
        title: 'Escaping Callback Hell with ClojureScript macros',
        url: 'http://brianmckenna.org/blog/cps_transform_js'
    })];
