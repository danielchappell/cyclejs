import xs from 'xstream';
import { adapt } from '@cycle/run/lib/adapt';
function makeThrottleAnimation(timeSource, schedule, currentTime) {
    return function throttleAnimation(stream) {
        var source = timeSource();
        var throttledStream = xs.create({
            start: function (listener) {
                var lastValue = null;
                var emittedLastValue = true;
                var frame$ = xs.fromObservable(source.animationFrames());
                var animationListener = {
                    next: function (event) {
                        if (!emittedLastValue) {
                            listener.next(lastValue);
                            emittedLastValue = true;
                        }
                    },
                };
                xs.fromObservable(stream).addListener({
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
        return adapt(throttledStream);
    };
}
export { makeThrottleAnimation };
//# sourceMappingURL=throttle-animation.js.map