var params = null;

var make_image = function(tar) {

  $("<a>", {
    href: "javascript:;"
    })
    .append( $("<img>", {
      src: tar,
      class: "fit_to_width"
    }))
    .click(function(){
      var img = $(this).find('img');
      if (img.prop('class') == 'fit_to_width') {
        img.prop('class', 'fit_to_origin');
      }
      else if (img.prop('class') == 'fit_to_origin') {
        img.prop('class', 'fit_to_height');
      }
      else {
        img.prop('class', 'fit_to_width');
      }
    })
    .appendTo( $('body').html('') );
};

if (/^https:\/\/help.worktile.com\/image/.test(window.location.href)) {

  params = /^https:\/\/help.worktile.com\/image\/(.*)\/(.*)\/(\d*)/.exec(window.location.href);
  var _id = params[1],
      ref_id = params[2],
      current_version = params[3];

  make_image("https://wt-box.worktile.com/drives/" + _id + "/from-s3?team_id=" + CONST.TEAM_ID + "&version=" + current_version + "&ref_id=" + ref_id);

}
else if (/^https:\/\/help.worktile.com\/public_image/.test(window.location.href)) {
  params = /^https:\/\/help.worktile.com\/public_image\/(.*)/.exec(window.location.href);
  var _id = params[1];

  make_image("https://wt-box.worktile.com/public/" + _id);

}
