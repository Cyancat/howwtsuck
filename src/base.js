// ==UserScript==
// @name         HowWTSucks
// @namespace    https://reimu.worktile.com/
// @version      0.3.1
// @description  HOOOOOOW WT sucks!
// @author       Cyancat
// @match        https://help.worktile.com/taskno/*
// @match        https://help.worktile.com/taskcode/*
// @match        https://help.worktile.com/image/*
// @match        https://help.worktile.com/public_image/*
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
    URL_PUBLIC_IMAGE_PREFIX: 'https://help.worktile.com/public_image/',
    TEAM_ID: '5837fe300d084d66c710fd0e'
  };

  var RCONST = {
    URL_WT_BASE: /^https:\/\/reimu\.worktile\.com/,
    URL_HWT_TASKNO: /^https:\/\/help.worktile.com\/taskno/,
    URL_HWT_TASKCODE: /^https:\/\/help.worktile.com\/taskcode/,
    URL_HWT_IMAGE: /^https:\/\/help.worktile.com\/image/,
    URL_HWT_PUBLIC_IMAGE: /^https:\/\/help.worktile.com\/public_image/
  };

  /* include:inc/common.js */
  /* endinject */

  if (RCONST.URL_WT_BASE.test(window.location.href)) {
    /* include:inc/event.js */
    /* endinject */
  }
  else if (RCONST.URL_HWT_TASKNO.test(window.location.href) || RCONST.URL_HWT_TASKCODE.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/task.js */
    /* endinject */
  }
  else if (RCONST.URL_HWT_IMAGE.test(window.location.href) || RCONST.URL_HWT_PUBLIC_IMAGE.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/drive_image.js */
    /* endinject */
  }

})();
