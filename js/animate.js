Animate = (function(){
    function Animate(_evt){
        this.events = _evt;
    }

    Animate.prototype.fire = function(_element, _last_name){
        if (_element._last_animate){
            if (_last_name && _element._last_animate.style[_last_name]){
                if(--_element._last_animate.rest){
                    return;
                }
            }
        }
        if (!_element._animate)  return;
        if (!_element._animate.length) return;
        var ani = _element._animate[0];
        _element._last_element = {
            style : ani.style,
            rest : ani.style.length
        };
        _element._animate = _element._animate.slice(1);
        setTimeout(function(){
            for (var attr in ani.style){
                _element.style[attr] = ani.style[attr];
            }
        }, ani.delay);
    };

    Animate.prototype.add = function(_element, _style, 
                                    _delay, _callback){
        var _this = this;
        _delay = _delay || 0;
        _callback = _callback || function(){};
        if (!_element._animate){
            _element.style.transition
            this.events.add(_element, 'transitionend', function(e){
                if (e.target != _element) return;
                _this.fire(_element, e.propertyName);
            });
        }
        _element._animate = _element._animate || [];
        _element._animate.push({
            'style': _style,
            'delay': _delay,
            'callback': _callback
        });
        if (_element._animate.length == 1){
            this.fire(_element);
        }
        return this;
    };

    return Animate;
})();
