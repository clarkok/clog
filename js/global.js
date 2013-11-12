var events, router, control, data, animate, view;

window.onload = function(){
    events = new Events();
    router = new Router(events);
    data = new Data(events);
    animate = new Animate(events);
    view = new View(events);
    control = new Control(events, data, view, router, animate);
};
