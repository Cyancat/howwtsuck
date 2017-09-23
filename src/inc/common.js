var util = {
  builder: {},
  url: {},
  commonmark: {}
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









util.commonmark.tcr = new commonmark.Parser();
util.commonmark.tc = new commonmark.HtmlRenderer();

util.commonmark.mdParser = function(c) {
  // Markdown parse combined with worktile custom link.
  return this.tc.render(this.tcr.parse(c))
          .replace(/\n([^\<])/gi, "<br>$1") // Fix a wired situation
          .replace(/\[@.*\|(.*)\]/, '<span class="ws-content-user">@$1</span>') // @
          .replace(/\[#task-(.*)\|(.*)\]/, '<a class="ws-content-tasklink" href="/taskcode/$1">$2</a>') // Task link
          // TODO: Continuous tasks could cause a error parse, see #3413's comment
          .replace(/(^|[^"'])((http|ftp|https):\/\/[\w-]+(\.[\w-]+)*([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, '$1<a target="_blank" href="$2">$2</a>'); // URL format ( for markdown lack)
          // TODO: Remove mac mark! See task #1615
          // TODO: Some @ isn't replaced , see task #3469
          // TODO: Some regexp bug, see task #3577

          // TODO: Current markdown lack:
          // strikethrough
          // table
          // number list miss-change original number to sequence
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








util.builder.selectMenu = function(x, y, entries, hasInput, cb) {

  var newMenu_input = '';
  if (hasInput) {
    newMenu_input =
      $('<form>', {
        class: 'pure-form'
        }).append($('<input>', {
          type: 'text'
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

    newMenu.appendTo('body');

    $('body').on('click', function(){
      $(newMenu).remove();
      $('body').off('click');
    });
  }

  return newMenu;

};

util.builder.selectMemberMenu = function(x, y, cb) {
  var filtered_members = util.members,
      selecMenu_this = this;

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

  $('body').on('click', function(){
    $(newMenu).remove();
    $('body').off('click');
  });

  return newMenu;
};
