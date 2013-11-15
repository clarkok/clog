Control = (function(){
    function Control(_evt, _data, _view, _router, _animate, _clist){
        var _this = this;
        this.events = _evt;
        this.datas = _data;
        this.view = _view;
        this.router = _router;
        this.animate = _animate;
        this.cardlist = _clist;
        this._stage = 'empty';
        this._arg = {};
        this.currentPage = 0;
        this.currentCate = -1;
        this.prev = [];
        this.onshow = [];
        this.succ = [];
        this.empty = false;
        this._clearOut = {
            empty : function (_stage, _arg){},
            index : function (_stage, _arg){
                _this._('category').style.display = 'none';
                if (_stage == 'article')
                    _this._('top').style.display = 'none';
                var cards = document.getElementsByClassName('card');
            },
            article : function (_stage, _arg){
                _this._('articlebox').style.display = 'none';
                _this._('commentbox').style.display = 'none';
            },
            category : function (_stage, _arg){
                if (_stage == 'article')
                    _this._('top').style.display = 'none';
                _this._('category').style.display = 'none';
            }
        };
        this._drawNew = {
            index : function (_stage, _arg) {
                _this._('category').style.display = 'block';
                _this._('top').style.display = 'block';
                _this.empty = false;
                _this.view.clearCategory();
                _this.view.clearTop();
                _this.succ = [];
                _this.onshow = [];
                _this.prev = [];
                _this.currentCate = -1;
                _this.currentPage = 0;
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
                _this.loadNextPage();

                _this.events.add(_this._('category'), 'bufferEmpty', _this._loadmask = function(){
                    _this.loadNextPage();
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
                _this.empty = false;
                _this.view.clearCategory();
                _this.view.clearTop();
                _this.succ = [];
                _this.onshow = [];
                _this.prev = [];
                _this.currentCate = _arg.cid;
                _this.currentPage = 0;
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
                _this.loadNextPage();

                _this.events.add(_this._('category'), 'bufferEmpty', _this._loadmask = function(){
                    _this.loadNextPage();
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

        this.events.add(this._('category'), 'cardReady', function(e){
            _this.succ.splice(0, 0, e.target);
        });

        this.events.add(this._('category'), 'finish', function(){
            _this.check();
        });

        this.events.add(window, 'scroll', function(){
            _this.check();
        });
    }

    Control.prototype.loadNextPage = function (){
        if (this.empty) return;
        var _this = this;
        this.currentPage ++;
        this.datas.category_by_id(this.currentCate, this.currentPage, function (_c){
            if (_c){
                if (!_c.posts)
                    _c = JSON.parse(_c);
                try {
                    if (_c.posts.length < 10) {
                        _this.empty = true;
                        _this.events.del(_this._('category'), 'bufferEmpty', _this._loadmask);
                    }
                }catch (e){
                        _this.empty = true;
                        _this.events.del(_this._('category'), 'bufferEmpty', _this._loadmask);
                }
                for (var i=0; i<_c.posts.length; i++){
                    _c.posts[i].link = '#!/article/'+
                        _c.posts[i].id+'/';
                }
                _this.view.insertPage(_c);
                _this.events.dispatch(_this._('category'), 'finish');
            }
            else {
                alert('Loading Error');
            }
        });
    };

    Control.prototype.check = function (){
        scrolltop = document.body.scrollTop || document.documentElement.scrollTop;
        var tmp;
        var i=0;
        while (this.succ.length && 
               this.view.top[this.succ[this.succ.length-1].id] < scrolltop + window.innerHeight){
            tmp = this.succ.pop();
            this._(tmp.id).style.opacity = 1;
            this.onshow.push(tmp);
        }
        if ((!this.succ.length) && (!this.empty))
            this.events.dispatch(this._('category'), 'bufferEmpty');
        while (this.prev.length && 
               this.view.top[this.prev[this.prev.length-1].id] > scrolltop + 30){
            tmp = this.prev.pop();
            this._(tmp.id).style.opacity = 1;
            this.onshow.splice(0, 0, tmp);
        }
        while (this.onshow.length &&
              this.view.top[this.onshow[this.onshow.length-1].id] > scrolltop + window.innerHeight){
            tmp = this.onshow.pop();
            this._(tmp.id).style.opacity = 0;
            this.succ.push(tmp);
        }
        while (this.onshow.length &&
              this.view.top[this.onshow[0].id] < scrolltop + 30){
            tmp = this.onshow[0];
            this.onshow.splice(0, 1);
            this._(tmp.id).style.opacity = 0;
            this.prev.push(tmp);
        }
    };

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

    Control.prototype.scroll = function(_top){
    };

    return Control;
})();
