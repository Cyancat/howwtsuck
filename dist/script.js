// ==UserScript==
// @name         HowWTSucks
// @namespace    https://reimu.worktile.com/
// @version      0.7
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
    *{color:#333;box-sizing:border-box}img{max-width:100%}blockquote{background-color:#f1f1f1;margin-left:0;padding:1px 10px}.secondary-text{color:#999;font-size:12px}code{color:#c7254e;background:rgba(0,0,0,.04);font-family:Consolas,"Liberation Mono",Menlo,Courier,monospace;padding:0 .2em}.fit_to_origin{width:auto}.fit_to_width{width:auto;max-width:100%}.fit_to_height{width:auto;height:auto;max-width:100%;max-height:100%;position:fixed}.ws-attachments{display:flex}.ws-attachments label{color:#999}.ws-attachments .ws-attachments-container{margin-left:10px}.ws-attachments .ws-attachments-container ul{margin:0;padding:0;list-style:none}.ws-attachments .ws-attachments-container ul a.active{background-color:#eee}.container{margin-left:20px}.ws-task-status-container{padding:0 20px}.ws-title-container{padding:0 20px 20px}.ws-comments-container,.ws-issue-container{padding:20px}.ws-task-tags ul{display:inline;margin:0;padding:0}.ws-task-tags ul li{display:inline;list-style:none}.ws-task-tags ul li:after{content:", "}.ws-task-tags ul li:last-child:after{content:""}.ws-task-status{padding:5px 10px;float:left;text-decoration:none}.ws-task-status.ws-task-status-progress{background-color:#ffd889}.ws-task-status.ws-task-status-fin{background-color:#c3eeee}.ws-task-status.ws-task-status-archived{background-color:#ffe9e9}.ws-task-status.ws-task-status-deleted{background-color:#db9797;color:#fff}.ws-task-status.ws-task-parent{float:right;background-color:#e6e9eb}.ws-task-project{float:left;padding:5px 10px;background-color:#b3c4c3}.ws-task-meta{float:left;margin-right:20px}.ws-task-meta label{font-weight:700}.ws-task-meta-edit{font-size:10px;margin-left:10px}.ws-title-meta{font-size:14px;margin-left:10px}.ws-comments-container{border-left:1px solid #ccc;padding-bottom:160px}.ws-comment{margin-bottom:30px}.ws-comment-time{margin-left:5px}.ws-comment-content{margin-top:5px}.ws-comment-content>p{margin:5px 0}.ws-comment-reply{position:fixed;bottom:0;padding-right:50px;background:#fff}.ws-comment-reply textarea{width:100%;min-height:100px}.wt-comment-at-container{margin:.35em 0 0;position:absolute;border:1px solid #ccc;width:50%;background-color:#fff}.wt-comment-at-container a.active{background-color:#eee}.ws-selectMenu{position:absolute;left:0;top:0;border:1px solid #ccc;width:200px;background:#fff}.ws-selectMenu ul.pure-menu-list{max-height:200px;overflow:scroll}.ws-selectMenu input[type=text]{width:100%;border-radius:0!important}.ws-selectMenu a.pure-menu-link{cursor:pointer}.ws-selectMenu a.pure-menu-link .ws-selectMenu-selected{float:right;margin-right:5px}.ws-selectMenu a.pure-menu-link.active{background-color:#eee!important}.ws-selectMenu a.pure-menu-link:hover{background-color:transparent}.ws-content-user{color:#91d6d5;margin-right:10px}.ws-content-tasklink{color:#f9a5a1;margin-right:10px}.ws-content-tasklink:hover{color:#a23607}.ws-subtask-container{margin-top:50px} \
    ');
  }

  function ctHTML() {
    return ' \
    <div class="pure-g container"> \
  <div class="ws-task-status-container pure-u-1"> \
    <span class="ws-task-status ws-task-parent hidden"></span> \
    <a href="javascript:;" class="ws-task-stage ws-task-status"></a> \
    <span class="ws-task-project"></span> \
    <span class="ws-task-visibility ws-task-status"></span> \
  </div> \
  <div class="ws-title-container pure-u-1"> \
    <h1><span class="ws-title-meta"></span></h1> \
    <span class="ws-task-meta ws-task-assign"></span> \
    <span class="ws-task-meta ws-task-begin-date"></span> \
    <span class="ws-task-meta ws-task-due-date"></span> \
    <span class="ws-task-meta ws-task-priority"></span> \
    <span class="ws-task-meta ws-task-tags"> \
      <label>标签: </label> \
      <ul></ul> \
    </span> \
  </div> \
  <div class="ws-issue-container pure-u-1-2"> \
    <div class="ws-content-container pure-u-1"> \
      <pre></pre> \
    </div> \
    <div class="ws-task-attachments ws-attachments hidden"> \
      <label>附件:</label> \
      <div class="ws-attachments-container"></div> \
    </div> \
    <div class="ws-subtask-container hidden"> \
      <h2>子任务</h2> \
      <ul class="pure-menu-list"></ul> \
    </div> \
    <div class="ws-watchers-container hidden"> \
      <h2>相关人员</h2> \
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
CONST.URL_API_CHAT = CONST.URL_BASE + '/api/team/chats';
CONST.URL_API_TASKNO = CONST.URL_BASE + '/api/tasks/no/';
CONST.URL_API_TASKCODE = CONST.URL_BASE + '/api/tasks/';
CONST.URL_API_MESSAGE = CONST.URL_BASE + '/api/pigeon/messages';
CONST.URL_API_READ_MESSAGE = CONST.URL_BASE + '/api/unreads/';
CONST.URL_API_TEAM = CONST.URL_BASE + '/api/team';
CONST.URL_API_TAGS = CONST.URL_BASE + '/api/tags';

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
  url: {},
  commonmark: {},
  datamark: {},
  datahandle: {}
};

