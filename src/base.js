// ==UserScript==
// @name         HowWTSucks
// @namespace    https://reimu.worktile.com/
// @version      0.2.0
// @description  HOOOOOOW WT sucks!
// @author       Cyancat
// @match        https://help.worktile.com/taskno/*
// @match        https://help.worktile.com/taskcode/*
// @match        https://reimu.worktile.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.27.0/commonmark.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  'use strict';

  function ctCSS() {
    return '<style> \
    /* include:css */
    /* endinject */
    </style>';
  }

  function ctHTML() {
    return ' \
    /* include:inc/task.html */
    /* endinject */
    ';
  }

  var CONST = {
    URL_TASKNO_PREFIX: 'https://help.worktile.com/taskno/',
    URL_TASKCODE_PREFIX: 'https://help.worktile.com/taskcode/'
  };

  if (/^https:\/\/reimu\.worktile\.com/.test(window.location.href)) {
    /* include:inc/event.js */
    /* endinject */
  }
  else if (/^https:\/\/help.worktile.com\/taskno/.test(window.location.href) || /^https:\/\/help.worktile.com\/taskcode/.test(window.location.href)) {
    /* include:inc/task.js */
    /* endinject */
  }

})();
