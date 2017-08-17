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
}

util.builder.attachments = function(data) {
  var html = $("<ul>", {
    class: "ws-attachment"
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
    default: return '啥玩意？？';
  }
};

util.url.taskcode = function(tc) {
  return CONST.URL_TASKCODE_PREFIX + tc;
}

util.url.read_message = function(ref_id, message_id) {
  return CONST.URL_API_READ_MESSAGE + ref_id + '/messages/' + message_id + '/unread?t=' + util.getUnixtime();
}

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

          // TODO: Current markdown lack:
          // strikethrough
          // table
          // number list miss-change original number to sequence
  ;
};
