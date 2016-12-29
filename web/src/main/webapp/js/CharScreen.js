function CharScreen(id, text, delay) {
    var self = $.extend(this, new Animated(delay));
    var container = div('char-screen-container char-screen-container-' + id);
    var index = 0;

    this.getElement = function () {
        return container;
    };

    this.css = function (css) {
        container.css(css);
    };

    this.update = function () {
        if (text.length == 0) return;
        if (index == text.length) {
            container.hide();
            self.stop();
            setTimeout(function() {
                container.show();
                container.text("");
                index = 0;
                self.update();
            }, 200);
        } else if (index < text.length) {
            var ch = text.charAt(index);
            container.append(ch);
        }
        index++;
    };

    this.setText = function (_text) {
        text = _text;
    };
}


function Glitch() {
    var elements = [];
    var minDelay = 100;

    this.addElement = function (element) {
        elements.push(element);
    };

    this.update = function () {
        var elem = this.pickRandomElement();
        if (elem) {
            this.flicker(elem);
        }
        this.trigger();
    };

    this.flicker = function (elem) {
        elem.hide();
        setTimeout(function () {
            elem.show();
        }, Math.round(Math.random() * minDelay));
    };

    this.pickRandomElement = function () {
        var idx = Math.round(Math.random() * (elements.length - 1));
        return elements[idx];
    };
}

$(document).ready(function () {
    var text = 'lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384 options=3<RXCSUM,TXCSUM> inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 inet 127.0.0.1 netmask 0xff000000 inet6 ::1 prefixlen 128 gif0: flags=8010<POINTOPOINT,MULTICAST> mtu 1280 stf0: flags=0<> mtu 1280 en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500 ether 14:10:9f:d2:b7:a9 inet6 fe80::1610:9fff:fed2:b7a9%en0 prefixlen 64 scopeid 0x4 inet 192.168.246.232 netmask 0xfffffe00 broadcast 192.168.247.255';
    var charScreen = new CharScreen("hi", text, 40);
    var elem = charScreen.getElement();
    $('body').append(elem);

    charScreen.animate();

});

