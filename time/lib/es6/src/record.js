import xs from 'xstream';
import { adapt } from '@cycle/run/lib/adapt';
function recordListener(currentTime, outListener) {
    var entries = [];
    outListener.next(entries);
    return {
        next: function (ev) {
            entries = entries.concat({ type: 'next', value: ev, time: currentTime() });
            outListener.next(entries);
        },
        error: function (error) {
            entries = entries.concat({ type: 'error', time: currentTime(), error: error });
            outListener.next(entries);
            outListener.complete();
        },
        complete: function () {
            entries = entries.concat({ type: 'complete', time: currentTime() });
            outListener.next(entries);
            outListener.complete();
        },
    };
}
function makeRecord(schedule, currentTime, interval) {
    return function record(stream) {
        var recordedStream = xs.createWithMemory({
            start: function (listener) {
                xs
                    .fromObservable(stream)
                    .addListener(recordListener(currentTime, listener));
            },
            stop: function () { },
        });
        return adapt(recordedStream);
    };
}
export { makeRecord };
//# sourceMappingURL=record.js.map