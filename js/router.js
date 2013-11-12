Router = (function(){
    function Router(_evt, _rules){
        var _this = this;
        _rules = _rules || [];
        this.events = _evt;
        this.pattens = {vairable:/:\w+/g};
        this.rules = [];
        for (var i=0; i<_rules.length; i++){
            this.add(_rules[i].rule, _rules[i].handler);
        }
        this.events.add(window, 'hashchange', function(){
            return _this.dispatch();
        });
    }
    Router.prototype.dispatch = function(){
        var path = window.location.hash.toString();
        path += '$';
        for (var i=0; i<this.rules.length; i++){
            if (-1 == path.search(new RegExp('^'+
                    this.rules[i].rule.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')    // escape the RegExp chars
                        .replace(this.pattens.vairable, '\\w+')+'$')))
                continue;

            substr = this.rules[i].rule.split(this.pattens.vairable) || [];
            vairs = this.rules[i].rule.match(this.pattens.vairable) || [];

            tmppath = path;
            args = {};
            for (var j=0; j<vairs.length; j++){
                tmppath = tmppath.slice(substr[j].length);
                args[vairs[j].slice(1)] = tmppath.slice(0, tmppath.search(substr[j+1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')));
            }
            this.rules[i].handler.call(this.rules[i].handler, args);
            break;
        }
    };
    Router.prototype.add = function(_rule, _handler){
        var r = {};
        r.rule = _rule+'$';
        r.handler = _handler;
        this.rules.push(r);
    };
    return Router;
})();
