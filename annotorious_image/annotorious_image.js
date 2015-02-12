
Drupal.annotoriousImage = Drupal.annotoriousImage || {};

(function($) {

  Drupal.behaviors.annotoriousImage = {
    attach: function (context, settings) {

      // Make it annotatable, Use .on('load') to avoid issue on Chrome.
      $('.annotorious-image').one('load', function() {
        var url = $(this).attr('data-original');
        anno.makeAnnotatable($(this)[0]);
        anno.hideSelectionWidget(url);
      }).each(function() {
        if(this.complete) $(this).load();
      });

      // Only do when the last got loaded.
      $('.annotorious-image').last().one('load', function() {
        // Add annotations
        $.each(Drupal.settings.annotoriousImage.annotations, function(i, val) {
          val.editable = false;
          anno.addAnnotation(val);
        });
        // Widget
        if (Drupal.settings.annotoriousImage.permission) {
          $('.annotorious-annotationlayer').hover(Drupal.annotoriousImage.widgetHoverIn, Drupal.annotoriousImage.widgetHoverOut);
        }
      }).each(function() {
        if(this.complete) $(this).load();
      });

    }
  };

  Drupal.annotoriousImage.widgetHoverIn = function(event) {
    $(this).append(Drupal.theme('annotoriousImageWidget'));
    $('.annotorious-image-widget a.save').on('click', Drupal.annotoriousImage.annoSave);
    $('.annotorious-image-widget a.edit').on('click', Drupal.annotoriousImage.annoEdit);
  };

  Drupal.annotoriousImage.widgetHoverOut = function(event) {
    $(this).find('.annotorious-image-widget').remove();
  };

  /**
   * Save the annotorious image.
   */
  Drupal.annotoriousImage.annoSave = function(event) {
    event.preventDefault();
    var image = $(this).closest('.annotorious-image-widget').siblings('.annotorious-image');
    var data = {
      url: image.attr('data-original'),
      annotations: anno.getAnnotations(image.attr('data-original'))
    };
    $.post('/annotorious-image/save', data);
  };

  Drupal.annotoriousImage.annoEdit = function(event) {
    event.preventDefault();
    var image = $(this).closest('.annotorious-image-widget').siblings('.annotorious-image');
    var url = image.attr('data-original');
    anno.showSelectionWidget(url);
    annotations = anno.getAnnotations(url);
    $.each(annotations, function(i, val) {
      val.editable = true;
    });
  }

})(jQuery);

/**
 * Add tool widget to the image.
 */
Drupal.theme.prototype.annotoriousImageWidget = function() {
  var widget = '<div class="annotorious-image-widget">';
  widget += '<ul>';
  widget += '<li><a class="edit" href="#">Edit</a></li> ';
  widget += '<li><a class="save" href="#">Save</a></li> ';
  widget += '</ul>';
  widget += '</div>';

  return widget;
};
