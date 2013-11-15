Events = (function(){
    function Events (){
    }
    Events.prototype._callback = function (_element, _event, _e) {
        for (var i=0; i<_element._callbacks[_event].length; i++){
            _element._callbacks[_event][i].call(_element._callbacks[_event][i], _e);
        }
    };
    Events.prototype.add = function (_element, _event, _callback){
        _this = this;
        _element._callbacks = _element._callbacks || {};
        if (!_element._callbacks[_event]){
            if (_element.addEventListener){
                _element.addEventListener(_event, function(_e){
                    _this._callback(_element, _event, _e);
                }, false);
            }
            else{
                _element.attachEvent('on'+_event, function(){
                    _this._callback(_element, _event, window.event);
                }, false);
            }
        }
        _element._callbacks[_event] = _element._callbacks[_event] || [];
        _element._callbacks[_event].push(_callback);
    };
    Events.prototype.del = function (_element, _event, _callback){
        if (!_element._callbacks) return;
        if (!_element._callbacks[_event]) return;
        for (var i=0; i<_element._callbacks[_event].length; i++){
            if (_element._callbacks[_event][i] == _callback){
                _element._callbacks[_event].splice(i, 1);
            }
        }
    };
    Events.prototype.dispatch = function (_element, _event) {
        try {
            if (_element.dispatchEvent){
                var _e = document.createEvent('Event');
                _e.initEvent(_event, true, true);
                _element.dispatchEvent(_e);
            }
            else {
                _element.fireEvent('on'+_event);
            }
        } catch(e){
            if (console.debug) console.debug(e);
            else console.log(e);
        }
    };
    return Events;
})();
