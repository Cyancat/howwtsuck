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
    *{color:#333;box-sizing:border-box}img{width:100%}blockquote{background-color:#f1f1f1;margin-left:0;padding:1px 10px}.secondary-text{color:#999;font-size:12px}code{color:#c7254e;background:rgba(0,0,0,.04);font-family:Consolas,"Liberation Mono",Menlo,Courier,monospace;padding:0 .2em}.container{margin-left:20px}.ws-task-status-container{padding:0 20px}.ws-title-container{padding:0 20px 20px}.ws-comments-container,.ws-issue-container{padding:20px}.ws-task-status{padding:5px 10px;float:left}.ws-task-status.ws-task-status-progress{background-color:#ffd889}.ws-task-status.ws-task-status-fin{background-color:#c3eeee}.ws-task-status.ws-task-status-archived{background-color:#ffe9e9}.ws-task-status.ws-task-status-deleted{background-color:#db9797;color:#fff}.ws-task-status.ws-task-parent{float:right;background-color:#e6e9eb}.ws-task-project{float:left;padding:5px 10px;background-color:#b3c4c3}.ws-task-meta{float:left;margin-right:20px}.ws-task-meta label{font-weight:700}.ws-title-meta{font-size:14px;margin-left:10px}.ws-comments-container{border-left:1px solid #ccc}.ws-comment{margin-bottom:30px}.ws-comment-time{margin-left:5px}.ws-comment-content{margin-top:5px}.ws-comment-content>p{margin:5px 0}.ws-content-user{color:#91d6d5}.ws-content-tasklink{color:#f9a5a1}.ws-content-tasklink:hover{color:#a23607}.ws-subtask-container{margin-top:50px} \
    </style>';
  }

  function ctHTML() {
    return ' \
    <div class="pure-g container"> \
  <div class="ws-task-status-container pure-u-1"> \
    <span class="ws-task-status ws-task-parent hidden"></span> \
    <span class="ws-task-stage ws-task-status"></span> \
    <span class="ws-task-project"></span> \
    <span class="ws-task-visibility ws-task-status"></span> \
  </div> \
  <div class="ws-title-container pure-u-1"> \
    <h1><span class="ws-title-meta"></span></h1> \
    <span class="ws-task-meta ws-task-assign"></span> \
    <span class="ws-task-meta ws-task-begin-date"></span> \
    <span class="ws-task-meta ws-task-due-date"></span> \
    <span class="ws-task-meta ws-task-priority"></span> \
  </div> \
  <div class="ws-issue-container pure-u-1-2"> \
    <div class="ws-content-container pure-u-1"> \
      <pre></pre> \
    </div> \
    <div class="ws-subtask-container hidden"> \
      <h2>子任务</h2> \
      <ul class="pure-menu-list"></ul> \
    </div> \
  </div> \
  <div class="ws-comments-container pure-u-1-2"></div> \
</div> \
 \
    ';
  }

  var CONST = {
    URL_TASKNO_PREFIX: 'https://help.worktile.com/taskno/',
    URL_TASKCODE_PREFIX: 'https://help.worktile.com/taskcode/'
  };

  if (/^https:\/\/reimu\.worktile\.com/.test(window.location.href)) {
    /* include:inc/event.js */
    (function() {

    // TODO: Combine this script to task.js
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

    /* endinject */
  }
  else if (/^https:\/\/help.worktile.com\/taskno/.test(window.location.href) || /^https:\/\/help.worktile.com\/taskcode/.test(window.location.href)) {
    /* include:inc/task.js */
    // TODO: Get all actions of task ready to work

(function() {

  // TODO: Remove mac mark! See task #1615

  function contentFormat(c) {
    // TODO: inline file support
    return c.replace(/\[@.*\|(.*)\]/, '<span class="ws-content-user">@$1</span>') // @
            .replace(/\[#task-(.*)\|(.*)\]/, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>') // Task link
            .replace(/((http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, '<a target="_blank" href="$1">$1</a>'); // URL format ( for markdown lack)
  }

  function dueTimeFormat(d, t) {
    var ft = t != 0 ? 'MM-DD HH:mm' : 'MM-DD';
    return moment(d*1000).format(ft);
  }

  function priorityFormat(p) {
    switch(p) {
      case 0: return '未设定'; break;
      case 1: return '低'; break;
      case 2: return '中'; break;
      case 3: return '高'; break;
      default: return '啥玩意？？';
    }
  }

  function popNotice(t) {
    unsafeWindow.document.documentElement.innerHTML = '<h1>' + t + '</h1>';
  }

  popNotice('Loading data...');


  // Include PureCSS
  $("head").append(
  '<link '
    + 'href="//unpkg.com/purecss@1.0.0/build/pure-min.css" '
    + 'rel="stylesheet" type="text/css">'
  );


  // Get task identifier
  var task_no = /.*\/taskno\/(\d*)/g.exec(window.location.href),
      task_code = /.*\/taskcode\/(.*)/g.exec(window.location.href);

  task_no = task_no != null ? task_no[1] : '';
  task_code = task_code != null ? task_code[1] : '';

  if (task_no == '' && task_code == '') {
    popNotice('Something goes wrong! Check the url pppplz</h1>(\\&nbsp;&nbsp;/)<br>( ¬᎑¬)<br>/つ🍫');
    return;
  }


  // Init markdown parser
  var tcr = new commonmark.Parser();
  var tc = new commonmark.HtmlRenderer();

  function mdParser(c) {
    // Markdown parse combined with worktile custom link.
    return contentFormat(tc.render(tcr.parse(c)).replace(/\n([^\<])/gi, "<br>$1"));
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

      // Task title
      newHTML.find('.ws-title-container h1').html(taskData.data.title);
      newHTML.find('.ws-title-container h1').append($("<span>", {
        class: "ws-title-meta",
        text: "#" + taskData.data.identifier
      }));

      // Task status
      var task_status = newHTML.find('.ws-task-stage');
      if (taskData.data.is_deleted == 1) {
        task_status.text('已删除').addClass('ws-task-status-deleted');
      } else if (taskData.data.is_archived == 1) {
        task_status.text('已归档').addClass('ws-task-status-archived');
      } else if (taskData.data.completion.is_completed == 1) {
        task_status.text('已完成').addClass('ws-task-status-fin');
      } else if (taskData.data.completion.is_completed == 0) {
        task_status.text('进行中').addClass('ws-task-status-progress');
      }

      // Task project
      newHTML.find('.ws-task-project').text(
        taskData.data.project.name + ' : ' + taskData.data.entry_name
      );

      // Task visibility
      if (taskData.data.visibility) {
        newHTML.find('.ws-task-visibility').text('私密').addClass('ws-task-status-deleted');
      }

      // Task assignment
      if (taskData.data.assignment) {
        newHTML.find('.ws-task-assign')
          .append($('<label>', { text: '指派给: ' }))
          .append($('<span>', {
             class: 'ws-content-user',
             text: '@' + taskData.data.assignment.assignee.display_name
           }));
      } else {
        newHTML.find('.ws-task-assign')
          .append($('<label>', { text: '指派给: ' }))
          .append($('<span>', { text: '未设定' }));
      }

      // Task start date
      if (taskData.data.begin_date) {
        newHTML.find('.ws-task-begin-date')
          .append($('<label>', { text: '开始时间: ' }))
          .append($('<span>', {
             class: 'ws-content-begin-date',
             text: dueTimeFormat(taskData.data.begin_date.date, taskData.data.begin_date.with_time)
          }));
      };

      // Task due date
      var due_date = '';
      if (taskData.data.due_date) {
        due_date = dueTimeFormat(taskData.data.due_date.date, taskData.data.due_date.with_time);
      } else {
        due_date = '未设定';
      }
      newHTML.find('.ws-task-due-date')
        .append($('<label>', { text: '截止时间: ' }))
        .append($('<span>', {
           class: 'ws-content-due-date',
           text: due_date
         }));

      // Task priority
      newHTML.find('.ws-task-priority')
        .append($('<label>', { text: '优先级: ' }))
        .append(priorityFormat(taskData.data.priority));

      // Task description
      newHTML.find('.ws-content-container').html(
        taskData.data.description ?
          mdParser(taskData.data.description) : "没有绵羊 ( ⊙_⊙)"
      );

      // Task subtasks
      if (taskData.data.children.length > 0) {
        var subtask_container = newHTML.find('.ws-subtask-container').removeClass('hidden').find('ul');
        var sorted_subtasks = taskData.data.children.sort(function(a, b){
          return a.position - b.position;
        });
        sorted_subtasks.forEach(function(t) {
          subtask_container.append(function(){
            var subtask_li = $('<li>', {
              class: 'pure-menu-item'
            });
            return subtask_li.append($('<a>', {
              class: 'pure-menu-link',
              text: t.title,
              href: CONST.URL_TASKCODE_PREFIX + t._id
            }));
          });
        });
      }

      // Task parent
      if (taskData.data.parent) {
        newHTML.find('.ws-task-parent').removeClass('hidden')
        .append($('<label>', {
          text: '父任务: '
        }))
        .append($('<a>', {
          text: taskData.data.parent.title,
          href: CONST.URL_TASKCODE_PREFIX + taskData.data.parent._id
        }));
      }

      // TODO: Add tags
      // TODO: Add attachments
      // TODO: Add watchers
      // TODO: Current markdown lack:
      // strikethrough
      // table
      // number list miss-change original number to sequence

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
          text: moment(e.updated_at*1000).format('MM-DD HH:mm')
        })).append( $("<div>", {
          class: "ws-comment-content",
          html: mdParser(e.content)
        }));
        comms.append(comm);
      });
      // TODO: Add activities.


      $('body').html(ctCSS());
      newHTML.appendTo('body');
    }
  });
})();

    /* endinject */
  }

})();
