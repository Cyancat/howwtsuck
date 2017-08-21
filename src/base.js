// ==UserScript==
// @name         HowWTSucks
// @namespace    https://reimu.worktile.com/
// @version      0.5.1
// @description  HOOOOOOW WT sucks!
// @author       Cyancat
// @match        https://help.worktile.com/taskno/*
// @match        https://help.worktile.com/taskcode/*
// @match        https://help.worktile.com/image/*
// @match        https://help.worktile.com/public_image/*
// @match        https://help.worktile.com/active
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

  /* include:config.js */
  /* endinject */

  /* include:inc/common.js */
  /* endinject */

  if (RCONST.URL_WT_BASE.test(window.location.href)) {
    /* include:inc/event.js */
    /* endinject */
  }
  else if (RCONST.URL_HWT_TASKNO.test(window.location.href) || RCONST.URL_HWT_TASKCODE.test(window.location.href)) {
    util.cleanHTML();

    /* include:inc/task/init.js */
    /* endinject */

    function renderTask(res) {

      var newHTML = $(ctHTML());

      /* include:inc/task/preprocess.js */
      /* endinject */

      /* include:inc/task/head.js */
      /* endinject */

      /* include:inc/task/main.js */
      /* endinject */

      /* include:inc/task/comments.js */
      /* endinject */

      newHTML.appendTo('body');

    }
  }
  else if (RCONST.URL_HWT_IMAGE.test(window.location.href) || RCONST.URL_HWT_PUBLIC_IMAGE.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/drive_image.js */
    /* endinject */
  }
  else if (RCONST.URL_HWT_ACTIVE.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/activity/main.js */
    /* endinject */
  }

})();
