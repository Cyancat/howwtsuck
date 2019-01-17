// Lets do a PR test.

(function() {

    var tcc = 0;
    var tc = setInterval(function(){
      if ( $('.nav-apps').length > 0 ) {
        clearInterval(tc);

        var navi_c = $('<li>').append(
              $('<a>', {
                target: '_blank',
                href: CONST.URL_TASK_ACTIVE,
                class: 'app-item'
              }).append(
                $('<span>', {
                  class: 'item-icon'
                }).append($('<i>',{
                  class: 'wtf icon-default',
                  style: 'font-size: 14px;',
                  text: '|ω･`)ﾁﾗｯ'
                })).append($('<i>',{
                  class: 'wtf icon-hover',
                  style: 'font-size: 14px;',
                  text: '|ω･`)ﾁﾗｯ'
                }))
              ).append( $('<span>', {
                class: 'name',
                text: '动态'
              }))
            );

          $('.nav-apps:eq(1)').prepend(navi_c);

      }

      tcc++;
      if (tcc >= 30) {
        clearInterval(time_h);
      }
    }, 300);


    unsafeWindow.document.addEventListener('click', function(e){
        var time_count = 0;
        var time_h = setInterval(function(){
          if( $('.entity-detail').length > 0 ) {
              clearInterval(time_h);

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
                      text: taskno[1],
                      target: '_blank',
                      href: CONST.URL_TASKNO_PREFIX + taskno[1]
                    }));

                  $(c).parents('.modal-content').find('.modal-detail-header-left')
                    .append(title_link)
                    .find('.m-l-20').remove();
                  $(c).html('任务编号: <a target="_blank" href="' + CONST.URL_TASKNO_PREFIX + taskno[1] + '">' + taskno[1] + '</a>');
                }
              });

              $('.entity-detail .desc img').replaceWith(function(){
                return $('<a>', {
                    href: CONST.URL_PUBLIC_IMAGE_PREFIX + /^https:\/\/wt-box\.worktile\.com\/public\/(.*)/.exec($(this).prop('src'))[1],
                    target: "_blank"
                    }).append($('<img>', {
                      src: $(this).prop('src'),
                      alt: $(this).prop('alt')
                    }));
              });
          }

          time_count++;
          if (time_count >= 8) {
            clearInterval(time_h);
          }
        }, 300);
    }, false);

})();
