( function($){

  $.alertNotify = function(options) {
    if(typeof(options) === 'undefined' || typeof(options.alertText) === 'undefined') {
      throw "undefined alert Text. Please pass object with keys alertText";
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
        timeout: 5000,
        color: color,
        textColor: '#ffffff',
        iconColor: '#ffffff',
        crossColor: '#ffffff',
        isDismissible: true,
        icon: icon,
        position: 'top_right',
        finishedCallback: false,
        finishedCallbackTimeout: 5000
      }, options );
      var notification = new Notification(options);
      alerttimeout = notification.show(options);
      return $($.parseHTML(notification));
    }
  }

  var Notification = (function () {
    function Notification(options) {
      this.alertText = options.alertText;
      this.type = options.type;
      this.alert_in_animation = options.alert_in_animation;
      this.alert_out_animation = options.alert_out_animation;
      this.timeout = options.timeout;
      this.color = options.color;
      this.textColor = options.textColor;
      this.iconColor = options.iconColor;
      this.crossColor = options.crossColor;
      this.isDismissible = options.isDismissible;
      this.icon = options.icon;
      this.alert_position = options.position;
      this.finishedCallback = options.finishedCallback;
      this.finishedCallbackTimeout = options.finishedCallbackTimeout;
      this.millisec = 86400;
      this.notification = `<div id="alertNotify_" class="alertNotify_ ${options.alert_in_animation}" style="background-color: ${options.color} !important;"><div class="alertNotify_body"><div class="alertNotify_icon_text_container"><div class="alertNotify_type_icon_container"><span class="alertNotify_type_icon" id="alertNotify_type_icon_id">${options.icon}</span></div><div class="alertNotify_text_div"><span class="alertNotify_text" id="alertNotify_text" style="color: ${options.textColor}">${options.alertText}</span></div></div>`;
      if (options.isDismissible) {
        this.notification +=`<div class="alertNotify_close_notification_container"><span class="alertNotify_close_notification" data-div_remove_animation="${options.alert_out_animation}" id="alertNotify_close_notification_button" style="color: ${options.crossColor}">&times;</span></div>`;
      }
      this.notification  +=  `</div></div>`;
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
        mouseInOutEvent(this, this.millisec, element);
      } else if ( timeout > 0) {
        this.millisec = parseInt(timeout);
        mouseInOutEvent(this, this.millisec, element);
      } else if (this.finishedCallback) {
        setTimeout(this.finishedCallback, this.finishedCallbackTimeout + 250);
      }
      const pattern_bottom = /bottom/;
      if ($('#alertNotify_main_container.' + this.alert_position ).length <= 0) {
        $('body').prepend('<div id="alertNotify_main_container" class="' + this.alert_position + '"></div>');
        if (pattern_bottom.test(this.alert_position)) {
          $('#alertNotify_main_container').append(element);
        } else {
          $('#alertNotify_main_container').prepend(element);
        }
      } else {
        if (pattern_bottom.test(this.alert_position)) {
          $('#alertNotify_main_container.' + this.alert_position ).append(element);
        } else {
          $('#alertNotify_main_container.' + this.alert_position ).prepend(element);
        }
      }
    };
    return Notification;
  }());

  $(function(){
    $(document).on('click', '.alertNotify_close_notification', function(){
      var this_element = $(this);
      var animate_remove = $(this).data('div_remove_animation');
      this_element.parent().parent().parent().addClass(animate_remove);
      setTimeout(function(){
        this_element.parent().parent().parent().remove();
      },250);
    });
  });

  var mouseInOutEvent = function(class_var, millisec, element) {
    class_var.func = function(){ var clickable_element = element.find('.alertNotify_close_notification'); clickable_element.trigger('click');};
    class_var.stTime = new Date().valueOf();
    class_var.timeout = setTimeout(class_var.func, millisec);
    if (class_var.finishedCallback) {
      class_var.finalTimeout = setTimeout(class_var.finishedCallback, millisec + 250);
    }
    class_var.timeLeft = millisec;
    $(class_var.element).on('mouseover',function(e){
      clearTimeout(class_var.timeout);
      if (class_var.finishedCallback) {
        clearTimeout(class_var.finalTimeout);
      }
      var timeRan = new Date().valueOf()-class_var.stTime;
      class_var.timeLeft -= timeRan;
      $(class_var.element).css({
        'background-color': lightenDarkenColor( class_var.color, -20)
      });
    });

    $(class_var.element).on('mouseout', function(e){
      if (class_var.timeLeft > 0) {
        class_var.timeout = setTimeout(class_var.func, class_var.timeLeft + 250);
        if (class_var.finishedCallback) {
          class_var.finalTimeout = setTimeout(class_var.finishedCallback, class_var.timeLeft);
        }
        class_var.stTime = new Date().valueOf();
        $(class_var.element).css({
          'background-color': class_var.color
        });
      }
    });
  }

  var lightenDarkenColor = function (col, amt) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }
    var g = (num & 0x0000FF) + amt;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

})(jQuery);

