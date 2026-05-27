(function() {
    'use strict';
    if (window.FMFormulaManager) return;
    var isConfigured = false;
    var typequeue = [];

    function configureMathJax() {
        if (isConfigured) return;
        isConfigured = true;
        if (!window.MathJax) {
            window.MathJax = {
                tex: {
                    inlineMath: [['$','$'],['\\(','\\)']],
                    displayMath: [['$$','$$'],['\\[','\\]']],
                    processEscapes: true,
                    processEnvironments: true,
                    packages: {'[+]': ['ams','noerrors','noundefined']}
                },
                options: {
                    skipHtmlTags: ['script','noscript','style','textarea','pre'],
                    enableMenu: false
                },
                startup: { typeset: false }
            };
        }
    }

    function loadMathJax() {
        configureMathJax();
        if (document.getElementById('MathJax-script')) return;
        var script = document.createElement('script');
        script.id = 'MathJax-script';
        script.async = true;
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
        script.onerror = function() {
            console.warn('MathJax CDN load failed, falling back to tex-mml-chtml');
            var fallback = document.createElement('script');
            fallback.id = 'MathJax-script-fallback';
            fallback.async = true;
            fallback.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            document.head.appendChild(fallback);
        };
        document.head.appendChild(script);
    }

    function typeset(elements) {
        if (!window.MathJax || !window.MathJax.typesetPromise) {
            typequeue.push(elements || null);
            return;
        }
        var promise;
        if (elements) {
            var el = Array.isArray(elements) ? elements : [elements];
            promise = MathJax.typesetPromise(el);
        } else {
            promise = MathJax.typesetPromise();
        }
        return promise.catch(function(err) {
            console.warn('MathJax typeset failed:', err);
        });
    }

    function flushQueue() {
        if (!window.MathJax || !window.MathJax.typesetPromise) return;
        while (typequeue.length > 0) {
            var el = typequeue.shift();
            typeset(el);
        }
    }

    window.FMFormulaManager = {
        configure: configureMathJax,
        load: loadMathJax,
        typeset: typeset,
        flushQueue: flushQueue,
        isConfigured: function() { return isConfigured; }
    };
})();