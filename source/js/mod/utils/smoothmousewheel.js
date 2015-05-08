/*
*
*   Utils.smoothMouseWheel r1
*
*   @author Yuji Ito @110chang
*
*/

define([
	'mod/inherit',
	'mod/pubsub',
	'mod/utils/boundary',
	'mod/utils/browser',
	'mod/utils/raf'
], function(inherit, PubSub, boundary, Browser) {
	var _instance = null,
		
		$target, pos, disp, limit,
		speed = Browser.platform.windows ? 400 : 200,
		publisher = inherit(PubSub).init(),
		
		smoothMouseWheel = function() {
			var init = function() {
					$target = Browser.WebKit ? $('body') : $('html');
					pos = $target.scrollTop();
					
					return this;
				},
				wheel = function(delta) {
					pos = $target.scrollTop() - speed * delta;
					
					$target.stop().animate({
						scrollTop: pos
					}, 500, 'easeOutQuad');
				},
				update = function(y) {
					pos = y;
				},
				getPos = function() {
					return pos;	
				};
				
			return {
				init: init,
				wheel: wheel,
				update: update,
				getPos: getPos
			};
		};
		
		if (!_instance) {
			_instance = smoothMouseWheel();
		}
	
	return _instance;
});
