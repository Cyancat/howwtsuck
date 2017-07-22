(function() {
  
    // TODO: Combine this script to task.js
    unsafeWindow.document.addEventListener('click', function(e){
        var time_h = setTimeout(function(){
          if( $('.card-window').length > 0 ) {
              time_h = null;

              var d_taskNum = $('.card-sidebar .task-num .num');
              d_taskNum.replaceWith('<a target="_blank" href="https://help.worktile.com/taskno/' + d_taskNum.text() + '">' + d_taskNum.text() + '</a>');

              // TODO__1: Give the num text an event to open new window with specific URL
          }
        }, 1000);
    }, false);

})();
