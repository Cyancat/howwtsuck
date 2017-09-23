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
// https://reimu.worktile.com/api/tasks/595dbdc8c0c9f24f5644acbd/assign/4d8245caf04a4af28e1be6b216ccc37b?aid=&t=1506157275553
// https://reimu.worktile.com/api/tasks/595dbdc8c0c9f24f5644acbd/assign/4d8245caf04a4af28e1be6b216ccc37b?aid=&t=1506164500103
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
        console.log(res);
        if (JSON.parse(res.responseText).code == 200) {
          $(assign_this).text('@' + me.display_name);
        }
      }
    });
  }).appendTo('body');
  seletMenu.find('input').focus();
  e.stopPropagation();
  $('body').on('click', function(){
    $(seletMenu).remove();
    $('body').off('click');
  });
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
  .append(util.builder.priorityFormat(taskData.data.priority));


// Task tags
var newHTML_tags = newHTML.find('.ws-task-tags')
  .append($('<label>', { text: '标签: '}));

if (taskData.data.tags.length > 0) {
  taskData.data.tags.forEach(function(t,l){
    newHTML_tags.append( $('<span>', { text: (l == 0 ? '' : ', ') + t.name }));
  });
}
