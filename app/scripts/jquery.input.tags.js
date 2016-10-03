(function($) {

  $.fn.jQueryInputTags = function(options) {
    
    let consoleColors = {
      success: 'color: #5fba7d;  font-weight: bold',
      error: 'color: #f74f57; font-weight: bold',
      warning: 'color: #f69c55; font-weight: bold'
    };

    let defaults = {
      maxTotalSize: 255,
      maxTagSize: 10,
      minTagSize: 3,
      chars: /[:]/,
      keycode: /(^9$|^13$)/, // Tab, Enter, Space
      separator: ',',
      allowSpaces: false
    };

    var options = $.extend({}, defaults, options);

    var actions = {
      
      init: () => {
        actions.populate(this);
        actions.handlers(); // Start Handlers
      },
      
      // Add and Delete Tag
      addTag: (targetInput, value, isPolulating) => {
        let tagList = actions.getTagList(targetInput);
        let isDuplicated = tagList.length ? actions.isDuplicated(tagList, value) : false;
        let tag = `<div class="tag" data-tag-value="${value}">${value}<div class="delete" data-tag-value="${value}">+</div></div>`;

        if (isDuplicated.length && !isPolulating) {
          console.log(`%c${value} Tag is duplicated`, consoleColors.warning);
          $(targetInput).find('input[type="text"]').addClass('duplicated');
        } else {
          console.log(`%c${value} Tag Added`, consoleColors.success);
          if (!isPolulating) {
            $(targetInput).find('input[type="text"]').removeClass('duplicated');
            $(targetInput).find('input[type="text"]').val('');
            actions.addTagListItem(targetInput, value);
          }
          $(targetInput).append(tag);
        }
      },
      deleteTag: (targetInput, targetTag) => {
        if (!$(targetInput).find('input[type="text"]').hasClass('duplicated')) {


          let tagList = actions.getTagList(targetInput);
          
          if (tagList.length) {
            if (targetTag === 'last') {
              tagList.pop();
              console.log(`%c${targetTag} Tag Deleted`, consoleColors.error);
            } else {
              console.log(`%c${tagList[targetTag]} Tag Deleted`, consoleColors.error);
              tagList.splice(targetTag, 1);
            }

            $(targetInput).find('input[type="hidden"]').val(tagList = tagList.toString());
            $(targetInput).find('.tag').remove();
            actions.populate(targetInput);
          }

        } else {
          $(targetInput).find('input[type="text"]').removeClass('duplicated');
        }
      },
      isDuplicated: (tagList, value) => {
        return tagList.filter((item) => {
          return item === `${value}`;
        });
      },

      // List Items Manipulation
      addTagListItem: (targetInput, value) => {
        let actualValue = $(targetInput).find('input[type="hidden"]').val();
        actualValue = actualValue.length === 0 ? `${value}` : `${actualValue},${value}`;
        $(targetInput).find('input[type="hidden"]').val(actualValue);

      },
      getTagList: (targetInput) => {
        var tagList = $(targetInput).find('input[type="hidden"]').val().length ? $(targetInput).find('input[type="hidden"]').val().split(`${options.separator}`) : '';
        return tagList;
      },

      // Populate List
      populate: (targetInput) => {
        $(targetInput).each(function(index, el) {
          console.log(`%cIs Populating... ${el.className}`, consoleColors.warning);
          $(el).find('input[type="text"]').attr('maxlength', `${options.maxTagSize}`);
          if ($(el).find('input[type="hidden"]').val().length) {
            let tagList = $(el).find('input[type="hidden"]').val().split(`${options.separator}`);
            tagList.forEach((value) => {
              actions.addTag(el, value, true);
            });
          }
        });
      },

      // Event Handlers
      handlers: () => {
        $(this).on('keyup keydown', (e) => {
          var value = e.target.value;
          value = value.replace(/\s/g,'');

          // Add new Tag
          if ((options.keycode.test(e.keyCode) || options.chars.test(value)) && value.length > options.minTagSize) {
            value = options.chars.test(value) ? value.slice(0, -1) : value;
            actions.addTag(e.currentTarget, value);
          }
        });
        $(this).on('keyup', (e) => {
          var value = e.target.value;
          // Remove Tag
          if (e.keyCode === 8 && value.length === 0) {
            actions.deleteTag(e.currentTarget, 'last');
          }
        });
        $(this).on('click', (e) => {
          if ($(e.target).hasClass('delete')) {
            actions.deleteTag(e.currentTarget, $(e.target).parent('.tag').index() - 2);
          }
        });
      }
    };
    actions.init();
  };

  $('.jQueryInputTags').jQueryInputTags();

})(jQuery);