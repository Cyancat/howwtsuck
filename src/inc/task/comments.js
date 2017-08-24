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