(function($){
  const cssText = `@import url("https://fonts.googleapis.com/css?family=Ubuntu");#alertNotify_main_container{font-family:'Ubuntu', sans-serif;opacity:1;position:fixed;z-index:999999999;color:white;transition:opacity .5s ease-in;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#alertNotify_main_container.top_right{top:12px;right:12px}#alertNotify_main_container.top_left{top:12px;left:12px}#alertNotify_main_container.bottom_right{bottom:12px;right:12px}#alertNotify_main_container.bottom_left{bottom:12px;left:12px}#alertNotify_main_container .alertNotify_{max-width:300px;margin:6px 0;transition:all 0.3s ease-in-out;transform:translate(0px);opacity:1}#alertNotify_main_container .alertNotify_ .alertNotify_body{display:flex;justify-content:space-between;align-items:center;padding:7px 0}#alertNotify_main_container .alertNotify_ .alertNotify_body .alertNotify_icon_text_container{display:flex;justify-content:center;align-items:center;padding:7px 0}#alertNotify_main_container .alertNotify_ .alertNotify_body .alertNotify_icon_text_container .alertNotify_type_icon_container .alertNotify_type_icon{display:flex;align-items:center;padding:0 10px;color:white;font-weight:900;font-size:15px}#alertNotify_main_container .alertNotify_ .alertNotify_body .alertNotify_icon_text_container .alertNotify_text_div{padding:0 10px}#alertNotify_main_container .alertNotify_ .alertNotify_body .alertNotify_icon_text_container .alertNotify_text_div .alertNotify_text{color:white;word-break:break-all;font-size:16px}#alertNotify_main_container .alertNotify_ .alertNotify_body .alertNotify_icon_text_container .alertNotify_text_div .alertNotify_text .alertNotify_notify-link-btn{padding:3px;text-transform:uppercase;color:#ea0505}#alertNotify_main_container .alertNotify_ .alertNotify_body .alertNotify_close_notification_container .alertNotify_close_notification{height:35px;padding:0 10px;color:white;font-size:20px;cursor:pointer}#alertNotify_main_container .alertNotify_.animation_left{transition:all 0.25s ease-in;transform:translateX(-27px);opacity:0}#alertNotify_main_container .alertNotify_.animation_right{transition:all 0.25s ease-in;transform:translateX(27px);opacity:0}#alertNotify_main_container .alertNotify_.animation_up{transition:all 0.25s ease-in;transform:translateY(-27px);opacity:0}#alertNotify_main_container .alertNotify_.animation_down{transition:all 0.25s ease-in;transform:translateY(27px);opacity:0}`;

  const head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    // This is required for IE8 and below.
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(document.createTextNode(cssText));
  }
  head.appendChild(style);
})(jQuery);
