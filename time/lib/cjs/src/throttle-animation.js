"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = require("xstream");
var adapt_1 = require("@cycle/run/lib/adapt");
function makeThrottleAnimation(timeSource, schedule, currentTime) {
    return function throttleAnimation(stream) {
        var source = timeSource();
        var throttledStream = xstream_1.default.create({
            start: function (listener) {
                var lastValue = null;
                var emittedLastValue = true;
                var frame$ = xstream_1.default.fromObservable(source.animationFrames());
                var animationListener = {
                    next: function (event) {
                        if (!emittedLastValue) {
                            listener.next(lastValue);
                            emittedLastValue = true;
                        }
                    },
                };
                xstream_1.default.fromObservable(stream).addListener({
                    next: function (event) {
                        lastValue = event;
                        emittedLastValue = false;
                    },
                    error: function (err) {
                        listener.error(err);
                    },
                    complete: function () {
                        frame$.removeListener(animationListener);
                        listener.complete();
                    },
                });
                frame$.addListener(animationListener);
            },
            stop: function () { },
        });
        return adapt_1.adapt(throttledStream);
    };
}
exports.makeThrottleAnimation = makeThrottleAnimation;
//# sourceMappingURL=throttle-animation.js.map