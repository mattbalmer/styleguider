function sticky(selector, position) {
    function getBodyOffset(body) {
        return {
            top: body.offsetTop,
            left: body.offsetLeft
        };
    }
    function getOffset(elem) {
        var docElem,
            body,
            win,
            clientTop,
            clientLeft,
            scrollTop,
            scrollLeft,
            box = {
                top: 0,
                left: 0
            },
            doc = elem && elem.ownerDocument;

        if(!doc) {
            return;
        }
        if((body = doc.body) === elem) {
            return getBodyOffset(elem);
        }
        docElem = doc.documentElement;
        if(typeof elem.getBoundingClientRect !== "undefined") {
            box = elem.getBoundingClientRect();
        }
        win = window;
        clientTop = docElem.clientTop || body.clientTop || 0;
        clientLeft = docElem.clientLeft || body.clientLeft || 0;
        scrollTop = win.pageYOffset || docElem.scrollTop;
        scrollLeft = win.pageXOffset || docElem.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    }

    $(function() {
        var offset = getOffset(document.querySelector(selector)).top - parseInt(position);

        window.addEventListener('scroll', function(event) {
            var elm = document.querySelector(selector);

            if(offset < document.body.scrollTop) {
                $(elm).addClass('sticky');
            } else {
                $(elm).removeClass('sticky');
            }
        });
    })
}