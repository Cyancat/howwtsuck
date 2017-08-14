// ==UserScript==
// @name         HowWTSucks
// @namespace    https://reimu.worktile.com/
// @version      0.4.3
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
    *{color:#333;box-sizing:border-box}img{max-width:100%}blockquote{background-color:#f1f1f1;margin-left:0;padding:1px 10px}.secondary-text{color:#999;font-size:12px}code{color:#c7254e;background:rgba(0,0,0,.04);font-family:Consolas,"Liberation Mono",Menlo,Courier,monospace;padding:0 .2em}.fit_to_origin{width:auto}.fit_to_width{width:auto;max-width:100%}.fit_to_height{width:auto;height:auto;max-width:100%;max-height:100%;position:fixed}.ws-comment-attachment{display:flex}.ws-comment-attachment label{color:#999}.ws-comment-attachment .ws-comment-attachment-container{margin-left:10px}.ws-comment-attachment .ws-comment-attachment-container ul{margin:0;padding:0;list-style:none}.container{margin-left:20px}.ws-task-status-container{padding:0 20px}.ws-title-container{padding:0 20px 20px}.ws-comments-container,.ws-issue-container{padding:20px}.ws-task-status{padding:5px 10px;float:left}.ws-task-status.ws-task-status-progress{background-color:#ffd889}.ws-task-status.ws-task-status-fin{background-color:#c3eeee}.ws-task-status.ws-task-status-archived{background-color:#ffe9e9}.ws-task-status.ws-task-status-deleted{background-color:#db9797;color:#fff}.ws-task-status.ws-task-parent{float:right;background-color:#e6e9eb}.ws-task-project{float:left;padding:5px 10px;background-color:#b3c4c3}.ws-task-meta{float:left;margin-right:20px}.ws-task-meta label{font-weight:700}.ws-title-meta{font-size:14px;margin-left:10px}.ws-comments-container{border-left:1px solid #ccc;padding-bottom:160px}.ws-comment{margin-bottom:30px}.ws-comment-time{margin-left:5px}.ws-comment-content{margin-top:5px}.ws-comment-content>p{margin:5px 0}.ws-comment-reply{position:fixed;bottom:0;padding-right:50px;background:#fff}.ws-comment-reply textarea{width:100%;min-height:100px}.ws-content-user{color:#91d6d5}.ws-content-tasklink{color:#f9a5a1}.ws-content-tasklink:hover{color:#a23607}.ws-subtask-container{margin-top:50px} \
    ');
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

  /* include:config.js */
  var CONST = {
  URL_BASE: 'https://reimu.worktile.com',
  URL_TASKNO_PREFIX: 'https://help.worktile.com/taskno/',
  URL_TASKCODE_PREFIX: 'https://help.worktile.com/taskcode/',
  URL_PUBLIC_IMAGE_PREFIX: 'https://help.worktile.com/public_image/',
  URL_TASK_ACTIVE: 'https://help.worktile.com/active',
  TEAM_ID: '5837fe300d084d66c710fd0e'
};

CONST.URL_API_COMMENT = CONST.URL_BASE + '/api/comment';

var RCONST = {
  URL_WT_BASE: /^https:\/\/reimu\.worktile\.com/,
  URL_HWT_TASKNO: /^https:\/\/help.worktile.com\/taskno/,
  URL_HWT_TASKCODE: /^https:\/\/help.worktile.com\/taskcode/,
  URL_HWT_IMAGE: /^https:\/\/help.worktile.com\/image/,
  URL_HWT_PUBLIC_IMAGE: /^https:\/\/help.worktile.com\/public_image/,
  URL_HWT_ACTIVE: /^https:\/\/help.worktile.com\/active/
};

  /* endinject */

  /* include:inc/common.js */
  var util = {
  builder: {},
  commonmark: {}
};

util.cleanHTML = function() {
  unsafeWindow.document.documentElement.innerHTML = '';
  util.globalNotice('Loading data...');
  ctCSS();
};

util.globalNotice = function(t) {
  $('body').html('<h1>' + t + '</h1>');
};

util.builder.attachments = function(data) {
  var html = $("<ul>", {
    class: "ws-attachment"
  });

  data.forEach(function(at){
    var at_a = $("<a>").appendTo( $("<li>").appendTo(html) );

    if (at.addition.thumbnail == "") {
      at_a.prop("href", "https://reimu.worktile.com/files/" + at._id + "/preview?from=attachment&version=" + at.addition.current_version)
          .prop("text", at.title)
          .prop("target", "_blank");
    } else {
      at_a.prop("href", "https://help.worktile.com/image/" + at._id + "/" + at.ref_id + "/" + at.addition.current_version)
          .prop("text", at.title)
          .prop("target", "_blank");
    }
  });

  return html;
};

util.builder.dueTimeFormat = function(d, t) {
  return moment(d*1000).format(t != 0 ? 'MM-DD HH:mm' : 'MM-DD');
};

util.builder.priorityFormat = function(p) {
  switch(p) {
    case 0: return '未设定'; break;
    case 1: return '低'; break;
    case 2: return '中'; break;
    case 3: return '高'; break;
    default: return '啥玩意？？';
  }
};

util.commonmark.tcr = new commonmark.Parser();
util.commonmark.tc = new commonmark.HtmlRenderer();

util.commonmark.mdParser = function(c) {
  // Markdown parse combined with worktile custom link.
  return this.tc.render(this.tcr.parse(c))
          .replace(/\n([^\<])/gi, "<br>$1") // Fix a wired situation
          .replace(/\[@.*\|(.*)\]/, '<span class="ws-content-user">@$1</span>') // @
          .replace(/\[#task-(.*)\|(.*)\]/, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>') // Task link
          .replace(/(^|[^"'])((http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, '$1<a target="_blank" href="$2">$2</a>'); // URL format ( for markdown lack)
          // TODO: Remove mac mark! See task #1615

          // TODO: Current markdown lack:
          // strikethrough
          // table
          // number list miss-change original number to sequence
  ;
};

  /* endinject */

  if (RCONST.URL_WT_BASE.test(window.location.href)) {
    /* include:inc/event.js */
    (function() {

    var tcc = 0;
    var tc = setInterval(function(){
      if ( $('.nav-apps').length > 0 ) {
        clearInterval(tc);

        var navi_c = $('<li>').append(
              $('<a>', {
                target: '_blank',
                href: CONST.URL_TASK_ACTIVE,
                class: 'app-item pbox-trigger-other-apps'
              }).append(
                $('<span>', {
                  class: 'item-icon'
                }).append($('<i>',{
                  class: 'wtf icon-default',
                  style: 'font-size: 14px;',
                  text: '|ω･`)ﾁﾗｯ'
                })).append($('<i>',{
                  class: 'wtf icon-hover',
                  style: 'font-size: 14px;',
                  text: '|ω･`)ﾁﾗｯ'
                }))
              ).append( $('<span>', {
                class: 'name',
                text: '动态'
              }))
            );

          $('.nav-apps').prepend(navi_c);

      }

      tcc++;
      if (tcc >= 30) {
        clearInterval(time_h);
      }
    }, 300);


    unsafeWindow.document.addEventListener('click', function(e){
        var time_count = 0;
        var time_h = setInterval(function(){
          if( $('.entity-detail').length > 0 ) {
              clearInterval(time_h);

              // Already executed, so skip
              if ($('.wt-header-tasklink').length > 0) {
                return;
              }

              var d_taskNum_cand = $('.entity-detail .modal-row.modal-row-aside .pull-right.ng-binding');
              // Because worktile 6.0 kill the featured class, so only the structure class could be used
              // So the 'each' is an insurance
              d_taskNum_cand.each(function(k, c) {
                var taskno = /任务编号: (\d*)/.exec($(c).text());
                if ( taskno.length > 0 ) {
                  var title_link = $('<span>', {
                      class: 'modal-detail-header-title-desc wt-header-tasklink',
                    }).append($('<i>', {
                      class: 'lcfont lc-hr'
                    })).append(' ').append( $('<a>', {
                      text: taskno[1],
                      target: '_blank',
                      href: CONST.URL_TASKNO_PREFIX + taskno[1]
                    }));

                  $(c).parents('.modal-content').find('.modal-detail-header-left')
                    .append(title_link)
                    .find('.m-l-20').remove();
                  $(c).html('任务编号: <a target="_blank" href="' + CONST.URL_TASKNO_PREFIX + taskno[1] + '">' + taskno[1] + '</a>');
                }
              });

              $('.entity-detail .desc img').replaceWith(function(){
                return $('<a>', {
                    href: CONST.URL_PUBLIC_IMAGE_PREFIX + /^https:\/\/wt-box\.worktile\.com\/public\/(.*)/.exec($(this).prop('src'))[1],
                    target: "_blank"
                    }).append($('<img>', {
                      src: $(this).prop('src'),
                      alt: $(this).prop('alt')
                    }));
              });
          }

          time_count++;
          if (time_count >= 8) {
            clearInterval(time_h);
          }
        }, 300);
    }, false);

})();

    /* endinject */
  }
  else if (RCONST.URL_HWT_TASKNO.test(window.location.href) || RCONST.URL_HWT_TASKCODE.test(window.location.href)) {
    util.cleanHTML();

    /* include:inc/task/init.js */
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

var api_url = task_no != '' ? ("https://reimu.worktile.com/api/tasks/no/" + task_no) : ("https://reimu.worktile.com/api/tasks/" + task_code);

GM_xmlhttpRequest({
  method: "GET",
  url: api_url,
  onload: renderTask
});

    /* endinject */

    function renderTask(res) {

      var newHTML = $(ctHTML());

      /* include:inc/task/preprocess.js */
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

      /* endinject */

      /* include:inc/task/head.js */
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
       text: util.builder.dueTimeFormat(taskData.data.begin_date.date, taskData.data.begin_date.with_time)
    }));
};

// Task due date
var due_date = '';
if (taskData.data.due_date) {
  due_date = util.builder.dueTimeFormat(taskData.data.due_date.date, taskData.data.due_date.with_time);
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
  .append(util.builder.priorityFormat(taskData.data.priority));

      /* endinject */

      /* include:inc/task/main.js */
      // Task description
newHTML.find('.ws-content-container').html(
  taskData.data.description ?
    util.commonmark.mdParser(taskData.data.description) : "没有绵羊 ( ⊙_⊙)"
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
// TODO: Add tags
// TODO: Add attachments
// TODO: Add watchers

      /* endinject */

      /* include:inc/task/comments.js */
      var comms = newHTML.find('.ws-comments-container');

taskData.data.comments.forEach(function(e){
  var comm = $("<div>", {
    class: "ws-comment"
  });

  // Comment main content
  comm.append( $("<span>", {
    class: "ws-comment-creator",
    text: e.created_by.display_name
  })).append( $("<span>", {
    class: "ws-comment-time secondary-text",
    text: moment(e.updated_at*1000).format('MM-DD HH:mm')
  })).append( $("<div>", {
    class: "ws-comment-content",
    html: util.commonmark.mdParser(e.content)
  }));

  // Comment attachments
  if (e.attachments.length > 0) {
    $("<div>", {
      class: "ws-comment-attachment"
    }).appendTo(comm)
      .append( $("<label>", {
        class: "ws-comment-attachment-label",
        text: "附件:"
      }))
      .append( $("<div>", {
        class: "ws-comment-attachment-container"
      }));

    comm.find('.ws-comment-attachment-container').append(util.builder.attachments(e.attachments));
  };

  comms.append(comm);
});


var reply_form = $('<form>', {
  class: 'pure-form pure-u-1-2 ws-comment-reply'
});

var reply_data = {
  content: reply_form.find('textarea').text(),
  type: 2,
  id: taskData.data._id,
  attachments: []
};

$("<fieldset>", {
    class: 'pure-group'
  }).append( $("<textarea>", {
    placeholder: '在此添加回复',
    change: function(){
      reply_data.content = this.value;
    },
    keydown: function(e){
      if (e.ctrlKey && e.keyCode == 13) {
        $(this).change();
        $('.ws-comment-reply').submit();
      }
    }
  })).append( $('<button>', {
    type: 'submit',
    class: 'pure-button pure-input-1-5 pure-button-primary',
    text: '回复'
  }))
  .appendTo(reply_form);

reply_form.submit(function(){
  GM_xmlhttpRequest({
    method: "POST",
    url: CONST.URL_API_COMMENT + '?t=' + moment(new Date()).format('x'),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    data: JSON.stringify(reply_data)
  });
});

reply_form.appendTo(comms);

      /* endinject */

      newHTML.appendTo('body');

    }
  }
  else if (RCONST.URL_HWT_IMAGE.test(window.location.href) || RCONST.URL_HWT_PUBLIC_IMAGE.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/drive_image.js */
    var params = null;

var make_image = function(tar) {

  $("<a>", {
    href: "javascript:;"
    })
    .append( $("<img>", {
      src: tar,
      class: "fit_to_width"
    }))
    .click(function(){
      var img = $(this).find('img');
      if (img.prop('class') == 'fit_to_width') {
        img.prop('class', 'fit_to_origin');
      }
      else if (img.prop('class') == 'fit_to_origin') {
        img.prop('class', 'fit_to_height');
      }
      else {
        img.prop('class', 'fit_to_width');
      }
    })
    .appendTo( $('body').html('') );
};

if (/^https:\/\/help.worktile.com\/image/.test(window.location.href)) {

  params = /^https:\/\/help.worktile.com\/image\/(.*)\/(.*)\/(\d*)/.exec(window.location.href);
  var _id = params[1],
      ref_id = params[2],
      current_version = params[3];

  make_image("https://wt-box.worktile.com/drives/" + _id + "/from-s3?team_id=" + CONST.TEAM_ID + "&version=" + current_version + "&ref_id=" + ref_id);

}
else if (/^https:\/\/help.worktile.com\/public_image/.test(window.location.href)) {
  params = /^https:\/\/help.worktile.com\/public_image\/(.*)/.exec(window.location.href);
  var _id = params[1];

  make_image("https://wt-box.worktile.com/public/" + _id);

}

    /* endinject */
  }
  else if (RCONST.URL_HWT_ACTIVE.test(window.location.href)) {
    util.cleanHTML();
    /* include:inc/task/active.js */
    console.log('That is ACTIVE!');

    /* endinject */
  }

})();
