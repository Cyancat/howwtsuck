// Include PureCSS
$("head").append(
'<link '
  + 'href="//unpkg.com/purecss@1.0.0/build/pure-min.css" '
  + 'rel="stylesheet" type="text/css">'
);


// Get task identifier
var task_no = /.*\/taskno\/(\d*)/g.exec(window.location.href),
    task_code = /.*\/taskcode\/(.*)/g.exec(window.location.href);

task_no = task_no != null ? task_no[1] : '';
task_code = task_code != null ? task_code[1] : '';

if (task_no == '' && task_code == '') {
  popNotice('Something goes wrong! Check the url pppplz</h1>(\\&nbsp;&nbsp;/)<br>( ¬᎑¬)<br>/つ🍫');
  return;
}

var api_url = task_no != '' ? ("https://reimu.worktile.com/api/tasks/no/" + task_no) : ("https://reimu.worktile.com/api/tasks/" + task_code);

GM_xmlhttpRequest({
  method: "GET",
  url: api_url,
  onload: renderTask
});
