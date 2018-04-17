import xs from 'xstream';
import { adapt } from '@cycle/run/lib/adapt';
function makeThrottleListener(schedule, currentTime, period, listener, state) {
    return {
        next: function (value) {
            var lastEventTime = state.lastEventTime;
            var time = currentTime();
            var timeSinceLastEvent = time - lastEventTime;
            var throttleEvent = timeSinceLastEvent <= period;
            if (throttleEvent) {
                return;
            }
            schedule.next(listener, time, value);
            state.lastEventTime = time;
        },
        error: function (error) {
            listener.error(error);
        },
        complete: function () {
            schedule.complete(listener, currentTime());
        },
    };
}
function makeThrottle(createOperator) {
    var _a = createOperator(), schedule = _a.schedule, currentTime = _a.currentTime;
    return function throttle(period) {
        return function throttleOperator(stream) {
            var state = { lastEventTime: -Infinity }; // so that the first event is always scheduled
            var throttledStream = xs.create({
                start: function (listener) {
                    var throttleListener = makeThrottleListener(schedule, currentTime, period, listener, state);
                    xs.fromObservable(stream).addListener(throttleListener);
                },
                stop: function () { },
            });
            return adapt(throttledStream);
        };
    };
}
export { makeThrottle };
//# sourceMappingURL=throttle.js.map