Control = (function(){
    function Control(_evt, _data, _view, _router){
        var _this = this;
        this.events = _evt;
        this.datas = _data;
        this.view = _view;
        this.router = _router;
        this._stage = 'empty';
        this._arg = {};
        this._clearOut = {
            empty : function (_stage, _arg){},
            index : function (_stage, _arg){
                _this._('category').style.display = 'none';
            },
            article : function (_stage, _arg){
                _this._('article').style.display = 'none';
            },
            category : function (_stage, _arg){}
        };
        this._drawNew = {
            index : function (_stage, _arg){
                //_this.animate.show(_this._('category'));
                _this._('category').style.display = 'block';
                if (_stage == 'article') return;
                _this.datas.category_by_id(0, 1, function (_c){
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
                _this._('article').style.display = 'block';
                _this.datas.article_by_id(_arg.aid, function (_c){
                    if (_c){
                        _this.view.displayArticle(_c);
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
        this.router.add('#!/article/:aid/', function(_arg){
            _this.changeStage('article', _arg);
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
