View = (function(){
    function View(_evt, _clist){
        this.events = _evt;
        this._render_patten = /:\w+:/g;
        this._window_width = window.innerWidth;
        this._window_height = window.innerHeight;
        this._columns_nr = Math.floor((this._window_width * 0.7) / 200);
        this._templete = {
            column : '<div class="column" id=":id:" style="width::width:;top::top:"></div>',
            card : '<a href=":link:"><div class="card invisibile" id="card:id:"><div class="cardcontent"><h2>:title:</h2>:content:</div></div></a>',
            article : '<h1>:title:</h1><p class="metainfo">:author: | :date:</p><hr>:content:<hr><hr><p class="back" onclick="history.go(-1);">Back</p><p>Last Post</p><p>Next Post</p>',
            top : '<ul id="cates">:cates:</ul>',
            category : '<a href=":link:"><li id="cate:id:" class="topcategory">:name:</li></a>'
        };
        this.columns = [];
        for (var i=0; i<this._columns_nr; i++){
            this._('category').innerHTML += this._render(this._templete.column, 
                {id:'col'+i, 
                width:100/this._columns_nr+'%', 
                top:30*Math.abs(i-(this._columns_nr-1)/2)+0.2*this._window_height+'px'});
            this.columns[i] = {};
            this.columns[i].id = 'col'+i;
        }
    }
    View.prototype.col = [];
    View.prototype.top = [];
    View.prototype.displayTop = function (_cates, _select){
        var _this = this;
        var listCategory = function (_cates){
            var res = '';
            for (var i=0; i<_cates.length; i++){
                res += _this._render(_this._templete.category, _cates[i]);
            }
            return res;
        };
        this._('topcontent').innerHTML = this._render(this._templete.top, {'cates':listCategory(_cates)});
        this._('cate'+_select).classList.add('selected');
    };
    View.prototype.displayArticle = function (_art){
        this._('article').innerHTML = this._render(this._templete.article, _art);
    };
    View.prototype.insertPage = function (_page){
        _page.posts = _page.posts || [];
        for (var i=0; i<_page.posts.length; i++){
            var min = 0;
            for (var j=1; j<this._columns_nr; j++){
                if (this.columnBottom(j) < 
                    this.columnBottom(min))
                    min = j;
            }
            var top = this.columnBottom(min);
            this.insert(min, _page.posts[i]);
            this.col['card'+_page.posts[i].id] = min;
            this.top['card'+_page.posts[i].id] = top;
            this.events.dispatch(this._('card'+_page.posts[i].id),
                                'cardReady');
        }
    };
    View.prototype.wrap = function (s){
        return (s.replace(/<img.*?((\/|)>|.*<\/img>)/g, '<div class="imgOuter">$&</div>'));
    };
    View.prototype.insert = function(_col, _art){
        console.debug(_art);
        _art.content = this.wrap(_art.content);
        this._(this.columns[_col].id).innerHTML += this._render(this._templete.card, _art);
    };
    View.prototype._render = function(_templete, _content){
        str = _templete;
        substr = str.match(this._render_patten) || [];
        for (var i=0; i<substr.length; i++){
            str = str.replace(substr[i], _content[substr[i].slice(1, -1)]||'');
        }
        return str;
    };
    View.prototype._ = function(_id){
        return document.getElementById(_id);
    };
    View.prototype.columnBottom = function(_col){
        var style = window.getComputedStyle(this._('col'+_col));
        return 1*style.top.slice(0, -2) + 1*style.height.slice(0, -2);
    };
    View.prototype.clearCategory = function(){
        for (var i=0; i<this._columns_nr; i++)
            this._('col'+i).innerHTML = '';
    };
    View.prototype.clearTop = function(){
        this._('topcontent').innerHTML = '';
    };

    return View;
})();
