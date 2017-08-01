var params = /^https:\/\/help.worktile.com\/drive_image\/(.*)\/(.*)\/(\d*)/.exec(window.location.href),
    _id = params[1],
    ref_id = params[2],
    current_version = params[3];

$("<a>", {
  href: "javascript:;"
}).append( $("<img>", {
  src: "https://wt-box.worktile.com/drives/" + _id + "/from-s3?team_id=" + CONST.TEAM_ID + "&version=" + current_version + "&ref_id=" + ref_id,
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
