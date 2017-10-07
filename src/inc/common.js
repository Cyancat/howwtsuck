var util = {
  builder: {},
  url: {},
  commonmark: {},
  datamark: {},
  datahandle: {}
};

util.cleanHTML = function() {
  unsafeWindow.document.documentElement.innerHTML = '';
  util.globalNotice('Loading data...');
  ctCSS();
};

util.globalNotice = function(t) {
  $('body').html('<h1>' + t + '</h1>');
};

util.getUnixtime = function() {
  return moment(new Date()).format('x');
};

util.builder.attachments = function(data) {
  var html = $("<ul>", {
    class: "ws-attachments-list"
  });

  data.forEach(function(at){
    var at_a = $("<a>").appendTo( $("<li>").appendTo(html) );

    if (at.addition.thumbnail == "") {
      at_a.prop("href", "https://reimu.worktile.com/files/" + at._id + "/preview?from=attachment&version=" + at.addition.current_version)
          .prop("text", at.title)
          .prop("target", "_blank");
    } else {
      at_a.prop("href", "https://help.worktile.com/image/" + at._id + "/" + at.ref_id + "/" + at.addition.current_version)
          .prop("text", at.title)
          .prop("target", "_blank");
    }
  });

  return html;
};

util.builder.dueTimeFormat = function(d, t) {
  return moment(d*1000).format(t != 0 ? 'MM-DD HH:mm' : 'MM-DD');
};

util.builder.priorityFormat = function(p) {
  switch(p) {
    case 0: return '未设定'; break;
    case 1: return '低'; break;
    case 2: return '中'; break;
    case 3: return '高'; break;
    case '不设定': return 0; break;
    case '高': return 3; break;
    case '中': return 2; break;
    case '低': return 1; break;
    default: return '啥玩意？？';
  }
};

util.builder.tags = function(tags_html) {
  tags_html.find('li').remove();
  util.tags.forEach(function(t, l){
    if (util.tags_key[t.name].ttag_mark == true) {
      tags_html.append( $('<li>', { text: t.name }));
    }
  });
}









util.url.taskcode = function(tc) {
  return CONST.URL_TASKCODE_PREFIX + tc;
};

util.url.team = function() {
  return CONST.URL_API_TEAM + '?t=' + util.getUnixtime();
};

util.url.submit_comment = function() {
  return CONST.URL_API_COMMENT + '?t=' + util.getUnixtime();
};

util.url.read_message = function(ref_id, message_id) {
  return CONST.URL_API_READ_MESSAGE + ref_id + '/messages/' + message_id + '/unread?t=' + util.getUnixtime();
};

util.url.task_api = function(task_id) {
  return CONST.URL_API_TASKCODE + task_id + '?t=' + util.getUnixtime();
};

util.url.task_assign = function(task_id, assignee_id) {
  return CONST.URL_API_TASKCODE + task_id + '/assign/' + assignee_id + '?aid=&t=' + util.getUnixtime();
};

util.url.tags = function() {
  return CONST.URL_API_TAGS + '?type=2&t=' + util.getUnixtime();
};

util.url.tags_modify = function(task_id, tag_id) {
  return CONST.URL_API_TASKCODE + task_id + '/tags/' + tag_id + '?t=' + util.getUnixtime();
};









util.commonmark.tcr = new commonmark.Parser();
util.commonmark.tc = new commonmark.HtmlRenderer();

