(function test($) {
	let cookieScroll = ('; '+document.cookie).split(`; height=`).pop().split(';')[0];
	$.fn.autoscroll = function(options) {
		var settings = $.extend({}, $.fn.autoscroll.defaults, options);
		return this.each(function() {
			var $this = $(this);
			if ($this.length > 0 && cookieScroll > $this[0].clientHeight) {
				var scrollTimer,
					scrollTop = 0;

				function scrollList() {
					var itemHeight = $this.children().eq(1).outerHeight(true);
					scrollTop++;
					if (scrollTop >= itemHeight) {
						$this.scrollTop(0).children().eq(0).appendTo($this);
						scrollTop = 0;
					} else {
						$this.scrollTop(scrollTop);
					}
				}

				$this.hover(function() {
					$this.css("overflow-y", "auto");
					if (settings.hideScrollbar) {
						$this.addClass("hide-scrollbar");
					}
					if($.type(settings.handlerIn) === "function") {
						settings.handlerIn();
					}
				}, function() {
					$this.css("overflow-y", "hidden");
					scrollTimer = setInterval(function() {
						scrollList();
					}, settings.interval);
					if($.type(settings.handlerOut) === "function") {
						settings.handlerOut();
					}
				}).trigger("mouseleave");
			}
		});
	}
	$.fn.autoscroll.defaults = {
		interval: 15,  //25
		hideScrollbar: true,
		handlerIn: null,
		handlerOut: null

	};
	$(function() {
		$("[data-autoscroll]").autoscroll();
	});
})(jQuery);
