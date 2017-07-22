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

      newHTML.find('.ws-title-container h1').html(taskData.data.title);
      newHTML.find('.ws-title-container h1').append($("<span>", {
        class: "ws-title-meta",
        text: "#" + taskData.data.identifier
      }));

      // Task project
      newHTML.find('.ws-task-project').text(
        taskData.data.project.name + ' : ' + taskData.data.entry_name
      );

      // Task status
      var task_status = newHTML.find('.ws-task-status');
      if (taskData.data.is_deleted == 1) {
        task_status.text('已删除').addClass('ws-task-status-deleted');
      } else if (taskData.data.is_archived == 1) {
        task_status.text('已归档').addClass('ws-task-status-archived');
      } else if (taskData.data.completion.is_completed == 1) {
        task_status.text('已完成').addClass('ws-task-status-fin');
      } else if (taskData.data.completion.is_completed == 0) {
        task_status.text('进行中').addClass('ws-task-status-progress');
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
      // TODO: Add tags
      // TODO: Add attachments
      // TODO: Add subtask, also parent task
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
