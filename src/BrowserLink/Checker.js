/// <reference path="_intellisense/browserlink.intellisense.js" />

(function (browserLink, $) {
  /// <param name="browserLink" value="bl" />
  /// <param name="$" value="jQuery" />

  var _project, _options;

  function initialize(options, project) {
    _options = options;
    _project = project;
  }

  function runAxe(err, results) {

    results.project = _project;

    for (var i = 0; i < results.violations.length; i++) {

      var nodes = results.violations[i].nodes;

      if (!nodes || nodes.length === 0)
        continue;

      results.violations[i].html = nodes[0].html;

      var target = nodes[0].target[0];
      var element = document.querySelector(target);

      var sourcemap = getSourceMap(element);
      results.violations[i].fileName = sourcemap ? sourcemap.sourcePath : "";
      results.violations[i].position = sourcemap ? sourcemap.startPosition : -1;
    }

    browserLink.invoke("ProcessResult", JSON.stringify(results));
  }

  function getSourceMap(element) {
    try {
        var rng = browserLink.sourceMapping.getCompleteRange(element);
        var paths = browserLink.sourceMapping.getAllSourcePaths(element)
        return rng;
    } catch (e) {
      return null;
    }
  }

  function check() {
      setTimeout(function () {
          if (_options === null || _options.length < 3) {
            axe.run(document, runAxe);  // run all rules
        } else {
            var json = JSON.parse(_options);
            axe.run(document, json, runAxe);
        }
      
    }, 2000);
  }

  //[axe.min.js]

  return {
    check: check,
    initialize: initialize,
    menu: {
      displayText: 'Web Accessibility Checker',
      'Run Accessibility Checker': 'check'
    }
  };
});