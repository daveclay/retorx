function Animated(delay) {
    var animationScheduler = new AnimationScheduler();
    var handle;

    this.getAnimationScheduler = function() {
        return animationScheduler;
    };

    this.animate = function() {
        var self = this;
        handle = animationScheduler.start(function() {
            self.update();
        }, delay);
    };

    this.stop = function() {
        animationScheduler.stop(handle);
        handle = null;
    };
}

function AnimationScheduler() {
    var self = this;

    var requestAnimationFrame = window.requestAnimationFrame || // standard
            window.mozRequestAnimationFrame || // firefox
            window.webkitRequestAnimationFrame || // Chrome and Safari
            window.msRequestAnimationFrame; // IE10

    var cancelAnimationFrame =
        window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame;

    this.start = function(fn, delay) {
        if (!requestAnimationFrame) {
            return window.setTimeout(fn, delay);
        }
        var start = new Date().getTime();
        var handle = {};

        function loop() {
            var current = new Date().getTime();
            var delta = current - start;

            if (delta >= delay) {
                fn.call();
                start = new Date().getTime();
            }
            // This isn't right.
            handle.value = requestAnimationFrame(loop);
        }

        handle.value = requestAnimationFrame(loop);
        return handle;
    };

    this.stop = function (handle) {
        if (cancelAnimationFrame) {
            cancelAnimationFrame(handle.value);
        } else {
            clearTimeout(handle);
        }
    };
}

