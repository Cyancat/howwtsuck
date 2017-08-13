// Remove original page
$('body').html('');

// Get task data
var taskData = JSON.parse(res.responseText);

if (taskData.code == "404") {
  popNotice('Task not exist or no authority! (・へ・)');
  return;
}

// Page title
$("head").append (
'<title>'
  + '#' + taskData.data.identifier + ' - ' + taskData.data.title
  + '</title>'
);
