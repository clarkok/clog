Events = {
    
    add : function (_element, _event, _callback){
        if (_element.addEventListener) {
            _element.addEventListener(_event, _callback, false);
        }
        else {
            _element['__callback_'+_callback] = function(){
                _callback.call(_element, evt);
            };
            _element.attachEvent('on'+_event, _element['__callback_'+_callback]);
        }
    },
    del : function (_element, _event, _callback){
        if (_element.removeEventListener) {
            _element.removeEventListener(_event, _callback, false);
        }
        else {
            _element.detachEvent('on'+_event, _element['__callback_'+_callback]);
        }
    },
    dispatch : function (_element, _event) {
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
            if (console) console.debug(e);
        }
    }
};
