// ==UserScript==
// @name         HowWTSucks - Task
// @namespace    https://reimu.worktile.com/
// @version      0.1
// @description  try to take over the world!
// @author       Cyancat
// @match        https://help.worktile.com/task/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// TODO__2: Set a rule to capture the specific URL, replce all element on page with the custumized task detail
// TODO__2: Get task detail with api https://reimu.worktile.com/api/tasks/no/2210 , then fill the page
// TODO__2: Get all actions of task ready to work


(function() {
    'use strict';

    unsafeWindow.document.documentElement.innerHTML = '<h1>Loading data...</h1>';

    // Include UIKit
    $("head").append (
    '<link '
      + 'href="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.25/css/uikit.min.css" '
      + 'rel="stylesheet" type="text/css">'
    ).append (
    '<script '
      + 'src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"'
      + '></script>'
    ).append (
    '<script '
      + 'src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.25/js/uikit.min.js"'
      + '></script>'
    ).append (
    '<script '
      + 'src="//cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.25/js/uikit-icons.min.js"'
      + '></script>'
    );

    GM_xmlhttpRequest({
      method: "GET",
      url: "https://reimu.worktile.com/api/tasks/no/" + /.*\/task\/(\d*)/g.exec(window.location.href)[1],
      onload: function(res) {

        // Remove original page
        unsafeWindow.document.documentElement.innerHTML = '';

        // Get task data
        var taskData = JSON.parse(res.responseText);

        // Page title
        $("head").append (
        '<title>'
          + '#' + taskData.data.identifier + ' - ' + taskData.data.title
          + '</title>'
        );

        // Construct new HTML
        var newHTML = $("<div uk-grid></div>", {
          "clsss": "container"
          "style": ""
        });
        newHTML.append("<div>").append($("<h1>", { text: taskData.data.title }));

        newHTML.appendTo('body');

      }
    });
})();