util.commonmark.mdParser = function(c) {
  // Markdown parse combined with worktile custom link.
  return this.tc.render(this.tcr.parse(c))
          .replace(/\n([^\<])/gi, "<br>$1") // Fix a wired situation
          .replace(/~~(.+?)~~/g, '<strike>$1</strike>') // strikethrough format
          .replace(/\[@.+?\|(.+?)\]/g, '<span class="ws-content-user">@$1</span>') // @ user
          .replace(/\[#task-(.+?)\|(.+?)\]/g, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>') // Task link
          .replace(/(^|[^"'])((http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, '$1<a target="_blank" href="$2">$2</a>'); // URL format ( for markdown lack)
          // TODO: Remove mac mark! See task #1615
          // TODO: Some regexp bug, see task #3577; hmmm may be resolved?

          // TODO: Current markdown lack:
          // table
          // NOT TODO: number list miss-change original number to sequence = this do is the setting
  ;
};










GM_xmlhttpRequest({
  method: 'GET',
  url: util.url.team(),
  onload: function(res){

    util.members = JSON.parse(res.responseText).data.members.filter(function(m){
      return m.name.indexOf('bot_') == -1;
    });

    util.members_key = {};
    util.members.forEach(function(m) {
      util.members_key[m.name] = m;
    });

  },
  synchronous: true
});

util.datamark.tags = false;
GM_xmlhttpRequest({
  method: 'GET',
  url: util.url.tags(),
  onload: function(res1){

    util.tags = JSON.parse(res1.responseText).data;

    util.tags_key = {};
    util.tags.forEach(function(m) {
      util.tags_key[m.name] = m;
      util.tags_key[m.name].ttag_mark = false;
    });

    util.datamark.tags = true;

  },
  synchronous: true
});








util.builder.selectMenu = function(x, y, entries, hasInput, cb) {

  var newMenu_input = '';

  if (hasInput) {
    newMenu_input =
      $('<form>', {
        class: 'pure-form'
        }).append($('<input>', {
          type: 'text',
          keydown: function(e) {
            if ( e.keyCode == 38 || e.keyCode == 40) {
              // Up = 38, Down = 40
              var $menuParent = $(this).parents('.ws-selectMenu'),
                  $current_sel = $menuParent.find('.pure-menu-list .active'),
                  $prev_li, $next_li;

              if ($current_sel.length > 0) {
                $prev_li = $current_sel.parent().prev();
                $next_li = $current_sel.parent().next();

                if ( e.keyCode == 38 && $prev_li.length > 0) {
                  $prev_li.find('.pure-menu-link').addClass('active');
                  $current_sel.removeClass('active');
                }
                if ( e.keyCode == 40 && $next_li.length > 0) {
                  $next_li.find('.pure-menu-link').addClass('active');
                  $current_sel.removeClass('active');
                }
              } else {
                $menuParent.find('.pure-menu-item:eq(0) .pure-menu-link').addClass('active');
              }

              return false;
            }
          }
        }));
  }
  var newMenu = $('<div>', {
    class: 'pure-menu ws-selectMenu',
    style: 'left: ' + x + 'px; top: ' + y + 'px;'
  }).append(newMenu_input)
  .append($('<ul>', {
    class: 'pure-menu-list'
  }));

  if (entries.length > 0) {
    var menu_ul = newMenu.find('.pure-menu-list');
    entries.forEach(function(en){
      menu_ul.append($('<li>', {
          class: 'pure-menu-item'
          }).append($('<a>', {
            class: 'pure-menu-link',
            text: en,
            click: function(e) {
              cb(en);
            }
          })));
    });

    if (hasInput) {
      util.builder.selectMenu.bindEvent(menu_ul);
    }

    newMenu.appendTo('body');

    $('body').on('click', function(){
      $(newMenu).remove();
      $('body').off('click');
    });
  }

  return newMenu;

};

/** @param tar ul.pure-menu-list
 */
util.builder.selectMenu.bindEvent = function(tar) {
  var $tar_link = $(tar).find('.pure-menu-link');

  // Bind hover
  $tar_link.on('mouseover', function(){
    $tar_link.removeClass('active');
    $(this).addClass('active');
  });

  // "Enter" = click
  $(tar).parent().find('input').keydown(function(e){
    var $current_sel = $(tar).find('.active');
    if (e.keyCode == 13 && $current_sel.length == 1) {
      $current_sel.click();
    }
    else if (e.keyCode == 27) {
      $(tar).parent().remove();
    }
  });

  // Prevent for triggering submit with "enter"
  $(tar).parent().find('form').keypress(function(e){
    return e.keyCode != 13;;
  });
};

//
// selectMemberMenu
//
util.builder.selectMemberMenu = function(x, y, cb) {
  var filtered_members = util.members;

  var selectMenu_gen = function() {
    var menu_ul = newMenu.find('.pure-menu-list');
    menu_ul.html('');
    filtered_members.slice(0,4).forEach(function(me){
      menu_ul.append($('<li>', {
          class: 'pure-menu-item'
        }).append($('<a>', {
            class: 'pure-menu-link',
            text: me.display_name + ' (' + me.name + ')',
            click: function(e){
              cb(me);
            }
          })));
    });
    util.builder.selectMenu.bindEvent(menu_ul);
  };

  var newMenu = util.builder.selectMenu(x, y, [], 1);

  newMenu.find('input').on('input', function(e){
    var input_text = $(this).val();

    filtered_members = util.members.filter(function(m){
      return (m.name.toLowerCase() + m.display_name.toLowerCase() + m.display_name_pinyin.toLowerCase()).indexOf(input_text) != -1;
    }).sort(function(a, b){
      return Math.max(a.name.indexOf(input_text), a.display_name.indexOf(input_text), a.display_name_pinyin.indexOf(input_text)) -
             Math.max(b.name.indexOf(input_text), b.display_name.indexOf(input_text), b.display_name_pinyin.indexOf(input_text));
    }).slice(0,4);

    selectMenu_gen();
  }).click(function(e){
    e.stopPropagation();
  });

  selectMenu_gen();

  newMenu.appendTo('body');
  newMenu.find('input').focus();

  $('body').on('click', function(){
    $(newMenu).remove();
    $('body').off('click');
  });

  return newMenu;
};

//
// selectTagsMenu
//
util.builder.selectTagsMenu = function(x, y, cb, ttags) {
  var filtered_tags = util.tags;
  var selectMenu_gen = function() {
    var menu_ul = newMenu.find('.pure-menu-list');
    menu_ul.html('');
    filtered_tags.forEach(function(tag){

      var mark_html = $('<span>', {
        class: 'ws-selectMenu-selected',
        text: '✓'
      });

      menu_ul.append(
        $('<li>', {
          class: 'pure-menu-item'
        }).append(
          $('<a>', {
            class: 'pure-menu-link',
            text: tag.name,
            click: function(e){
              e.stopPropagation();
              cb(tag, this, mark_html);
            }
          }).append( util.tags_key[tag.name].ttag_mark == true ? mark_html : "" )
          // }).append( mark_html )
        )
      );
    });
    util.builder.selectMenu.bindEvent(menu_ul);
  };

  var newMenu = util.builder.selectMenu(x, y, [], 1);

  newMenu.find('input').on('input', function(e){
    var input_text = $(this).val();

    if (input_text == "") {
      filtered_tags = util.tags;
    } else {
      filtered_tags = util.tags.filter(function(tag){
        return (tag.name.toLowerCase() + tag.name_pinyin.toLowerCase()).indexOf(input_text) != -1;
      }).sort(function(a, b){
        return Math.max(a.name.indexOf(input_text), a.name_pinyin.indexOf(input_text)) -
               Math.max(b.name.indexOf(input_text), b.name_pinyin.indexOf(input_text));
      });
    }

    selectMenu_gen();
  }).click(function(e){
    e.stopPropagation();
  })

  selectMenu_gen();

  newMenu.appendTo('body');
  newMenu.find('input').focus();

  $('body').on('click', function(){
    $(newMenu).remove();
    $('body').off('click');
  });

  return newMenu;
};
