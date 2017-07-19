// ==UserScript==
// @name         HowWTSucks - Task
// @namespace    https://reimu.worktile.com/
// @version      0.1
// @description  try to take over the world!
// @author       Cyancat
// @match        https://help.worktile.com/taskno/*
// @match        https://help.worktile.com/taskcode/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.27.0/commonmark.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
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
      * {\
        color: #333; \
        box-sizing: border-box; \
      } \
      img { \
        width: 100%; \
      } \
      .secondary-text { \
        color: #999; \
        font-size: 12px; \
      } \
      .container { \
        margin-left: 20px; \
      } \
      .container > div { \
        padding: 20px; \
      } \
      .ws-title-meta { \
        font-size: 14px; \
        margin-left: 10px; \
      } \
      .ws-comments-container { \
        border-left: 1px solid #ccc; \
      } \
      .ws-comment { \
        margin-bottom: 30px; \
      } \
      .ws-comment-time { \
        margin-left: 5px; \
      } \
      .ws-comment-content { \
        margin-top: 5px; \
      } \
      .ws-content-user { \
        color: #91D6D5; \
      } \
      .ws-content-tasklink { \
        color: #F9A5A1; \
      } \
      .ws-content-tasklink:hover { \
        color: #A23607 \
      } \
    </style>';
  };

  function ctHTML(){
    return ' <div class="pure-g container"> \
      <div class="ws-title-container pure-u-1"> \
        <h1><span class="ws-title-meta"></span></h1> \
      </div> \
      <div class="ws-issue-container pure-u-1-2"> \
        <div class="ws-content-container pure-u-1"> \
          <pre></pre> \
        </div> \
      </div> \
      <div class="ws-comments-container pure-u-1-2"> \
        \
      </div> \
    </div>';
  };

  function contentFormat(c) {
    return c.replace(/\[@.*\|(.*)\]/, '<span class="ws-content-user">@$1</span>')
            .replace(/\[#task-(.*)\|(.*)\]/, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>');
  }

  function popNotice(t) {
    unsafeWindow.document.documentElement.innerHTML = '<h1>' + t + '</h1>';
  }

  popNotice('Loading data...');

  // Include UIKit
  $("head").append(
  '<link '
    + 'href="//unpkg.com/purecss@1.0.0/build/pure-min.css" '
    + 'rel="stylesheet" type="text/css">'
  );

  var task_no = /.*\/taskno\/(\d*)/g.exec(window.location.href),
      task_code = /.*\/taskcode\/(.*)/g.exec(window.location.href);

  task_no = task_no != null ? task_no[1] : '';
  task_code = task_code != null ? task_code[1] : '';

  if (task_no == '' && task_code == '') {
    popNotice('Something goes wrong! Check the url pppplz</h1>(\\&nbsp;&nbsp;/)<br>( ¬᎑¬)<br>/つ🍫');
    return;
  }

  var api_url = task_no != '' ? ("https://reimu.worktile.com/api/tasks/no/" + task_no) : ("https://reimu.worktile.com/api/tasks/" + task_code);

  GM_xmlhttpRequest({
    method: "GET",
    url: api_url,
    onload: function(res) {

      // Remove original page
      $('body').html('');

      // Get task data
      var taskData = JSON.parse(res.responseText);

      if (taskData.code == "404") {
        popNotice('Task not exist or no authority! (・へ・)');
        return;
      }

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
      newHTML.find('.ws-content-container').html(contentFormat(tc.render(tcr.parse(taskData.data.description)).replace(/\n([^\<])/gi, "<br>$1")));
      // TODO: Current markdown lack for strikethrough support

      var comms = newHTML.find('.ws-comments-container');
      taskData.data.comments.forEach(function(e){
        var comm = $("<div>", {
          class: "ws-comment"
        });
        comm.append ( $("<span>", {
          class: "ws-comment-creator",
          text: e.created_by.display_name
        })).append( $("<span>", {
          class: "ws-comment-time secondary-text",
          text: moment(e.updated_at*1000).format('MM-DD hh:mm')
        })).append( $("<div>", {
          class: "ws-comment-content",
          html: contentFormat(e.content)
        }));
        comms.append(comm);
      });


      $('body').html(ctCSS());
      newHTML.appendTo('body');
    }
  });
})();
