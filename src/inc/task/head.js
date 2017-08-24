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


// Task tags
var newHTML_tags = newHTML.find('.ws-task-tags')
  .append($('<label>', { text: '标签: '}));

if (taskData.data.tags.length > 0) {
  taskData.data.tags.forEach(function(t,l){
    newHTML_tags.append( $('<span>', { text: (l == 0 ? '' : ', ') + t.name }));
  });
}
