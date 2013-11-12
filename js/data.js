Data = (function(){
    function Data(_evt){
        this.events = _evt;
        this.pattens = {
            'article_by_id': 'backend/ajax/article/:aid:',
            'category_by_id': 'backend/ajax/category/:cid:/:page:',
            'categories': 'backend/ajax/categories'
        };
    }
    Data.prototype._ajax = function (_a) {
        var xhr = new XMLHttpRequest();
        _a.method = _a.method || 'GET';
        _a.url = _a.url || '';
        _a.async = _a.async || true;
        _a.success = _a.success || null;
        _a.error = _a.error || null;
        _a.data = _a.data || '';

        xhr.open(_a.method, _a.url, _a.async);
        if (_a.success)
            this.events.add(xhr, 'load', function(e){
                try{
                    _a.success.call(_a.success, JSON.parse(xhr.responseText), xhr.status, xhr);
                }catch(er){
                    _a.success.call(_a.success, xhr.responseText, xhr.status, xhr);
                }
            });
        if (_a.error)
            this.events.add(xhr, 'error', function(e){
                _a.error.call(_a.error, xhr, xhr.status);
            });
        xhr.send(_a.data);
    };
    Data.prototype.article_by_id = function (_aid, _callback) {
        this._ajax({
            method: 'GET',
            url: this.pattens.article_by_id.replace(':aid:', ''+_aid),
            success: function(_data){
                _callback.call(_callback, _data);
            },
            error: function(xhr, status){
                _callback.call(_callback, null, status);
            }
        });
    };
    Data.prototype.category_by_id = function (_cid, _page, _callback) {
        this._ajax({
            method: 'GET',
            url: this.pattens.category_by_id.replace(':cid:', ''+_cid).replace(':page:', ''+_page),
            success: _callback,
            error: function(xhr, status){
                _callback.call(_callback, null, status);
            }
        });
    };
    Data.prototype.categories = function (_callback) {
        this._ajax({
            method: 'GET',
            url: this.pattens.categories,
            success: _callback,
            error: function (xhr, status){
                _callback.call(_callback, null, status);
            }
        });
    };
    return Data;
})();
