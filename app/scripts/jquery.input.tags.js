// jQuery Input Tag v.1.0.0
// https://github.com/Papacidero/jquery.input.tag/

(function($) {

  $.fn.jQueryInputTags = function(options) {

    let consoleColors = {
      success: 'color: #5fba7d;  font-weight: bold',
      error: 'color: #f74f57; font-weight: bold',
      warning: 'color: #f69c55; font-weight: bold'
    };

    let defaults = {
      maxTotalSize: 255,
      maxTagSize: 15,
      minTagSize: 3,
      chars: /[:,]/,
      keycode: /(^9$|^13$)/, // Tab, Enter, Space
      separator: ',',
    };

    var options = $.extend({}, defaults, options);

    var actions = {

      init: () => {
        actions.populate(this);
        actions.handlers(); // Start Handlers
      },

      // Add and Delete Tag
      addTag: (targetInput, value) => {

        $(targetInput).find('input[type="text"]').val('');
        actions.updateTagList(targetInput, value);
        $(targetInput).find('.tag').remove(); // Clean Tags

        if (actions.getTagList(targetInput).length) {
          actions.getTagList(targetInput).forEach((item, index) => { // Create Tags
            $(targetInput).append(`<div class="tag" data-tag-value="${item}">${item}<div class="delete" data-tag-value="${item}">+</div></div>`);
          });
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

      // List Items Manipulation
      updateTagList: (targetInput, value) => {

        var actualValue = new Set($(targetInput).find('input[type="hidden"]').val().split(options.separator));
        
        if (actualValue.has('')) actualValue.delete('');

        value.split(options.chars).forEach((item, index) => {
          if (item.length > options.minTagSize && item.length <= options.maxTagSize) {

            // Check if is duplicated
            if (actualValue.has(item)) {
              console.log(`%c${item} tag already exists`, consoleColors.warning);
            } else {
              actualValue.add(item);
              console.log(`%c${item} Tag Added`, consoleColors.success);
            }

            //Check if MaxLenght has reachead
            if ([...actualValue].toString().length >= options.maxTotalSize) {
              console.log(`%cMax chars limit of ${options.maxTotalSize} reached, total text size is ${[...actualValue].toString().length}`, consoleColors.error);
              actualValue.delete(item);
            }

          }
        });

        $(targetInput).find('input[type="hidden"]').val([...actualValue].toString());


      },
      getTagList: (targetInput) => {

        var tagList = $(targetInput).find('input[type="hidden"]').val().length ? $(targetInput).find('input[type="hidden"]').val().split(`${options.separator}`) : '';

        if (tagList[0] === '') {
          tagList.splice(0, 1);
        }
        return tagList;
      },

      // Populate List
      populate: (targetInput) => {
        $(targetInput).each(function(index, el) {
          console.log(`%cIs Populating... ${el.className}`, consoleColors.warning);
          if ($(el).find('input[type="hidden"]').val().length) {
            actions.addTag(el, actions.getTagList(el).toString());
          }
        });
      },

      // Event Handlers
      handlers: () => {
        $(this).on('keyup keydown', (e) => {
          var value = e.target.value;

          // Add new Tag
          if ((options.keycode.test(e.keyCode) || options.chars.test(value)) && value.length > options.minTagSize) {
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

})(jQuery);