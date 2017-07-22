// TODO: Get all actions of task ready to work

(function() {

  // function ctHTML(){
  //   return ' <div class="pure-g container"> \
  //     <div class="ws-title-container pure-u-1"> \
  //       <h1><span class="ws-title-meta"></span></h1> \
  //     </div> \
  //     <div class="ws-issue-container pure-u-1-2"> \
  //       <div class="ws-content-container pure-u-1"> \
  //         <pre></pre> \
  //       </div> \
  //     </div> \
  //     <div class="ws-comments-container pure-u-1-2"> \
  //       \
  //     </div> \
  //   </div>';
  // };

  function contentFormat(c) {
    return c.replace(/\[@.*\|(.*)\]/, '<span class="ws-content-user">@$1</span>') // @
            .replace(/\[#task-(.*)\|(.*)\]/, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>') // Task link
            .replace(/((http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, '<a target="_blank" href="$1">$1</a>'); // URL format ( for markdown lack)
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

      // TODO: Add task meta info

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
