// ==UserScript==
// @name         HowWTSucks
// @namespace    https://reimu.worktile.com/
// @version      0.3.0
// @description  HOOOOOOW WT sucks!
// @author       Cyancat
// @match        https://help.worktile.com/taskno/*
// @match        https://help.worktile.com/taskcode/*
// @match        https://help.worktile.com/drive_image/*
// @match        https://reimu.worktile.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/commonmark/0.27.0/commonmark.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  function ctCSS() {
    GM_addStyle(' \
    /* include:css */
    /* endinject */
    ');
  }

  function ctHTML() {
    return ' \
    /* include:inc/task.html */
    /* endinject */
    ';
  }

  var CONST = {
    URL_TASKNO_PREFIX: 'https://help.worktile.com/taskno/',
    URL_TASKCODE_PREFIX: 'https://help.worktile.com/taskcode/',
    TEAM_ID: '5837fe300d084d66c710fd0e'
  };

  /* include:inc/common.js */
  /* endinject */

  if (/^https:\/\/reimu\.worktile\.com/.test(window.location.href)) {
    /* include:inc/event.js */
    /* endinject */
  }
  else if (/^https:\/\/help.worktile.com\/taskno/.test(window.location.href) || /^https:\/\/help.worktile.com\/taskcode/.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/task.js */
    /* endinject */
  }
  else if (/^https:\/\/help.worktile.com\/drive_image/.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/drive_image.js */
    /* endinject */
  }

})();
