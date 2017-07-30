var util = {
  builder: {}
};

util.cleanHTML = function() {
  unsafeWindow.document.documentElement.innerHTML = '';
  util.globalNotice('Loading data...');
  ctCSS();
};

util.globalNotice = function(t) {
  $('body').html('<h1>' + t + '</h1>');
};

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
      at_a.prop("href", "https://help.worktile.com/drive_image/" + at._id + "/" + at.ref_id + "/" + at.addition.current_version)
          .prop("text", at.title)
          .prop("target", "_blank");
    }
  });

  return html;
};
