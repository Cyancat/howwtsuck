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
