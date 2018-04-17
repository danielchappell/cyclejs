import xs from 'xstream';
import { adapt } from '@cycle/run/lib/adapt';
function makePeriodic(createOperator) {
    var _a = createOperator(), schedule = _a.schedule, currentTime = _a.currentTime;
    return function periodic(period) {
        var stopped = false;
        var lastEmitTime = 0;
        function scheduleNextEvent(entry, time, _schedule, _currentTime) {
            if (stopped) {
                return;
            }
            var value = entry.value + 1;
            _schedule.next(entry.stream, lastEmitTime + period, value, scheduleNextEvent);
            lastEmitTime += period;
        }
        var producer = {
            listener: null,
            start: function (listener) {
                producer.listener = listener;
                var timeToEmit = currentTime() + period;
                schedule.next(listener, timeToEmit, 0, scheduleNextEvent);
                lastEmitTime = timeToEmit;
            },
            stop: function () {
                stopped = true;
                producer.listener.complete();
            },
        };
        return adapt(xs.create(producer));
    };
}
export { makePeriodic };
//# sourceMappingURL=periodic.js.map