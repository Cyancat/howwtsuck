(function() {

    // TODO: Combine this script to task.js
    unsafeWindow.document.addEventListener('click', function(e){
        var time_count = 0;
        var time_h = setTimeout(function(){
          if( $('.entity-detail').length > 0 ) {
              time_h = null;

              // Already executed, so skip
              if ($('.wt-header-tasklink').length > 0) {
                return;
              }

              var d_taskNum_cand = $('.entity-detail .modal-row.modal-row-aside .pull-right.ng-binding');
              // Because worktile 6.0 kill the featured class, so only the structure class could be used
              // So the 'each' is an insurance
              d_taskNum_cand.each(function(k, c) {
                var taskno = /任务编号: (\d*)/.exec($(c).text());
                if ( taskno.length > 0 ) {
                  var title_link = $('<span>', {
                      class: 'modal-detail-header-title-desc wt-header-tasklink',
                    }).append($('<i>', {
                      class: 'lcfont lc-hr'
                    })).append(' ').append( $('<a>', {
                      text: '#' + taskno[1],
                      target: '_blank',
                      href: CONST.URL_TASKNO_PREFIX + taskno[1]
                    }));

                  $(c).parents('.modal-content').find('.modal-detail-header-left')
                    .append(title_link)
                    .find('.m-l-20').remove();
                  $(c).html('任务编号: <a target="_blank" href="' + CONST.URL_TASKNO_PREFIX + taskno[1] + '">' + taskno[1] + '</a>');
                }
              });

              // TODO__1: Give the num text an event to open new window with specific URL
          }

          if (time_count >= 5) {
            time_h = null;
          }
          time_count++;
        }, 1000);
    }, false);

})();
