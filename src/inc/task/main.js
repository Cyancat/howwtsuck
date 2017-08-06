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
