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