util.cleanHTML = function() {
  unsafeWindow.document.documentElement.innerHTML = '';
  util.globalNotice('Loading data...');
  ctCSS();
};

util.globalNotice = function(t) {
  $('body').html('<h1>' + t + '</h1>');
};

util.getUnixtime = function() {
  return moment(new Date()).format('x');
};

util.builder.attachments = function(data) {
  var html = $("<ul>", {
    class: "ws-attachments-list"
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
    case '不设定': return 0; break;
    case '高': return 3; break;
    case '中': return 2; break;
    case '低': return 1; break;
    default: return '啥玩意？？';
  }
};

util.builder.tags = function(tags_html) {
  tags_html.find('li').remove();
  util.tags.forEach(function(t, l){
    if (util.tags_key[t.name].ttag_mark == true) {
      tags_html.append( $('<li>', { text: t.name }));
    }
  });
}









util.url.taskcode = function(tc) {
  return CONST.URL_TASKCODE_PREFIX + tc;
};

util.url.team = function() {
  return CONST.URL_API_TEAM + '?t=' + util.getUnixtime();
};

util.url.submit_comment = function() {
  return CONST.URL_API_COMMENT + '?t=' + util.getUnixtime();
};

util.url.read_message = function(ref_id, message_id) {
  return CONST.URL_API_READ_MESSAGE + ref_id + '/messages/' + message_id + '/unread?t=' + util.getUnixtime();
};

util.url.task_api = function(task_id) {
  return CONST.URL_API_TASKCODE + task_id + '?t=' + util.getUnixtime();
};

util.url.task_assign = function(task_id, assignee_id) {
  return CONST.URL_API_TASKCODE + task_id + '/assign/' + assignee_id + '?aid=&t=' + util.getUnixtime();
};

util.url.tags = function() {
  return CONST.URL_API_TAGS + '?type=2&t=' + util.getUnixtime();
};

util.url.tags_modify = function(task_id, tag_id) {
  return CONST.URL_API_TASKCODE + task_id + '/tags/' + tag_id + '?t=' + util.getUnixtime();
};









util.commonmark.tcr = new commonmark.Parser();
util.commonmark.tc = new commonmark.HtmlRenderer();

util.commonmark.mdParser = function(c) {
  // Markdown parse combined with worktile custom link.
  return this.tc.render(this.tcr.parse(c))
          .replace(/\n([^\<])/gi, "<br>$1") // Fix a wired situation
          .replace(/~~(.+?)~~/g, '<strike>$1</strike>') // strikethrough format
          .replace(/\[@.+?\|(.+?)\]/g, '<span class="ws-content-user">@$1</span>') // @ user
          .replace(/\[#task-(.+?)\|(.+?)\]/g, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>') // Task link
          .replace(/(^|[^"'])((http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, '$1<a target="_blank" href="$2">$2</a>'); // URL format ( for markdown lack)
          // TODO: Remove mac mark! See task #1615
          // TODO: Some regexp bug, see task #3577; hmmm may be resolved?

          // TODO: Current markdown lack:
          // table
          // NOT TODO: number list miss-change original number to sequence = this do is the setting
  ;
};










GM_xmlhttpRequest({
  method: 'GET',
  url: util.url.team(),
  onload: function(res){

    util.members = JSON.parse(res.responseText).data.members.filter(function(m){
      return m.name.indexOf('bot_') == -1;
    });

    util.members_key = {};
    util.members.forEach(function(m) {
      util.members_key[m.name] = m;
    });

  },
  synchronous: true
});

util.datamark.tags = false;
GM_xmlhttpRequest({
  method: 'GET',
  url: util.url.tags(),
  onload: function(res1){

    util.tags = JSON.parse(res1.responseText).data;

    util.tags_key = {};
    util.tags.forEach(function(m) {
      util.tags_key[m.name] = m;
      util.tags_key[m.name].ttag_mark = false;
    });

    util.datamark.tags = true;

  },
  synchronous: true
});








util.builder.selectMenu = function(x, y, entries, hasInput, cb) {

  var newMenu_input = '';

  if (hasInput) {
    newMenu_input =
      $('<form>', {
        class: 'pure-form'
        }).append($('<input>', {
          type: 'text',
          keydown: function(e) {
            if ( e.keyCode == 38 || e.keyCode == 40) {
              // Up = 38, Down = 40
              var $menuParent = $(this).parents('.ws-selectMenu'),
                  $current_sel = $menuParent.find('.pure-menu-list .active'),
                  $prev_li, $next_li;

              if ($current_sel.length > 0) {
                $prev_li = $current_sel.parent().prev();
                $next_li = $current_sel.parent().next();

                if ( e.keyCode == 38 && $prev_li.length > 0) {
                  $prev_li.find('.pure-menu-link').addClass('active');
                  $current_sel.removeClass('active');
                }
                if ( e.keyCode == 40 && $next_li.length > 0) {
                  $next_li.find('.pure-menu-link').addClass('active');
                  $current_sel.removeClass('active');
                }
              } else {
                $menuParent.find('.pure-menu-item:eq(0) .pure-menu-link').addClass('active');
              }

              return false;
            }
          }
        }));
  }
  var newMenu = $('<div>', {
    class: 'pure-menu ws-selectMenu',
    style: 'left: ' + x + 'px; top: ' + y + 'px;'
  }).append(newMenu_input)
  .append($('<ul>', {
    class: 'pure-menu-list'
  }));

  if (entries.length > 0) {
    var menu_ul = newMenu.find('.pure-menu-list');
    entries.forEach(function(en){
      menu_ul.append($('<li>', {
          class: 'pure-menu-item'
          }).append($('<a>', {
            class: 'pure-menu-link',
            text: en,
            click: function(e) {
              cb(en);
            }
          })));
    });

    if (hasInput) {
      util.builder.selectMenu.bindEvent(menu_ul);
    }

    newMenu.appendTo('body');

    $('body').on('click', function(){
      $(newMenu).remove();
      $('body').off('click');
    });
  }

  return newMenu;

};

/** @param tar ul.pure-menu-list
 */
util.builder.selectMenu.bindEvent = function(tar) {
  var $tar_link = $(tar).find('.pure-menu-link');

  // Bind hover
  $tar_link.on('mouseover', function(){
    $tar_link.removeClass('active');
    $(this).addClass('active');
  });

  // "Enter" = click
  $(tar).parent().find('input').keydown(function(e){
    var $current_sel = $(tar).find('.active');
    if (e.keyCode == 13 && $current_sel.length == 1) {
      $current_sel.click();
    }
    else if (e.keyCode == 27) {
      $(tar).parent().remove();
    }
  });

  // Prevent for triggering submit with "enter"
  $(tar).parent().find('form').keypress(function(e){
    return e.keyCode != 13;;
  });
};

//
// selectMemberMenu
//
util.builder.selectMemberMenu = function(x, y, cb) {
  var filtered_members = util.members;

  var selectMenu_gen = function() {
    var menu_ul = newMenu.find('.pure-menu-list');
    menu_ul.html('');
    filtered_members.slice(0,4).forEach(function(me){
      menu_ul.append($('<li>', {
          class: 'pure-menu-item'
        }).append($('<a>', {
            class: 'pure-menu-link',
            text: me.display_name + ' (' + me.name + ')',
            click: function(e){
              cb(me);
            }
          })));
    });
    util.builder.selectMenu.bindEvent(menu_ul);
  };

  var newMenu = util.builder.selectMenu(x, y, [], 1);

  newMenu.find('input').on('input', function(e){
    var input_text = $(this).val();

    filtered_members = util.members.filter(function(m){
      return (m.name.toLowerCase() + m.display_name.toLowerCase() + m.display_name_pinyin.toLowerCase()).indexOf(input_text) != -1;
    }).sort(function(a, b){
      return Math.max(a.name.indexOf(input_text), a.display_name.indexOf(input_text), a.display_name_pinyin.indexOf(input_text)) -
             Math.max(b.name.indexOf(input_text), b.display_name.indexOf(input_text), b.display_name_pinyin.indexOf(input_text));
    }).slice(0,4);

    selectMenu_gen();
  }).click(function(e){
    e.stopPropagation();
  });

  selectMenu_gen();

  newMenu.appendTo('body');
  newMenu.find('input').focus();

  $('body').on('click', function(){
    $(newMenu).remove();
    $('body').off('click');
  });

  return newMenu;
};

//
// selectTagsMenu
//
util.builder.selectTagsMenu = function(x, y, cb, ttags) {
  var filtered_tags = util.tags;
  var selectMenu_gen = function() {
    var menu_ul = newMenu.find('.pure-menu-list');
    menu_ul.html('');
    filtered_tags.forEach(function(tag){

      var mark_html = $('<span>', {
        class: 'ws-selectMenu-selected',
        text: '✓'
      });

      menu_ul.append(
        $('<li>', {
          class: 'pure-menu-item'
        }).append(
          $('<a>', {
            class: 'pure-menu-link',
            text: tag.name,
            click: function(e){
              e.stopPropagation();
              cb(tag, this, mark_html);
            }
          }).append( util.tags_key[tag.name].ttag_mark == true ? mark_html : "" )
          // }).append( mark_html )
        )
      );
    });
    util.builder.selectMenu.bindEvent(menu_ul);
  };

  var newMenu = util.builder.selectMenu(x, y, [], 1);

  newMenu.find('input').on('input', function(e){
    var input_text = $(this).val();

    if (input_text == "") {
      filtered_tags = util.tags;
    } else {
      filtered_tags = util.tags.filter(function(tag){
        return (tag.name.toLowerCase() + tag.name_pinyin.toLowerCase()).indexOf(input_text) != -1;
      }).sort(function(a, b){
        return Math.max(a.name.indexOf(input_text), a.name_pinyin.indexOf(input_text)) -
               Math.max(b.name.indexOf(input_text), b.name_pinyin.indexOf(input_text));
      });
    }

    selectMenu_gen();
  }).click(function(e){
    e.stopPropagation();
  })

  selectMenu_gen();

  newMenu.appendTo('body');
  newMenu.find('input').focus();

  $('body').on('click', function(){
    $(newMenu).remove();
    $('body').off('click');
  });

  return newMenu;
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
                class: 'app-item'
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

          $('.nav-apps:eq(1)').prepend(navi_c);

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

var api_url = task_no != '' ? (CONST.URL_API_TASKNO + task_no) : (CONST.URL_API_TASKCODE + task_code);

GM_xmlhttpRequest({
  method: "GET",
  url: api_url,
  onload: renderTask
});

    /* endinject */

    function renderTask(res) {

      var newHTML = $(ctHTML());

      /* include:inc/task/preprocess.js */
      // Remove loading
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

task_status.click(function(){

});










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
    .append($('<a>', {
       href: 'javascript:;',
       class: 'ws-content-user',
       text: '@' + taskData.data.assignment.assignee.display_name
     }));
} else {
  newHTML.find('.ws-task-assign')
    .append($('<label>', { text: '指派给: ' }))
    .append($('<a>', {
      href: 'javscript:;',
      text: '未设定'
    }));
}

newHTML.find('.ws-task-assign a').click(function(e){
  var assign_this = this;
  var seletMenu = util.builder.selectMemberMenu(e.clientX, e.clientY, function(me){
    // console.log(util.url.task_assign(taskData.data._id, me.uid));
    GM_xmlhttpRequest({
      method: 'PUT',
      url: util.url.task_assign(taskData.data._id, me.uid),
      onload: function(res){
        if (JSON.parse(res.responseText).code == 200) {
          $(assign_this).text('@' + me.display_name);
        }
      }
    });
  });
  seletMenu.find('input').focus();
  e.stopPropagation();
});










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
  .append($('<a>', {
    href: 'javascript:;',
    text: util.builder.priorityFormat(taskData.data.priority),
    click: function(e) {
      var prio_this = this;
      var selectMenu = util.builder.selectMenu(e.clientX, e.clientY, ['高', '中', '低', '不设定'], 0, function(en){
        GM_xmlhttpRequest({
          method: 'PUT',
          url: util.url.task_api(taskData.data._id),
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          data: JSON.stringify({priority: util.builder.priorityFormat(en)}),
          onload: function(res){
            var r = JSON.parse(res.responseText);
            if (r.code == 200) {
              $(prio_this).text(util.builder.priorityFormat(r.data.priority));
            }
          }
        });
      });
      e.stopPropagation();
    }
  }));













// Task tags
var newHTML_tags = newHTML.find('.ws-task-tags');

util.datahandle.tags = setInterval(function(){
  console.log('util.datahandle.tags!');
  if (taskData.data.tags.length > 0 && util.datamark.tags == true) {
    clearInterval(util.datahandle.tags);

    // Task tags datalize
    taskData.data.tags.forEach(function(t,l){
      util.tags.forEach(function(tag){
        if (t.name == tag.name) {
          util.tags_key[tag.name].ttag_mark = true;
        }
      });
    });

    util.builder.tags(newHTML_tags.find('ul'));

    newHTML_tags.append( $('<a>', {
      class: 'ws-task-meta-edit',
      href: 'javascript:;',
      text: '编辑标签',
      click: function(e){
        e.stopPropagation();
        var selectMenu = util.builder.selectTagsMenu(e.clientX, e.clientY, function(stag, menu_a, sel_html){
            if (util.tags_key[stag.name].ttag_mark == true) {
              // console.log('DELETE: ' + util.url.tags_modify(taskData.data._id, util.tags_key[stag.name]._id));
              GM_xmlhttpRequest({
                method: 'DELETE',
                url: util.url.tags_modify(taskData.data._id, util.tags_key[stag.name]._id),
                onload: function(res){
                  var r = JSON.parse(res.responseText);
                  if (r.code == 200) {
                    $(menu_a).find('.ws-selectMenu-selected').remove();
                    util.tags_key[stag.name].ttag_mark = false;
                    util.builder.tags(newHTML_tags.find('ul'));
                  }
                }
              });
            } else {
              // console.log('PUT: ' + util.url.tags_modify(taskData.data._id, util.tags_key[stag.name]._id));
              GM_xmlhttpRequest({
                method: 'POST',
                url: util.url.tags_modify(taskData.data._id, util.tags_key[stag.name]._id),
                onload: function(res){
                  var r = JSON.parse(res.responseText);
                  if (r.code == 200) {
                    util.tags_key[stag.name].ttag_mark = true;
                    $(menu_a).append(sel_html);
                    util.builder.tags(newHTML_tags.find('ul'));
                  }
                }
              });
            }
          }, taskData.data.tags);
      }
    }) );
  }
}, 100);

      /* endinject */

      /* include:inc/task/main.js */
      // Task description
newHTML.find('.ws-content-container').html(
  taskData.data.description ?
    util.commonmark.mdParser(taskData.data.description) : "没有绵羊 ( ⊙_⊙)"
);

// Task attachments
if (taskData.data.attachments.length > 0) {
  newHTML.find('.ws-task-attachments').removeClass('hidden').find('.ws-attachments-container')
    .append(util.builder.attachments(taskData.data.attachments));
}

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

// Task watchers
if (taskData.data.watchers.length > 0) {
  var watchers_container = newHTML.find('.ws-watchers-container').removeClass('hidden').find('ul');
  taskData.data.watchers.forEach(function(w){
    watchers_container.append(function(){
      var subtask_li = $('<li>', {
        class: 'pure-menu-item',
        text: w.display_name
      });
      return subtask_li;
    });
  });
}

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
      class: "ws-attachments"
    }).appendTo(comm)
      .append( $("<label>", {
        text: "附件:"
      }))
      .append(
        $("<div>", {
          class: "ws-attachments-container"
        }).append(util.builder.attachments(e.attachments))
      );
  };

  comms.append(comm);
});


var reply_form = $('<form>', {
  class: 'pure-form pure-u-1-2 ws-comment-reply'
});

var reply_data = {
  content: reply_form.find('textarea').val(),
  type: 2,
  id: taskData.data._id,
  attachments: []
};

var $comment_at = $("<ul>", {
  class: 'pure-menu-list'
});

var comment_at = {
  flag: false,
  start: 0,
  removeList: function() {
    comment_at.flag = false;
    $comment_at.parent().hide();
  },
  updateList: function($comment_textarea) {

    comment_at.textlo = comment_at.text.toLowerCase();
    // console.log(comment_at.textlo);

    comment_at.mb = util.members.filter(function(m){
      return (m.name.toLowerCase() + m.display_name.toLowerCase() + m.display_name_pinyin.toLowerCase()).indexOf(comment_at.textlo) != -1;
    }).sort(function(a, b){
      return Math.max(a.name.indexOf(comment_at.textlo), a.display_name.indexOf(comment_at.textlo), a.display_name_pinyin.indexOf(comment_at.textlo)) -
             Math.max(b.name.indexOf(comment_at.textlo), b.display_name.indexOf(comment_at.textlo), b.display_name_pinyin.indexOf(comment_at.textlo));
    }).slice(0,4);

    $comment_at.html('');
    $comment_at.parent().css('top', -comment_at.mb.length * 38 + 'px');

    comment_at.mb.forEach(function(m, m_c){
      $comment_at.append(
        $('<li>', {
          class: 'pure-menu-item'
        }).append( $('<a>', {
          class: 'pure-menu-link' + (m_c == 0? ' active' : ''),
          text: m.display_name + ' (' + m.name + ')',
          'data-name': m.name,
          hover: function() {
            $(this).parent().parent().find('a.pure-menu-link').removeClass('active');
            $(this).addClass('active');
          }
        }))
      );
    });

    $comment_at.parent().show();

  }
};

$("<fieldset>", {
    class: 'pure-group'
  }).append( $("<textarea>", {
    placeholder: '在此添加回复',
    change: function() {
      reply_data.content = this.value;
    },
    keydown: function(e) {
      var $this = $(this);
      if ((e.ctrlKey && e.keyCode == 13)
      || (e.metaKey && e.keyCode == 13)) {
        $this.change();
        $('.ws-comment-reply').submit();
      }

      // console.log($this.prop("selectionStart") - comment_at.start);
      if ( comment_at.flag == true ) {

        // Get current @ text without this keydown input
        comment_at.text = $this.val().substring(comment_at.start + 1, $this.prop("selectionStart"));


        // Because keydown is triggered before the key actually changed textarea's value
        // The @ text should be fixed with the key
        if ( e.keyCode == 46 || e.keyCode == 8) {
          // Delete and backspace
          if ($this.prop("selectionStart") - comment_at.start <= 1) {
            comment_at.removeList();
            return false;
          } else {
            comment_at.text = comment_at.text.substr(comment_at.start, comment_at.text.length - 1);
          }

        }
        else if ( e.keyCode == 38) {
          // Up
          var $current_sel = $comment_at.find('.active'),
              $prev_li = $current_sel.parent().prev();

          if ( $prev_li.length > 0) {
            $prev_li.find('.pure-menu-link').addClass('active');
            $current_sel.removeClass('active');
          }

          return false;
        }
        else if ( e.keyCode == 40 ) {
          // Down
          var $current_sel = $comment_at.find('.active'),
              $next_li = $current_sel.parent().next();

          if ( $next_li.length > 0) {
            $next_li.find('.pure-menu-link').addClass('active');
            $current_sel.removeClass('active');
          }

          return false;
        }
        else if ( e.keyCode == 27 ) {
          // Esc

          $this.val(
            $this.val().substring(0, comment_at.start) +
            $this.val().substring($this.prop("selectionStart"), $this.val().length)
          );
          // console.log(
          //   $this.val().substring(0, comment_at.start) +
          //   $this.val().substring($this.prop("selectionStart"), $this.val().length)
          // );
          comment_at.removeList();

          return false;
        }
        else if ( e.keyCode == 13 ) {
          // Enter
          var ta_value = $this.val(),
              current_pos = $this.prop("selectionStart"),
              a_name = $('.wt-comment-at-container').find('a.active').attr('data-name');

          // console.log(ta_value.substring(comment_at.start + a_name.length - 1, comment_at.start + a_name.length));
          $this.val(
            ta_value.substring(0, comment_at.start) +
            '@' + a_name +
            (ta_value.substring(comment_at.start + a_name.length, comment_at.start + a_name.length + 1) == ' '? '':' ') + // if there is a space behind the @name, if not, add a space.
            ta_value.substring($this.prop("selectionStart"), ta_value.length)
          );

          // Move cursor back to just behind the @name plus 1 space
          $this.prop('selectionEnd', comment_at.start + a_name.length + 2);
          comment_at.removeList();

          return false;
        }
        else {

          // Start deal non-functional key

          // Keydown event will trigger before the textarea val actually changed
          comment_at.text += String.fromCharCode(e.keyCode);
        }

        comment_at.updateList($this);

      } else {
        // comment_at.flag == false

        if ( e.keyCode == 64 || (e.shiftKey && e.keyCode == 50)) {
          // Direct @ or shft + 2
          comment_at.start = $this.prop("selectionStart");
          comment_at.flag = true;
          // console.log(util.members);
        }
      }


    }
  })).append( $('<button>', {
    type: 'submit',
    class: 'pure-button pure-input-1-5 pure-button-primary',
    text: '回复'
  })).append( $('<div>', { class: 'wt-comment-at-container pure-menu pure-menu-scrollable'}).append($comment_at).hide() )
  .appendTo(reply_form);

reply_form.submit(function(){
  // TODO: replace @ person and tasknumber then submit
  var $this = $(this),
      $ta = $this.find('textarea'),
      current_ta = $ta.val(),
      ta_matches = current_ta.match(/@.+?\s/gi);

  if ( ta_matches != null ) {
    ta_matches.forEach(function(m){
      var m_only = m.substring(1, m.length-1),
          m_id = util.members_key[m_only].uid,
          m_dname = util.members_key[m_only].display_name;
      current_ta = current_ta.replace(eval('/@' + m_only + '/i'), '[@' + m_id + '|' + m_dname + ']');
    });

    reply_data.content = current_ta;
  }

  // console.log(reply_data);

  GM_xmlhttpRequest({
    method: "POST",
    url: util.url.submit_comment(),
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
    /* include:inc/activity/main.js */
    // Get TaskAssistant ref_id
var ta_ref_id = '',
    tasks_activity = [];

var deal_task_activity = function(res) {

  var ori_messages = JSON.parse(res.responseText).data.messages;
  ori_messages.forEach(function(e){

    // Format a task activity info from original source
    var m_data = {
      id: e._id,
      taskcode: e.body.inline_attachment.title_link,
      update_time: e.created_at,
      status: e.body.inline_attachment.pretext,
      title: e.body.inline_attachment.title,
      comment: e.body.inline_attachment.text,
      is_unread: e.is_unread == 0 ? false:true
    };

    if (e.body.inline_attachment.fields.length > 0) {
      e.body.inline_attachment.fields.forEach(function(f){
        switch (f.title) {
          case '负责人':
            m_data.assign = f.value;
            break;
          case '截止日期':
            m_data.duedate = f.value;
            break;
        }
      });
    }

    // If task not exist, create a Task Activity(TA) group.
    var current_ta = tasks_activity.find(function(ta){
      return ta.taskcode == m_data.taskcode;
    });

    if (current_ta === undefined) {
      current_ta = tasks_activity[tasks_activity.push({
        taskcode: m_data.taskcode,
        title: m_data.title,
        is_unread: false,
        activity: []
      }) - 1];
    }

    // Push activity to a Task Activity(TA) group
    if (m_data.is_unread == true) {
      current_ta.is_unread = true;
    }
    current_ta.activity.push({
      id: m_data.id,
      update_time: moment.unix(m_data.update_time).format('MM-DD HH:mm'),
      status: m_data.status,
      comment: m_data.comment,
      assign: m_data.assign,
      duedate: m_data.duedate,
      is_unread: m_data.is_unread
    });

  });

  return {
    count: ori_messages.length
  };

};

var task_activity_util = {};
task_activity_util.markRead = function(task_activity, self, remove_self) {
  var $that = $(self);
  task_activity.activity.forEach(function(ta_del){
    if ( ta_del.is_unread ){
      // console.log('Start delete ' + ta_del.id);
      GM_xmlhttpRequest({
        method: "DELETE",
        url: util.url.read_message(ta_ref_id, ta_del.id),
        onload: function(res) {
          if (JSON.parse(res.responseText).code == 200) {
            // console.log(res.responseText);
            if (remove_self) {  
              $that.remove();
              // console.log('Delete success');
            } else {
              $that.parent().find('.wt_unread_mark').remove();
            }
          }
        }
      });
    }
  });
};


// Get ref_id of Task Assistant bot
GM_xmlhttpRequest({
  method: "GET",
  url: CONST.URL_API_CHAT + '?t=' + util.getUnixtime(),
  onload: function(res) {

    JSON.parse(res.responseText).data.sessions.forEach(function(e){
      if(e.to.name == 'bot_task') {
        ta_ref_id = e._id;
      }
    });


    var read_count = 40,
        unread_count = 40,
        active_url_read = CONST.URL_API_MESSAGE + '?ref_type=2&filter_type=4&component=task&size=' + read_count + '&ref_id=' + ta_ref_id + '&t=' + util.getUnixtime(),
        active_url_unread = CONST.URL_API_MESSAGE + '?ref_type=2&filter_type=2&component=task&size=' + unread_count + '&ref_id=' + ta_ref_id + '&t=' + util.getUnixtime();
    // TODO: May be filter_type = 1 be more usable?

    // Get unread
    GM_xmlhttpRequest({
      method: "GET",
      url: active_url_unread,
      onload: function(res) {

        // Calculate how many read_task_activity should be fetched
        // At least 20 entries, maximum 40 entries
        var unread_count_real = deal_task_activity(res).count;
        read_count = unread_count_real > 20 ?
          20 : unread_count - unread_count_real;

        // Get read
        GM_xmlhttpRequest({
          method: "GET",
          url: active_url_read,
          onload: function(res) {
            deal_task_activity(res);

            // console.log(tasks_activity);

            // Remove loading
            $('body').html('');

            // Include PureCSS
            $("head").append(
            '<link '
              + 'href="//unpkg.com/purecss@1.0.0/build/pure-min.css" '
              + 'rel="stylesheet" type="text/css">'
            );

            // Append HTML
            var ta_container = $('<ul>').appendTo($('body'));

            tasks_activity.forEach(function(ta){
              var current_ta_html = (function(){
                return ta.is_unread ?
                  $('<li>')
                    .append( $('<a>', {
                        text: '[未读]',
                        class: 'wt_unread_mark',
                        href: 'javascript:;',
                        click: function(){
                          task_activity_util.markRead(ta, this, 1);
                        }
                      })
                    )
                    .append( ' ' ) : $('<li>');
              })()
                .append( $('<a>', {
                  text: ta.title,
                  target: '_blank',
                  href: util.url.taskcode(ta.taskcode),
                  click: function(){
                    task_activity_util.markRead(ta, this);
                  }
                }));

              var tas_ul = $('<ul>').appendTo(current_ta_html);
              ta.activity.forEach(function(tas){
                tas_ul.append(
                  $('<li>', {
                    html: tas.update_time + ', ' + tas.status + (tas.comment !== undefined ? '：' + util.commonmark.mdParser(tas.comment) : '') + (tas.assign != null ? ', 当前指派: ' + tas.assign: '')
                  })
                );
              });

              current_ta_html.appendTo(ta_container);
            });

          }
        });
      }
    });
  }
});

    /* endinject */
  }

})();
