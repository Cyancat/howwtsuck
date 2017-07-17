// ==UserScript==
// @name         HowWTSucks - Event
// @namespace    https://reimu.worktile.com/
// @version      0.1
// @description  try to take over the world!
// @author       Cyancat
// @match        https://reimu.worktile.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// ==/UserScript==

// TODO__2: Set a rule to capture the specific URL, replce all element on page with the custumized task detail
// TODO__2: Get task detail with api https://reimu.worktile.com/api/tasks/no/2210 , then fill the page
// TODO__2: Get all actions of task ready to work

(function() {
    'use strict';

    unsafeWindow.document.addEventListener('click', function(e){
        var time_h = setTimeout(function(){
          if( $('.card-window').length > 0 ) {
              time_h = null;

              var d_taskNum = $('.card-sidebar .task-num .num');
              d_taskNum.replaceWith('<a target="_blank" href="https://help.worktile.com/taskno/' + d_taskNum.text() + '">' + d_taskNum.text() + '</a>');

              // TODO__1: Give the num text an event to open new window with specific URL
          }
        }, 1000);
    }, false);

})();
