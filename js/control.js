Control = (function(){
    function Control(_evt, _data, _view, _router, _animate){
        var _this = this;
        this.events = _evt;
        this.datas = _data;
        this.view = _view;
        this.router = _router;
        this.animate = _animate;
        this._stage = 'empty';
        this._arg = {};
        this.currentPage = 1;
        this._clearOut = {
            empty : function (_stage, _arg){},
            index : function (_stage, _arg){
                _this._('category').style.display = 'none';
                _this._('top').style.display = 'none';
            },
            article : function (_stage, _arg){
                _this._('articlebox').style.display = 'none';
                _this._('commentbox').style.display = 'none';
            },
            category : function (_stage, _arg){
                _this._('category').style.display = 'none';
            }
        };
        this._drawNew = {
            index : function (_stage, _arg) {
                _this._('category').style.display = 'block';
                _this._('top').style.display = 'block';
                _this.view.clearCategory();
                _this.view.clearTop();
                _this.datas.categories(function (_c){
                    if (_c){
                        for (var i=0; i<_c.length; i++){
                            _c[i].link = '#!/category/'+_c[i].id+'/';
                        }
                        _c[0].link = '';
                        _this.view.displayTop(_c, -1);
                    }
                    else {
                        alert('Loading Error');
                    }
                });
                _this.datas.category_by_id(-1, this.currentPage, function (_c){
                    if (_c){
                        for (var i=0; i<_c.posts.length; i++){
                            _c.posts[i].link = '#!/article/'+
                                _c.posts[i].id+'/';
                        }
                        _this.view.insertPage(_c);
                    }
                    else {
                        alert('Loading Error');
                    }
                });
            },
            article : function (_stage, _arg) {
                _this._('articlebox').style.display = 'block';
                _this._('commentbox').style.display = 'block';
                _this.datas.article_by_id(_arg.aid, function (_c){
                    if (_c){
                        _this.view.displayArticle(_c);
                    }
                    else {
                        alert('Loading Error');
                    }
                });
            },
            category : function (_stage, _arg) {
                _this._('category').style.display = 'block';
                _this._('top').style.display = 'block';
                _this.view.clearCategory();
                _this.view.clearTop();
                _this.datas.categories(function (_c){
                    if (_c){
                        for (var i=0; i<_c.length; i++){
                            _c[i].link = '#!/category/'+_c[i].id+'/';
                        }
                        _c[0].link = '';
                        _this.view.displayTop(_c, _arg.cid);
                    }
                    else {
                        alert('Loading Error');
                    }
                });
                _this.datas.category_by_id(_arg.cid, this.currentPage, function (_c){
                    if (_c){
                        for (var i=0; i<_c.posts.length; i++){
                            _c.posts[i].link = '#!/article/'+
                                _c.posts[i].id+'/';
                        }
                        _this.view.insertPage(_c);
                    }
                    else {
                        alert('Loading Error');
                    }
                });
            }
        };

        this.router.add('', function(_arg){
            _this.changeStage('index', _arg);
        });
        this.router.add('#', function(_arg){
            _this.changeStage('index', _arg);
        });
        this.router.add('#!', function(_arg){
            _this.changeStage('index', _arg);
        });
        this.router.add('#!/', function(_arg){
            _this.changeStage('index', _arg);
        });
        this.router.add('#!/article/:aid', function(_arg){
            _this.changeStage('article', _arg);
        });
        this.router.add('#!/article/:aid/', function(_arg){
            _this.changeStage('article', _arg);
        });
        this.router.add('#!/category/:cid', function(_arg){
            _this.changeStage('category', _arg);
        });
        this.router.add('#!/category/:cid/', function(_arg){
            _this.changeStage('category', _arg);
        });
        this.events.dispatch(window, 'hashchange');
    }

    Control.prototype.changeStage = function (_stage, _arg){
        this._clearOut[this._stage]
            .call(this._clearOut[this._stage], _stage, _arg);
        this._drawNew[_stage]
            .call(this._drawNew[_stage], this._stage, _arg);
        
        this._stage = _stage;
        this._arg = _arg;
    };
    Control.prototype._ = function(_id){
        return document.getElementById(_id);
    };

    return Control;
})();
