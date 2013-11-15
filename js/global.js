var events, router, control, data, animate, view;
var inited = 0;

window.onload = function(){
    if (inited) return;
    inited = 1;
    events = new Events();
    router = new Router(events);
    data = new Data(events);
    animate = new Animate(events);
    view = new View(events);
    control = new Control(events, data, view, router, animate);
};

if (document.addEventListener){
    document.addEventListener("DOMContentLoaded", function(){
        document.removeEventListener("DOMContentLoaded", arguments.callee, false);
        if (inited) return;
        inited = 1;
        events = new Events();
        router = new Router(events);
        data = new Data(events);
        animate = new Animate(events);
        view = new View(events);
        control = new Control(events, data, view, router, animate);
    }, false);
}
