// Task edit
var content_editor = newHTML.find('.ws-content-container-editor'),
    content_editor_submit = content_editor.find('button[type=submit]');
content_editor.hide();
content_editor.find('textarea').val(taskData.data.description) // Init hide and content
  .keydown(function(e){
    if ((e.ctrlKey && e.keyCode == 13) || (e.metaKey && e.keyCode == 13)) {
      content_editor_submit.click();
    }
  });

content_editor.find('button[type=button]').click(function(){
  content_editor.find('textarea').val(taskData.data.description); // Reset content
  newHTML.find('.ws-content-editlink').click();
});

content_editor_submit.click(function(){
  GM_xmlhttpRequest({
    method: 'PUT',
    url: util.url.task_api(taskData.data._id),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    data: JSON.stringify({description: content_editor.find('textarea').val()}),
    onload: function(res){
      var r = JSON.parse(res.responseText);
      if (r.code != 200) {
        return false;
      }
    }
  });
});

newHTML.find('.ws-content-editlink').click(function(){
  newHTML.find('.ws-content-container-showcase').toggle();
  newHTML.find('.ws-content-container-editor').toggle();
});

// Task description
newHTML.find('.ws-content-container-showcase').html(
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
