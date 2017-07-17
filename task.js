// ==UserScript==
// @name         HowWTSucks - Task
// @namespace    https://reimu.worktile.com/
// @version      0.1
// @description  try to take over the world!
// @author       Cyancat
// @match        https://help.worktile.com/taskno/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.27.0/commonmark.js
// @reqiure
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// TODO__2: Set a rule to capture the specific URL, replce all element on page with the custumized task detail
// TODO__2: Get task detail with api https://reimu.worktile.com/api/tasks/no/2210 , then fill the page
// TODO__2: Get all actions of task ready to work

(function() {
  'use strict';

  function ctCSS(){
    return '<style> \
      .container { \
        margin-left: 20px; \
      } \
      .ws-title-meta { \
        font-size: 14px; \
        margin-left: 10px; \
      } \
    </style>';
  };

  function ctHTML(){
    return ' <div class="pure-g container"> \
      <div class="ws-title-container pure-u-1"> \
        <h1><span class="ws-title-meta"></span></h1> \
      </div> \
      <div class="ws-content-container pure-u-1"> \
        <pre></pre> \
      </div> \
    </div>';
  };

  unsafeWindow.document.documentElement.innerHTML = '<h1>Loading data...</h1>';

  // Include UIKit
  $("head").append(
  '<link '
    + 'href="//unpkg.com/purecss@1.0.0/build/pure-min.css" '
    + 'rel="stylesheet" type="text/css">'
  );

  GM_xmlhttpRequest({
    method: "GET",
    url: "https://reimu.worktile.com/api/tasks/no/" + /.*\/taskno\/(\d*)/g.exec(window.location.href)[1],
    onload: function(res) {

      // Remove original page
      $('body').html('');

      // Get task data
      var taskData = JSON.parse(res.responseText);

      // Page title
      $("head").append (
      '<title>'
        + '#' + taskData.data.identifier + ' - ' + taskData.data.title
        + '</title>'
      );

      // Construct grid
      var newHTML = $(ctHTML());
      newHTML.find('.ws-title-container h1').html(taskData.data.title);
      newHTML.find('.ws-title-container h1').append($("<span>", {
        class: "ws-title-meta",
        text: "#" + taskData.data.identifier
      }));

      var tcr = new commonmark.Parser();
      var tc = new commonmark.HtmlRenderer();
      newHTML.find('.ws-content-container').html(tc.render(tcr.parse(taskData.data.description)).replace(/\n[^\<]/gi, "<br>"));
      $('body').html(ctCSS());
      // TODO: Current markdown lack for strikethrough support


      newHTML.appendTo('body');
    }
  });
})();
