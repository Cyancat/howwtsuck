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
