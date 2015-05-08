/*
*
*   Integrator r1
*
*   @author Yuji Ito @110chang
*
*/

define([
  'mod/inherit',
  'mod/pubsub',
  'mod/utils/raf'
], function(inherit, PubSub, raf) {
  var Integrator = inherit(PubSub, {
      INTEGRATION_START: 'onIntegrationStart',
      INTEGRATION_CHANGE: 'onIntegrationChange',
      INTEGRATION_FINISH: 'onIntegrationFinish',
      //id: null,
      timer: null,
      callback: null,
      //rate: 33,
      beginning: null,
      duration: 500,
      departure: {},
      distance: {},
      destination: {},
      //params: null,
      method: 'easeInOutQuad',
      
      init: function(_params, _duration, _method, _callback) {
        var _self = this;
        //console.log(window.requestAnimationFrame);
        if (this.timer) {
          this.stop();
        }
        this.destination = _params;
        for (var i in _params) {
          //console.log(i);
          if (this[i] !== undefined) {
            this.departure[i] = this[i];
            this.distance[i] = _params[i] - this[i];
          } else {
            throw new Error('There is no such property');
          }
        }
        //this.destination = _params;
        this.duration = _duration || this.duration;
        this.method = _method || this.method;
        this.callback = _callback || null;
        
        return this;
      },
      run: function() {
        this.beginning = new Date();
        
        if (window.requestAnimationFrame === undefined) {
          throw new Error('Require RAF.');
        } else {
          this._animationLoop();
          this.publish(Integrator.INTEGRATION_START);
        }
        return this;
      },
      integrate: function() {
        var now = new Date(),
          timestamp = now.getTime() - this.beginning.getTime(),
          percent = timestamp / this.duration;
        var i, val;
        
        for (i in this.departure) {
          if (this.departure.hasOwnProperty(i)) {
            if (this.method === 'linear') {
              val =  (this.distance[i] - this.departure[i]) * percent;
            } else {
              val = this[i] = $.easing[this.method](
                percent,                 // x: percent
                this.duration * percent, // t: current time
                this.departure[i],       // b: beginning value
                this.distance[i],        // c: change In value
                this.duration            // d: duration
              );
            }
            this[i] = val;
          }
        }
        if (percent >= 1) {
          console.log('integrate stop');
          for (i in this.departure) {
            if (this.departure.hasOwnProperty(i)) {
              this[i] = this.destination[i];
            }
          }
          this.stop();
        } else {
          this.publish(Integrator.INTEGRATION_CHANGE);
        }
      },
      stop: function() {
        console.log('integrator stop');
        //clearInterval(this.timer);
        //this.timer = null;
        window.cancelAnimationFrame(this.timer);
        this.timer = null;
        
        this.publish(Integrator.INTEGRATION_FINISH);
        
        if (this.callback !== null && typeof this.callback === 'function') {
          this.callback.call(this);
        }
      },
      _animationLoop: function() {
        this.timer = window.requestAnimationFrame(
          $.proxy(this._animationLoop, this)
        );
        this.integrate();
      }
    });
  
  return Integrator;
});