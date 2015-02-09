
Drupal.annotoriousImage = Drupal.annotoriousImage || {};

(function($) {

  /**
   * Load annotations to image.
   */
  Drupal.behaviors.annotoriousImageAnnotations = {
    attach: function (context, settings) {
      if (typeof Drupal.settings.annotoriousImage == 'object') {
        $.each(Drupal.settings.annotoriousImage.annotations, function (i, val) {
          anno.addAnnotation(val);
        });
      }
    }
  };

  /**
   * Attach tools widget to img.annotorious-image.
   */
  Drupal.behaviors.annotoriousImageWidget = {
    attach: function (context, settings) {
      $('.annotorious-annotationlayer').hover(Drupal.annotoriousImage.widgetHoverIn, Drupal.annotoriousImage.widgetHoverOut);
    }
  };

  Drupal.annotoriousImage.widgetHoverIn = function (event) {
    $(this).append(Drupal.theme('annotoriousImageWidget'));
    $('.annotorious-image-widget a.save').bind('click', Drupal.annotoriousImage.annoSave);
  };

  Drupal.annotoriousImage.widgetHoverOut = function (event) {
    $(this).find('.annotorious-image-widget').remove();
  };

  /**
   * Save the annotorious image.
   */
  Drupal.annotoriousImage.annoSave = function (event) {
    event.preventDefault();
    var image = $(this).closest('.annotorious-image-widget').siblings('.annotorious-image');
    var data = {
      url: image.attr('data-original'),
      annotations: anno.getAnnotations(image.attr('data-original'))
    };
    $.post('/annotorious-image/save', data);
  };

})(jQuery);

/**
 * Add tool widget to the image.
 */
Drupal.theme.prototype.annotoriousImageWidget = function () {
  var widget = '<div class="annotorious-image-widget">';
  widget += '<ul>';
  widget += '<li><a class="edit" href="#">Edit</a></li> ';
  widget += '<li><a class="save" href="#">Save</a></li> ';
  widget += '</ul>';
  widget += '</div>';

  return widget;
};
