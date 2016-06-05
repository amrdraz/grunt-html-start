(function(global) {
    var Modal = global.Modal;
    var Observer = global.observer;
    var util = global.util;


    global.observer.on('modal.open', function(opt) {
        util.analyticsEvent('modal', 'open', opt.id);
    });
    global.observer.on('modal.close', function(opt) {
        util.analyticsEvent('modal', 'close');
    });

    $('.btn').on('click', open);

    function open() {
        global.observer.emit('modal.open', { id: $(this).attr('data-target') });
    }

    if (!util.getData()) {
        $.getJSON('json/data.json', function(data) {
            util.setData(data);
        });
    }
})(window);
