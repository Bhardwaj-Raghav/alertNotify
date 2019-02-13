( function($){
  var position = 'top_right';
  $.initiateAlertNotify = function(alert_position) {
    position = alert_position;
  }

  $.alertNotify = function(options) {
    if(typeof(options) === 'undefined') {
      throw "undefined alert Text and Type. Please pass object with keys alertText and type";
    } else {
      var color = '#EE5A24';
      var icon = '&#x2726;';
      if (typeof(options.type) !== 'undefined') {
        switch (options.type) {
          case 'success':
          color = '#A3CB38';
          icon = '&#x2714;';
          break;
          case 'warning':
          color = '#F79F1F';
          icon = '&#x26a0;';
          break;
          case 'error':
          color = '#EA2027';
          icon = '&#x2718;';
          break;
          case 'info':
          color = '#0652DD';
          icon = '!';
          break;
          default:
          color = '#EE5A24';
          icon = '&#x2726;';
        }
      }
      options = $.extend({
        alertText: 'NO TEXT FOUND',
        type: 'default',
        alert_in_animation: 'animation_left',
        alert_out_animation: 'animation_left',
        timeout: 50000,
        color: color,
        icon: icon,
      }, options );
      var notification = new Notification(options, position);
      alerttimeout = notification.show(options);
      return $($.parseHTML(notification));
    }
  }

  var Notification = (function () {
    function Notification({alertText, type, alert_in_animation, alert_out_animation, timeout, color, bg_color, icon}, position) {
      console.log(position);
      this.alertText = alertText;
      this.type = type;
      this.alert_in_animation = alert_in_animation;
      this.alert_out_animation = alert_out_animation;
      this.timeout = timeout;
      this.color = color;
      this.bg_color = bg_color;
      this.icon = icon;
      this.alert_position = position;
      this.millisec = 1000000000;
      this.notification =  `<div id="jquery_plugin_notification_" class="jquery_plugin_notification_ ${alert_in_animation}" style="background-color: ${color} !important;"><div class="jquery_plugin_notification_body"><div class="jquery_plugin_icon_text_container"><div class="jquery_plugin_notification_type_icon_container"><span class="jquery_plugin_notification_type_icon" id="jquery_plugin_notification_type_icon_id">${icon}</span></div><div class="jquery_plugin_text_div"><span class="jquery_plugin_notification_text" id="jquery_plugin_notification_text">${alertText}</span></div></div><div class="jquery_plugin_close_notification_container"><span class="jquery_plugin_close_notification" data-div_remove_animation="${alert_out_animation}" id="jquery_plugin_close_notification_button">&times;</span></div></div></div>`;
    }

    Notification.prototype.show = function(options) {
      var notification_timeout;
      var notification = this.notification;
      this.element = $($.parseHTML(notification));
      var element = this.element;
      setTimeout(function(){
        element.removeClass(options.alert_in_animation);
      }, 50);

      var timeout = (options.timeout);
      if (timeout === true ) {
        this.millisec = 5000;
        class_var = this;
        this.func = function(){ var clickable_element = element.find('.jquery_plugin_close_notification'); clickable_element.trigger('click');};
        this.stTime = new Date().valueOf();
        this.timeout = setTimeout(class_var.func, this.millisec);
        class_var.timeLeft = this.millisec;
        $(this.element).on('mouseover',function(e){
          console.log('Pause');
          clearTimeout(class_var.timeout);
          var timeRan = new Date().valueOf()-class_var.stTime;
          class_var.timeLeft -= timeRan;
        });

        $(this.element).on('mouseout', function(e){
          console.log('Resume');
          if (class_var.timeLeft > 0) {
            class_var.timeout = setTimeout(class_var.func, class_var.timeLeft);
            class_var.stTime = new Date().valueOf();
          }
        });
      } else if ( timeout > 0) {
        this.millisec = parseInt(timeout);
        class_var = this;
        this.func = function(){ var clickable_element = element.find('.jquery_plugin_close_notification'); clickable_element.trigger('click');};
        this.stTime = new Date().valueOf();
        this.timeout = setTimeout(class_var.func, this.millisec);
        class_var.timeLeft = this.millisec;
        $(this.element).on('mouseover',function(e){
          console.log('Pause');
          clearTimeout(class_var.timeout);
          var timeRan = new Date().valueOf()-class_var.stTime;
          class_var.timeLeft -= timeRan;
        });

        $(this.element).on('mouseout', function(e){
          console.log('Resume');
          if (class_var.timeLeft > 0) {
            class_var.timeout = setTimeout(class_var.func, class_var.timeLeft);
            class_var.stTime = new Date().valueOf();
          }
        });
      }
      if ($('#jquery_notiication_plugin_container').length <= 0) {
        $('body').prepend('<div id="jquery_notiication_plugin_container" class="' + this.alert_position + '"></div>');
        $('#jquery_notiication_plugin_container').prepend(element);
      } else {
        $('#jquery_notiication_plugin_container').prepend(element);
      }
    };
    return Notification;
  }());

  $(function(){
    $(document).on('click', '.jquery_plugin_close_notification', function(){
      var this_element = $(this);
      var animate_remove = $(this).data('div_remove_animation');
      this_element.parent().parent().parent().addClass(animate_remove);
      setTimeout(function(){
        this_element.parent().parent().parent().remove();
      },250);
    });
  });

})(jQuery);
